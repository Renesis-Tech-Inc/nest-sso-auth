import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './modules/common/common.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { I18nConfigModule } from './i18n/i18n.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { I18nInterceptor } from './interceptors/i18n.interceptor';
import { SocialAuthModule } from './modules/social-auth/social-auth.module';
import { CacheModule } from '@nestjs/cache-manager';

/**
 * Main module of the application.
 *
 * This module imports necessary modules and provides global interceptors and services.
 */
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000, // Cache the data for 60 seconds (60 * 1000 milliseconds).
    }),
    CommonModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    I18nConfigModule,
    SocialAuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: I18nInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
