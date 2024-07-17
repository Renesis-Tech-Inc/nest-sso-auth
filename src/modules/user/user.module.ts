import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { UserProvider } from './user.model';
import { AuthHelperService } from 'src/helper/auth.helper';
import { S3Service } from '../common/services/s3.service';

/**
 * Module for managing user-related functionality.
 *
 * This module imports the DatabaseModule for database connectivity,
 * provides the UserController for handling user-related endpoints,
 * and includes UserService, UserProvider, AuthHelperService, and S3Service
 * as providers for managing user data, authentication helpers, and file storage.
 */
@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, UserProvider, AuthHelperService, S3Service],
  exports: [UserService, UserProvider, AuthHelperService, S3Service],
})
export class UserModule {}
