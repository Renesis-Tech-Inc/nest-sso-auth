import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Injectable guard for handling Google OAuth authentication using Passport.js.
 * Extends the AuthGuard class with the 'google' strategy.
 * Provides configuration options for Google OAuth.
 * @class
 * @name GoogleOAuthGuard
 */
@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  /**
   * Creates an instance of GoogleOAuthGuard.
   * Initializes the guard with configuration options for Google OAuth.
   * @constructor
   */
  constructor() {
    super({
      /**
       * The type of access requested. 'offline' indicates a refresh token should be returned.
       * @type {string}
       */
      accessType: 'offline',
      /**
       * Indicates that the user should be prompted to select an account when logging in.
       * @type {string}
       */
      prompt: 'consent',
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { error } = request.query;

    // Allow the request to pass through if there's an error parameter
    if (error) {
      return true;
    }

    // Continue with the usual authentication process if there's no error
    return (await super.canActivate(context)) as boolean;
  }
}
