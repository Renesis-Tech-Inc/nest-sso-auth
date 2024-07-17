import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleOAuthGuard } from './guards/google-auth.guard';
import { SocialAuthService } from './social-auth.service';
import { LinkAccountDto } from './dtos/link-account.dto';
import { IResponse } from 'src/interfaces/response.interface';
import { ILogin } from '../auth/interface/login.iterface';
import { env } from 'process';
import ESteps from './enums/steps.enum';
import { EResponseMessages } from 'src/enums/response-messages.enum';
/**
 * Controller responsible for handling social authentication endpoints.
 * @Controller('social-auth')
 */
@Controller('social-auth')
@ApiTags('social-auth')
export class SocialAuthController {
  constructor(private readonly socialAuthService: SocialAuthService) {}

  /**
   * Handles the callback from social login authentication.
   *
   * This method processes the payload returned from social authentication,
   * constructs URLs with encoded tokens or user details, and redirects the
   * user to the appropriate frontend URL based on the authentication outcome.
   *
   * @param {any} req - The request object containing user and authentication details.
   * @param {any} res - The response object used to redirect the user.
   * @returns {Promise<void>} A promise that resolves once redirection is completed.
   */
  async handleSocialCallback(req: any, res: any): Promise<void> {
    const payload = await this.socialAuthService.socialLogin(req.user);

    if (payload && payload.token && payload.user) {
      const token = JSON.stringify(payload.token);
      const user = JSON.stringify(payload.user);
      const encodedToken = Buffer.from(token).toString('base64');
      const encodedUser = Buffer.from(user).toString('base64');

      // Redirect to login route with token and user details
      res.redirect(
        `${env.FRONT_URL}/login/google?token=${encodedToken}&user=${encodedUser}`,
      );
    } else if (payload.nextStep === ESteps.ACCOUNT_LINKING) {
      // Redirect to account linking route with provider details
      const providerId = Buffer.from(req.user.providerId).toString('base64');
      const provider = Buffer.from(req.user.provider).toString('base64');
      const encodedEmail = Buffer.from(req.user.email).toString('base64');
      res.redirect(
        `${env.FRONT_URL}/link-account?otp_token=${encodedEmail}&providerId=${providerId}&provider=${provider}`,
      );
    }
  }

  /**
   * Handles Google login.
   * @summary Google Login
   * @description Initiates the Google OAuth authentication process.
   * @returns {Promise<void>}
   * @HttpCode HttpStatus.OK
   * @UseGuards GoogleOAuthGuard
   * @Get('/google')s
   */
  @Get('/google')
  @ApiOperation({
    summary: 'Google Login',
    description: 'Initiates the Google OAuth authentication process.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleOAuthGuard)
  async googleLogin(): Promise<void> {
    return;
  }

  /**
   * Handles Google login callback.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @summary Google Login Callback
   * @returns {Promise<void>} The response object with payload and message.
   * @Get('/google/callback')
   * @UseGuards GoogleOAuthGuard
   */
  @Get('/google/calback')
  @ApiOperation({
    summary: 'Google Login Callback',
    description:
      'Handles the callback after successful Google OAuth authentication.',
  })
  @UseGuards(GoogleOAuthGuard)
  async googleLoginCallback(@Req() req: any, @Res() res: any): Promise<void> {
    if (req?.query?.error) {
      // User denied the permission or an error occurred in the OAuth process
      return res.redirect(`${env.FRONT_URL}/login`);
    }
    await this.handleSocialCallback(req, res);
  }

  /**
   * Handles linking additional accounts.
   * @summary Link Account
   * @description Verifies the email address of a user by confirming the OTP (One-Time Password) sent to their email.
   * @param {LinkAccountDto} linkAccount - The link account DTO.
   * @returns {Promise<IResponse<ILogin>>} The response object.
   * @Post('/link-accounts')
   * @HttpCode HttpStatus.OK
   * @ApiBody {LinkAccountDto}
  
   */
  @Post('/link-accounts')
  @ApiBody({ type: LinkAccountDto })
  @ApiOperation({
    summary: 'Link Account',
    description:
      'Verifies the email address of a user by confirming the OTP sent to their email.',
  })
  @HttpCode(HttpStatus.OK)
  async linkAccount(
    @Body() linkAccount: LinkAccountDto,
  ): Promise<IResponse<ILogin>> {
    const payload: ILogin =
      await this.socialAuthService.linkAccount(linkAccount);

    if (payload.nextStep === ESteps.VERIFY_EMAIL) {
      return {
        statusCode: HttpStatus.OK,
        message: EResponseMessages.OTP_VERIFIED,
        payload: payload,
      };
    }
    return {
      statusCode: HttpStatus.OK,
      message: EResponseMessages.OTP_VERIFIED,
      payload: payload,
    };
  }
}
