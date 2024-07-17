import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
/**
 * Data transfer object (DTO) representing the details required to link an additional account.
 * Contains validation decorators for each property.
 * @class
 * @name LinkAccountDto
 */
export class LinkAccountDto {
  /**
   * The OTP (One-Time Password) for verification.
   * Must be a string with a length between 4 and 4 characters.
   * @type {string}
   */
  @IsNotEmpty({ message: 'OTP is required' })
  @MinLength(4, { message: 'OTP must be at least 4 characters long' })
  @MaxLength(4, { message: 'OTP must be at most 4 characters long' })
  @ApiProperty({ type: String, title: 'otp' })
  otp: string;

  /**
   * The provider ID provided by the authentication provider (e.g., Google).
   * Must be a non-empty string.
   * @type {string}
   */
  @IsNotEmpty({ message: 'providerId is required' })
  @ApiProperty({ type: String, title: 'providerId' })
  providerId: string;

  /**
   * The authentication provider (e.g., 'google').
   * Must be a non-empty string.
   * @type {string}
   */
  @IsNotEmpty({ message: 'provider is required' })
  @ApiProperty({ type: String, title: 'provider' })
  provider: string;

  /**
   * The email address associated with the user's account.
   * Must be a valid email address.
   * @type {string}
   */
  @IsNotEmpty()
  @IsEmail({}, { message: 'invalid email address.' })
  @ApiProperty({ type: String, title: 'email' })
  email: string;
}
