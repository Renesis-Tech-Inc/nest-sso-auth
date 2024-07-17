import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from 'src/transformers/model.transformer';
import { User } from '../user/user.model';
import { MongooseModel } from 'src/interfaces/mongoose.interface';
import { AuthHelperService } from 'src/helper/auth.helper';
import { ILogin } from '../auth/interface/login.iterface';
import { LinkAccountDto } from './dtos/link-account.dto';
import ESteps from './enums/steps.enum';
import { EErrorMessages } from 'src/enums/error-messages.enum';
import { EmailService } from '../common/services/email.service';
import { EEmailSubjectKeys } from 'src/enums/email-subject-keys.enum';
import { registrationTemplate } from 'src/templates/registration';

@Injectable()
export class SocialAuthService {
  constructor(
    @InjectModel(User) private readonly userModel: MongooseModel<User>,
    private readonly authHelperService: AuthHelperService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Initiates the social OAuth authentication process for a user.
   * If the user with the provided email does not exist, creates a new user with the provided details.
   * If the user exists, generates and sends an OTP (One-Time Password) for email verification.
   * @param {Object} data - The data containing user details.
   * @param {string} data.email - The email of the user.
   * @param {string} data.fullName - The full name of the user.
   * @param {string} data.providerId - The ID provided by the authentication provider (e.g., social).
   * @param {string} data.provider - The authentication provider (e.g., PROVIDERS.social).
   * @returns {Promise<ILogin>} The login response containing the user and authentication token, or null if an OTP is sent for email verification.
   */
  async socialLogin({
    email,
    fullName,
    providerId,
    provider,
  }: {
    email: string;
    fullName: string;
    providerId: string;
    provider: string;
  }): Promise<ILogin> {
    let user = await this.userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      const body = {
        fullName: fullName,
        email: email,
        providers: [
          {
            providerId: providerId,
            provider: provider,
          },
        ],
      };

      user = await this.userModel.create(body);

      const token = user.token(user);

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

    const socialProvider = await this.userModel.findOne({
      $and: [
        { _id: user._id },
        {
          providers: {
            $elemMatch: {
              providerId: providerId,
              provider: provider,
            },
          },
        },
      ],
    });
    if (!socialProvider) {
      const OTP = this.authHelperService.generateOTP();

      const OTPExpireAt = this.authHelperService.generateExpiryTime();

      this.emailService.sendMail({
        to: email,
        subject: EEmailSubjectKeys.ACCOUNT_LINKING_SUBJECT,
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
        nextStep: ESteps.ACCOUNT_LINKING,
      };
    }

    const token = user.token(user);

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
   * Links an additional account to an existing user based on provided details.
   * Verifies the OTP (One-Time Password) sent to the user's email for security purposes.
   * If the OTP is valid and the user's email is verified, links the account and returns the user information along with an authentication token.
   * If the OTP is invalid or expired, or if the user's email is not verified, returns the appropriate error.
   * @param {LinkAccountDto} linkAccount - The data containing account linking details.
   * @param {string} linkAccount.email - The email of the user.
   * @param {string} linkAccount.otp - The OTP entered by the user for verification.
   * @param {string} linkAccount.providerId - The ID provided by the authentication provider (e.g., Social).
   * @returns {Promise<ILogin>} The login response containing the user and authentication token, or an object indicating the next step in the authentication process.
   * @throws {HttpException} If the OTP is invalid or expired, or if the user's email is not verified.
   */
  async linkAccount(linkAccount: LinkAccountDto): Promise<ILogin> {
    let user = await this.userModel.findOne(
      {
        $and: [
          {
            OTP: Number(linkAccount.otp),
          },
          {
            email: linkAccount.email,
          },
        ],
      },
      { OTPExpireAt: true, emailVerifiedAt: true },
    );

    if (!user) {
      throw new HttpException(EErrorMessages.INVALID_OTP, HttpStatus.NOT_FOUND);
    }

    if (Date.now() > user?.OTPExpireAt) {
      throw new HttpException(EErrorMessages.OTP_EXPIRED, HttpStatus.CONFLICT);
    }
    await this.userModel.findOneAndUpdate(
      { _id: user._id, 'providers.provider': { $ne: linkAccount.provider } },
      {
        $push: {
          providers: {
            providerId: linkAccount.providerId,
            provider: linkAccount.provider,
          },
        },
        emailVerifiedAt: new Date(),
      },
    );

    const token = user.token(user);

    user = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        emailVerifiedAt: new Date(),
      },
    );

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
}
