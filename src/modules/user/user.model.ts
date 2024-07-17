import { DocumentType, modelOptions, prop } from '@typegoose/typegoose';
import * as jwt from 'jsonwebtoken';

import { IToken } from '../auth/interface/auth-token.interface';
import { env } from 'process';
import { getProviderByTypegooseClass } from 'src/transformers/model.transformer';
import { EUserRole } from 'src/enums/roles.enum';

export class Provider {
  @prop({ required: true })
  providerId: string;

  @prop({ required: true })
  provider: string;
}
@modelOptions({
  options: { customName: 'users' },
  schemaOptions: {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  },
})
export class User {
  @prop({ required: true, trim: true })
  fullName: string;

  @prop({ required: false })
  avatar?: string;

  @prop({ required: true })
  email: string;

  @prop({ required: false, select: false, default: '' })
  password: string;

  @prop({
    type: Date,
    required: false,
  })
  emailVerifiedAt?: Date;

  @prop({
    required: false,
  })
  OTPExpireAt?: number;

  @prop({ required: false })
  OTP: number;

  @prop({ required: false, default: true })
  isActive: boolean;

  @prop({ type: () => [Provider] })
  providers?: Provider[];

  @prop({
    required: false,
    enum: Object.values(EUserRole),
    type: String,
    default: EUserRole.USER,
  })
  role?: EUserRole;

  @prop({
    type: Date,
    required: false,
  })
  deletedAt?: Date;

  /**
   * Generates an authentication token and refresh token for a user.
   * @param {DocumentType<User>} user - The user document for whom the tokens are generated.
   * @returns {IToken} - An object containing the authentication token, refresh token, and expiration time.
   */
  token(user: DocumentType<User>): IToken {
    const { _id, email, fullName, isActive, role } = user;
    const token = jwt.sign(
      {
        _id,
        email,
        fullName,
        isActive,
        role,
      },
      env.JWT_TOKEN_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN },
    );

    const refreshToken = jwt.sign(
      {
        _id,
        email,
        role,
      },
      env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN },
    );
    return {
      token,
      refreshToken,
      expiresIn: 86400,
    };
  }

  /**
   * Refreshes an authentication token using a refresh token.
   * @param {string} refreshToken - The refresh token used to generate a new authentication token.
   * @returns {Promise<IToken>} - A promise containing the new authentication token, refresh token, and expiration time.
   * @throws {HttpException} - If the refresh token is invalid or expired.
   */
}

export const UserProvider = getProviderByTypegooseClass(User);
