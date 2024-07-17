import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

/**
 * Data transfer object (DTO) representing update profile.
 *
 * This class defines the structure for update profile including full name
 *
 * @class RegisterDto
 */
export class UpdateProfileDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Full Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Full Name must be at most 50 characters long' })
  @ApiProperty({ type: String, title: 'fullName' })
  fullName: string;
}
