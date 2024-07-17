import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

/**
 * Data transfer object (DTO) representing update password.
 *
 * This class defines the structure for update password
 *
 * @class RegisterDto
 */
export class UpdatePasswordDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, title: 'password' })
  oldPassword: string;

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
