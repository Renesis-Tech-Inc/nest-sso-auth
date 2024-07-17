import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Data transfer object (DTO) representing login credentials.
 *
 * This class defines the structure for login credentials including email and password.
 */
export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'invalid email address.' })
  @ApiProperty({ type: String, title: 'email' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, title: 'password' })
  password: string;
}
