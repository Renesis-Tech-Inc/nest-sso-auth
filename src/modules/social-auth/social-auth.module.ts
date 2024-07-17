import { Module } from '@nestjs/common';
import { SocialAuthController } from './social-auth.controller';
import { SocialAuthService } from './social-auth.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthHelperService } from 'src/helper/auth.helper';
import { EmailService } from '../common/services/email.service';

import { S3Service } from '../common/services/s3.service';
import { UserModule } from '../user/user.module';

/**
 * Module responsible for handling social authentication using Passport.js.
 * Imports PassportModule to enable authentication strategies.
 * Provides controllers and services necessary for social authentication.
 * @module SocialAuthModule
 */
@Module({
  imports: [PassportModule, UserModule],
  controllers: [SocialAuthController],
  providers: [
    SocialAuthService,
    GoogleStrategy,
    EmailService,
    AuthHelperService,
    S3Service,
  ],
})
export class SocialAuthModule {}
