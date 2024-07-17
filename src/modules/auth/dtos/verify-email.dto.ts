import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Data transfer object (DTO) representing the parameters for OTP verification.
 *
 * This class defines the structure for OTP verification, including the OTP code.
 */
export class VerifyEmailDto {
  @IsNotEmpty({ message: 'OTP is required' })
  @MinLength(4, { message: 'OTP must be at least 4 characters long' })
  @MaxLength(4, { message: 'OTP must be at most 4 characters long' })
  @ApiProperty({ type: String, title: 'otp' })
  otp: string;

  @IsOptional()
  @ApiProperty({ type: Boolean, title: 'isVerifyEmail' })
  isVerifyEmail?: boolean;

  @IsNotEmpty()
  @IsEmail({}, { message: 'invalid email address.' })
  @ApiProperty({ type: String, title: 'email' })
  email: string;
}
