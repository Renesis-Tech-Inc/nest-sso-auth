import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import EProviders from '../enums/providers.enum';

/**
 * Passport strategy for authenticating users using Google OAuth 2.0.
 *
 * This strategy extends `PassportStrategy` and handles authentication using Google
 * OAuth 2.0 credentials. It validates the user's access token and retrieves profile
 * information including email and name.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.GOOGLE_CALLBACK_URL}`,
      scope: ['email', 'profile'],
    });
  }

  /**
   * Method to validate and process the authenticated user.
   *
   * @param {string} accessToken - Access token provided by Google OAuth.
   * @param {string} refreshToken - Refresh token provided by Google OAuth.
   * @param {any} profile - User profile information fetched from Google.
   * @param {VerifyCallback} done - Passport callback function to return user data.
   * @returns {Promise<any>} Promise returning the authenticated user object.
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, id } = profile;

    // Construct user object with necessary details
    const user = {
      providerId: id,
      provider: EProviders.GOOGLE,
      email: emails[0].value,
      fullName: name.givenName + name.familyName,
    };

    // Return the user object to complete authentication
    done(null, user);
  }
}
