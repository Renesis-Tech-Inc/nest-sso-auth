import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Data transfer object (DTO) representing registration credentials.
 *
 * This class defines the structure for registration credentials including full name, email, and password.
 *
 * @class RegisterDto
 */
export class RegisterDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Full Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Full Name must be at most 50 characters long' })
  @ApiProperty({ type: String, title: 'fullName' })
  fullName: string;

  @IsNotEmpty()
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
