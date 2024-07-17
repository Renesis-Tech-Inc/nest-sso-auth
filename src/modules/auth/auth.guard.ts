import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { User } from '../user/user.model';
import { getModelForClass } from '@typegoose/typegoose';
import { EDependencyTokens } from 'src/enums/dependency-tokens.enum';

/**
 * Decorator to allow unauthorized requests.
 *
 * This decorator sets metadata to allow certain requests to bypass authentication
 * using the `AllowUnauthorizedRequest` token.
 *
 * @returns {(...args: any[]) => void}
 */
export const AllowUnauthorizedRequest = () =>
  SetMetadata(EDependencyTokens.ALLOW_UNAUTHORIZED_REQUEST, true);

/**
 * Guard to handle authentication and authorization.
 *
 * This guard implements the `CanActivate` interface provided by NestJS and is responsible
 * for authenticating requests using JWT tokens and ensuring proper authorization based on
 * the presence of the `Authorization` header.
 *
 * @class
 * @implements {CanActivate}
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private userModel = getModelForClass(User); // Get the mongoose model for the User class

  constructor(private reflector: Reflector) {}

  /**
   * Method to determine if a route can be activated.
   *
   * This method checks the presence of the `Authorization` header in the request and validates
   * the JWT token. It also checks for the `AllowUnauthorizedRequest` metadata to allow certain
   * requests without authentication.
   *
   * @param {ExecutionContext} context - The execution context of the request.
   * @returns {Promise<boolean>} A boolean indicating whether the route can be activated.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Check if the request allows unauthorized access
    const allowUnauthorizedRequest = this.reflector.get<boolean>(
      EDependencyTokens.ALLOW_UNAUTHORIZED_REQUEST,
      context.getHandler(),
    );

    if (allowUnauthorizedRequest) {
      return true;
    }

    // Check if the authorization header is present
    if (!request.headers.authorization) {
      return false;
    }

    // Validate the JWT token
    request.user = await this.validateToken(request.headers.authorization);
    return true;
  }

  /**
   * Method to validate a JWT token.
   *
   * This method validates the JWT token extracted from the `Authorization` header of the request.
   *
   * @param {string} auth - The authorization header containing the JWT token.
   * @returns {Promise<any>} The decoded token payload if valid.
   * @throws {HttpException} Throws an exception if the token is invalid or expired.
   */
  async validateToken(auth: string): Promise<any> {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const token = auth.split(' ')[1];

    try {
      const decoded: any = await jwt.verify(
        token,
        process.env.JWT_TOKEN_SECRET,
      );
      return decoded;
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }
}
