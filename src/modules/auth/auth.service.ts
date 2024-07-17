import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MongooseModel } from 'src/interfaces/mongoose.interface';
import { InjectModel } from 'src/transformers/model.transformer';
import { User } from '../user/user.model';
import { AuthHelperService } from 'src/helper/auth.helper';
import { EmailService } from '../common/services/email.service';
import { registrationTemplate } from 'src/templates/registration';
import { forgotPasswordTemplate } from 'src/templates/forgot-password';
import { ILogin } from './interface/login.iterface';
import { resendOTPTemplate } from 'src/templates/resendOTP';
import { welcomeTemplate } from 'src/templates/welcome';
import { passwordResetConfirmationTemplate } from 'src/templates/password-reset-confirmation';
import ESteps from '../social-auth/enums/steps.enum';
import { EErrorMessages } from 'src/enums/error-messages.enum';
import { EEmailSubjectKeys } from 'src/enums/email-subject-keys.enum';
import { IdentifyDto } from './dtos/identify.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthService {
  private selectUserFields: any;
  constructor(
    @InjectModel(User) private readonly userModel: MongooseModel<User>,
    private readonly authHelperService: AuthHelperService,
    private readonly emailService: EmailService,
  ) {
    this.selectUserFields = {
      _id: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
    };
  }

  /**
   * Identifies the user based on the provided login details.
   * Retrieves user information from the database based on the provided email.
   * If the user does not exist, returns the next step as user registration.
   * If the user exists but their email is not verified, sends an OTP (One-Time Password) for email verification.
   * If the user exists and their email is verified, returns the next step as setting password.
   * @param {IdentifyDto} identifyDto - The data containing user login details.
   * @param {string} identifyDto.email - The email of the user.
   * @returns {Promise<ILogin>} The login response containing the next step in the authentication process.
   */
  async identify(identifyDto: IdentifyDto): Promise<ILogin> {
    const user = await this.userModel.findOne(
      {
        email: identifyDto.email.toLowerCase(),
      },
      {
        ...this.selectUserFields,
        password: true,
        emailVerifiedAt: true,
        role: true,
        isActive: true,
      },
    );

    if (!user) {
      return {
        nextStep: ESteps.USER_REGISTER,
      };
    }

    if (user && !user.emailVerifiedAt) {
      const OTP = this.authHelperService.generateOTP();

      const OTPExpireAt = this.authHelperService.generateExpiryTime();
      this.emailService.sendMail({
        to: identifyDto.email,
        subject: EEmailSubjectKeys.REGISTER_EMAIL_SUBJECT,
        html: registrationTemplate(user.fullName, OTP),
      });
      await this.userModel.findOneAndUpdate(
        { _id: user._id },
        {
          OTP,
          OTPExpireAt,
        },
      );
      return {
        nextStep: ESteps.VERIFY_EMAIL,
      };
    }
    return {
      nextStep: ESteps.SET_PASSWORD,
    };
  }

  /**
   * Asynchronously authenticate a user based on the provided login credentials.
   *
   * @param {LoginDto} loginDto - The DTO containing the user's login credentials.
   * @param {string} loginDto.email - The email address of the user.
   * @param {string} loginDto.password - The password associated with the user's account.
   *
   * @returns {Promise<ILogin> } An object containing the status code, message, and payload of the login operation.
   *
   * @throws {Error} Throws an error if the user is not found, the email is not verified, or the password is incorrect.
   */
  async login(loginDto: LoginDto): Promise<ILogin> {
    // Check if a user with the provided email exists
    const user = await this.userModel.findOne(
      { email: loginDto.email.toLowerCase() },
      {
        ...this.selectUserFields,
        password: true,
        emailVerifiedAt: true,
        avatar: true,
        fullName: true,
        role: true,
        isActive: true,
        OTPExpireAt: true,
      },
    );

    if (!user) {
      throw new HttpException(
        EErrorMessages.USER_NOT_EXISTS,
        HttpStatus.NOT_FOUND,
      );
    }

    // Check if the user is verified via OTP
    if (!user.emailVerifiedAt) {
      const OTP = this.authHelperService.generateOTP();

      // Generate OTP expiration time
      const OTPExpireAt = this.authHelperService.generateExpiryTime();
      this.emailService.sendMail({
        to: loginDto.email,
        subject: EEmailSubjectKeys.REGISTER_EMAIL_SUBJECT,
        html: registrationTemplate(user.fullName, OTP),
      });
      await this.userModel.findOneAndUpdate(
        { _id: user._id },
        {
          OTP,
          OTPExpireAt,
        },
      );

      throw new HttpException(
        EErrorMessages.USER_NOT_VERIFIED,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    // Check Password
    const isCorrect = this.authHelperService.comparePassword(
      loginDto.password,
      user.password || '',
    );

    if (!isCorrect) {
      throw new HttpException(
        EErrorMessages.INVALID_PASSWORD,
        HttpStatus.CONFLICT,
      );
    }

    // generating auth token
    const token = user.token(user);
    //remove pass
    user.password = '';
    return {
      user: {
        _id: String(user._id),
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
      },
      token,
    };
  }

  /**
   * Registers a new user with the provided registration details.
   *
   * @param {RegisterDto} registerDto - The registration details including full name, email, and password.
   * @throws {Error} - Throws an error if there is an issue with user creation or email sending.
   */
  async register(registerDto: RegisterDto) {
    // Check if a user with the same email already exists
    let user = await this.userModel.findOne({ email: registerDto?.email });
    if (user) {
      throw new HttpException(
        EErrorMessages.ACCOUNT_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    // Generate a hashed password
    const hashedPassword = this.authHelperService.hashPassword(
      registerDto.password,
    );

    // Generate a random OTP
    const OTP = this.authHelperService.generateOTP();

    // Generate OTP expiration time
    const OTPExpireAt = this.authHelperService.generateExpiryTime();

    // Create user body with registration details
    const body = {
      fullName: registerDto.fullName,
      email: registerDto.email,
      password: hashedPassword,
      OTP,
      OTPExpireAt,
    };

    // Uncomment the following lines when you have the emailService available
    this.emailService.sendMail({
      to: registerDto.email,
      subject: EEmailSubjectKeys.REGISTER_EMAIL_SUBJECT,
      html: registrationTemplate(registerDto.fullName, OTP),
    });

    // Create the user in the database
    user = await this.userModel.create(body);
    return user;
  }

  /**
   * Verify email.
   *
   * @param {VerifyEmailDto} verifyEmail - DTO containing data for OTP verification.
   * @returns { Promise<ILogin> } - Result of OTP verification.
   */
  async verifyEmail(verifyEmail: VerifyEmailDto): Promise<ILogin> {
    const user = await this.userModel.findOne(
      {
        $and: [
          {
            OTP: Number(verifyEmail.otp),
          },
          {
            email: verifyEmail.email.toLowerCase(),
          },
        ],
      },
      {
        ...this.selectUserFields,
        password: true,
        OTPExpireAt: true,
        emailVerifiedAt: true,
      },
    );

    // send message to user for invalid otp
    if (!user) {
      throw new HttpException(EErrorMessages.INVALID_OTP, HttpStatus.NOT_FOUND);
    }

    // check if otp expires
    if (Date.now() > user?.OTPExpireAt) {
      throw new HttpException(EErrorMessages.OTP_EXPIRED, HttpStatus.CONFLICT);
    }

    // generating auth token
    const token = user.token(user);

    await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        emailVerifiedAt: new Date(),
      },
    );

    if (verifyEmail.isVerifyEmail) {
      this.emailService.sendMail({
        to: user.email,
        subject: EEmailSubjectKeys.WELCOME_SUBJECT,
        html: welcomeTemplate(user.fullName),
      });
    }

    if (!user.password) {
      return {
        nextStep: ESteps.SETUP_PASSWORD,
      };
    }

    return {
      user: {
        _id: String(user._id),
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
      },
      token,
    };
  }

  /**
   * @summary Forgot Password
   * @description Service method to handle the "Forgot Password" functionality.
   * @param {ForgotPasswordDto} forgotPassword - The DTO containing user email for password reset.
   * @throws {HttpException} Throws an exception if user is not found, email is not verified, or other relevant EErrorMessages.
   */

  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    let user = await this.userModel.findOne(
      { email: forgotPassword.email },
      { ...this.selectUserFields, emailVerifiedAt: true },
    );

    // send message to user
    if (!user) {
      throw new HttpException(
        EErrorMessages.USER_NOT_EXISTS,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.emailVerifiedAt) {
      throw new HttpException(
        EErrorMessages.USER_NOT_VERIFIED,
        HttpStatus.CONFLICT,
      );
    }

    // generate otp
    const OTP = this.authHelperService.generateOTP();
    const OTPExpireAt = this.authHelperService.generateExpiryTime();

    //send email
    this.emailService.sendMail({
      to: forgotPassword.email,
      subject: EEmailSubjectKeys.FORGOT_PASSWORD_EMAIL_SUBJECT,
      html: forgotPasswordTemplate(user.fullName, OTP),
    });
    user = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        OTP,
        OTPExpireAt,
      },
    );
  }

  /**
   * Resends OTP (One-Time Password) to a user based on their email address.
   *
   * @param {ForgotPasswordDto} resendOTP - The DTO containing the email address of the user.
   * @returns {Promise<void>}
   * @throws {HttpException} Throws an exception if the user does not exist.
   */
  async resendOTP(resendOTP: ForgotPasswordDto): Promise<void> {
    // Find user by email and retrieve necessary fields
    let user = await this.userModel.findOne(
      { email: resendOTP.email },
      { ...this.selectUserFields, emailVerifiedAt: true, OTPExpireAt: true },
    );

    // Throw an error if user does not exist
    if (!user) {
      throw new HttpException(
        EErrorMessages.USER_NOT_EXISTS,
        HttpStatus.NOT_FOUND,
      );
    }

    // Generate a new OTP and expiry time
    const OTP = this.authHelperService.generateOTP();
    const OTPExpireAt = this.authHelperService.generateExpiryTime();

    // Send an email with the new OTP
    this.emailService.sendMail({
      to: resendOTP.email,
      subject: EEmailSubjectKeys.RESEND_OTP_EMAIL_SUBJECT,
      html: resendOTPTemplate(user.fullName, OTP), // Assuming you have a template function for OTP email
    });

    // Update user document with new OTP and expiry time
    user = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        OTP,
        OTPExpireAt,
      },
    );
  }

  /**
   * Reset the user's password using the provided OTP (One-Time Password).
   *
   * @param {ResetPasswordDto} resetPassword - The DTO containing the necessary information for password reset.
   * @param {string} resetPassword.otp - The One-Time Password sent to the user's email.
   * @param {string} resetPassword.password - The new password to be set.
   *
   *
   * @throws {Error} Throws an error if the OTP is invalid or expired.
   */
  async resetPassword(resetPassword: ResetPasswordDto) {
    let user;
    if (resetPassword.otp) {
      user = await this.userModel.findOne(
        { OTP: resetPassword.otp },
        {
          ...this.selectUserFields,
          OTPExpireAt: true,
        },
      );
    }
    if (resetPassword.email) {
      user = await this.userModel.findOne(
        { email: resetPassword.email },
        {
          ...this.selectUserFields,
          OTPExpireAt: true,
        },
      );
    }
    // send message to user for invalid otp
    if (!user) {
      throw new HttpException(EErrorMessages.INVALID_OTP, HttpStatus.NOT_FOUND);
    }

    // check if otp expires
    if (Date.now() > user?.OTPExpireAt) {
      throw new HttpException(EErrorMessages.OTP_EXPIRED, HttpStatus.CONFLICT);
    }
    // Generate a hashed password
    const hashedPassword = this.authHelperService.hashPassword(
      resetPassword.password,
    );
    this.emailService.sendMail({
      to: user.email,
      subject: EEmailSubjectKeys.PASSWORD_RESET_CONFIRMATION_EMAIL_SUBJECT,
      html: passwordResetConfirmationTemplate(user.fullName),
    });
    user = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        password: hashedPassword,
      },
    );
  }
}
