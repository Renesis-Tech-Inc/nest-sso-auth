import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO representing a base64 image.
 */
export class Base64ImageDto {
  /**
   * The base64-encoded image data.
   *
   * @type {string}
   * @example 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB...'
   * @memberof Base64ImageDto
   */
  @IsString()
  @IsNotEmpty()
  @IsBase64()
  @ApiProperty({ type: String, title: 'base64Data' })
  base64Data: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, title: 'fileName' })
  fileName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, title: 'fileType' })
  fileType: string;
}
