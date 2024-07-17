import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IResponse } from './interfaces/response.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Controller method to retrieve the API version.
   *
   * @returns {Promise<IResponse>} A promise resolving to an object containing API version information.
   */
  @Get('/')
  @ApiOperation({ summary: 'API Version' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the API version',
    type: String,
  })
  async appVersion(): Promise<IResponse> {
    return {
      statusCode: HttpStatus.OK,
      message: 'API Version 1.0',
    };
  }
}
