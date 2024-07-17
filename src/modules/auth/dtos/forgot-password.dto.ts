import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object for requesting a password reset.
 * @class
 */
export class ForgotPasswordDto {
  /**
   * User's email address for password reset.
   * @type {string}
   * @IsNotEmpty - Specifies that the email field must not be empty.
   * @IsEmail - Validates that the email address is valid.
   * @ApiProperty - Used for Swagger API documentation.
   * @ApiProperty({ type: String, title: 'email' }) - Specifies the type and title for Swagger.
   * @example 'user@example.com'
   */
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address.' })
  @ApiProperty({ type: String, title: 'email' })
  email: string;
}
