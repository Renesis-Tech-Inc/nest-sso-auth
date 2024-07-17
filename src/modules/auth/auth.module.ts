import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserProvider } from '../user/user.model';
import { EmailService } from '../common/services/email.service';
import { AuthHelperService } from 'src/helper/auth.helper';
import { UserService } from '../user/user.service';
import { S3Service } from '../common/services/s3.service';

/**
 * Module for handling authentication-related functionality.
 *
 * This module defines the controllers and providers necessary for handling
 * user authentication, including user management, authentication services,
 * email services, and helper services.
 *
 * @module
 */
@Module({
  controllers: [AuthController],
  providers: [
    UserProvider,
    AuthService,
    EmailService,
    AuthHelperService,
    UserService,
    S3Service,
  ],
})
export class AuthModule {}
