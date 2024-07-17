import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { LoginDto } from './dtos/login.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IResponse } from 'src/interfaces/response.interface';
import { EResponseMessages } from 'src/enums/response-messages.enum';
import { ILogin } from './interface/login.iterface';
import { RegisterDto } from './dtos/register.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthService } from './auth.service';
import { IdentifyDto } from './dtos/identify.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint for identifying users based on their email address.
   * Initiates the process to identify users and determine the next step in the authentication process.
   * @summary User Identify
   * @description Endpoint to identify users with an email address.
   * @param {IdentifyDto} identifyDto - The data containing the user's email address.
   * @returns {Promise<IResponse<ILogin>>} The response object containing the authentication payload.
   * @Post('/identify')
   * @HttpCode HttpStatus.OK
   * @ApiBody {IdentifyDto}
   */
  @Post('/identify')
  @ApiBody({ type: IdentifyDto })
  @ApiOperation({
    summary: 'User Identify',
    description: 'Endpoint to identify users with email .',
  })
  @HttpCode(HttpStatus.OK)
  async identify(@Body() identifyDto: IdentifyDto): Promise<IResponse<ILogin>> {
    const payload = await this.authService.identify(identifyDto);

    return {
      statusCode: HttpStatus.OK,
      message: EResponseMessages.USER_IDENTIFIED,
      payload: payload,
    };
  }

  /**
   * Handles the login process.
   *
   * @description This method receives a `LoginDto` object containing login credentials from the request body.
   * It invokes the `login` method from the `authService` to perform the login operation.
   * The result, including the authentication token and user details, is then wrapped in an `IResponse`
   * object and returned.
   *
   * @async
   * @param {LoginDto} loginDto - The data transfer object containing login credentials.
   * @returns {Promise<IResponse<{ token: IToken; user: User }>>} The response containing the login result.
   */
  @Post('/login')
  @ApiBody({ type: LoginDto })
  @ApiOperation({
    summary: 'User Login',
    description: 'Endpoint to authenticate users with email and password.',
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<IResponse<ILogin>> {
    const payload: ILogin = await this.authService.login(loginDto);

    return {
      statusCode: HttpStatus.OK,
      message: EResponseMessages.USER_LOGIN,
      payload: payload,
    };
  }

  /**
   * Controller method for user registration.
   *
   * @param {RegisterDto} registerDto - The registration data transfer object.
   * @returns {Promise<void>} Promise representing the result of the registration process.
   */
  @Post('/register')
  @ApiBody({ type: RegisterDto }) // Describes the expected request body using the RegisterDto
  @ApiOperation({
    summary: 'User Registeration',
    description:
      'Endpoint to allow users to register for a new account with email and password and fullName',
  }) // Provides a description for Swagger documentation
  @HttpCode(HttpStatus.OK) // Sets the HTTP response code for successful registration
  async register(@Body() registerDto: RegisterDto): Promise<IResponse> {
    await this.authService.register(registerDto);

    return {
      statusCode: HttpStatus.OK,
      message: EResponseMessages.USER_CREATED,
    };
  }

  /**
   * @summary Verify Email
   * @description Endpoint for verifying user email using a verification token.
   * @route POST /auth/verify-email
   * @param {VerifyEmailDto} verifyEmailDto - The DTO containing user email verification details.
   * @returns {Promise<IResponse>} The response with status code, message, and payload.
   * @throws {HttpException} Throws an exception if email verification fails with an appropriate error message.
   */
  @Post('/verify-email')
  @ApiBody({ type: VerifyEmailDto })
  @ApiOperation({
    summary: 'Verify Email',
    description:
      'Verifies the email address of a user by confirming the OTP (One-Time Password) sent to their email.',
  })
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Body() verifyEmail: VerifyEmailDto,
  ): Promise<IResponse<ILogin>> {
    const payload: ILogin = await this.authService.verifyEmail(verifyEmail);

    return {
      statusCode: HttpStatus.OK,
      message: EResponseMessages.OTP_VERIFIED,
      payload: payload,
    };
  }

  @Post('/resend-otp')
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOperation({
    summary: 'Resend OTP',
    description:
      'Initiates the process for verifying user by resending a one-time password (OTP) to their email address.',
  })
  @HttpCode(HttpStatus.OK)
  async resendOTP(@Body() resendOTP: ForgotPasswordDto): Promise<IResponse> {
    await this.authService.resendOTP(resendOTP);
    return {
      statusCode: HttpStatus.OK,
      message: EResponseMessages.OTP_RESEND,
    };
  }
  /**
   * Controller method for handling a password reset request.
   * @method POST
   * @route /forgot-password
   * @httpCode HttpStatus.OK - Specifies the HTTP status code for a successful response.
   * @param {ForgotPasswordDto} forgotPassword - The data transfer object containing the email for password reset.
   * @returns {Promise<IResponse>} - A Promise representing the response object.
   * @throws {HttpException} - Throws an HTTP exception if an error occurs.
   */
  @Post('/forgot-password')
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOperation({
    summary: 'Forgot Password',
    description:
      "Initiates the process for resetting a user's password by sending a one-time password (OTP) to their email address.",
  })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPassword: ForgotPasswordDto,
  ): Promise<IResponse> {
    await this.authService.forgotPassword(forgotPassword);
    return {
      statusCode: HttpStatus.OK,
      message: EResponseMessages.PASSWORD_RESET_EMAIL,
    };
  }

  /**
   * Reset the user's password using the provided OTP and set a new password.
   *
   * @param {ResetPasswordDto} resetPassword - The DTO containing the necessary information for resetting the password.
   * @param {string} resetPassword.otp - The one-time password (OTP) sent to the user's email for verification.
   * @param {string} resetPassword.password - The new password to set for the user's account.
   *
   * @returns {Promise<IResponse>} An object containing the status code, message, and payload of the password reset operation.
   *
   * @throws {Error} Throws an error if the provided OTP is invalid, expired, or if any other issue occurs during the password reset process.
   */
  @Post('/reset-password')
  @ApiBody({ type: ResetPasswordDto })
  @ApiOperation({
    summary: 'Reset Password',
    description:
      "Resets a user's password using the provided one-time password (OTP) and the new password.",
  })
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPassword: ResetPasswordDto,
  ): Promise<IResponse> {
    await this.authService.resetPassword(resetPassword);
    return {
      statusCode: HttpStatus.OK,
      message: EResponseMessages.PASSWORD_UPDATED,
    };
  }
}
