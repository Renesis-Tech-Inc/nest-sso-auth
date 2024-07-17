import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Data Transfer Object for  password reset.
 * @class
 */
export class ResetPasswordDto {
  @IsOptional()
  @MinLength(4, { message: 'OTP must be at least 4 characters long' })
  @MaxLength(4, { message: 'OTP must be at most 4 characters long' })
  @ApiProperty({ type: String, title: 'otp' })
  otp: string;

  @IsOptional()
  @IsEmail({}, { message: 'invalid email address.' })
  @ApiProperty({ type: String, title: 'email' })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(255, { message: 'Password must be at most 255 characters long' })
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-!$%^&*()_+|~=`{}\[\]:;"'<>,.?\\/@#])/,
    {
      message:
        'Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character',
    },
  )
  @ApiProperty({ type: String, title: 'password' })
  password: string;
}
