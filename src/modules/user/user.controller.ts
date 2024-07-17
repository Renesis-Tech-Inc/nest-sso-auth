import {
  Controller,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
  Put,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { IResponse } from 'src/interfaces/response.interface';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UserService } from './user.service';
import { IAuthUser } from '../auth/interface/auth-user.interface';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { EResponseMessages } from 'src/enums/response-messages.enum';
import { UserDecorator } from '../auth/decorators/user.decorator';
import { Base64ImageDto } from './dtos/file-upload.dto';

/**
 * Controller for managing user-related operations.
 * @controller
 * @route /user
 * @guards AuthGuard
 * @bearerAuth
 * @tags users
 */
@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  /**
   * Retrieves the profile of the authenticated user.
   * @summary Get Profile
   * @description Endpoint to get authenticated user profile.
   * @route GET /
   * @operationId getProfile
   * @returns {Promise<IResponse<IAuthUser>>} A promise containing the response with the authenticated user's profile.
   */
  @Get('/')
  @ApiOperation({
    summary: 'Get Profile',
    description: 'Endpoint to get authenticated user ',
  })
  @HttpCode(HttpStatus.OK)
  async getProfile(
    @UserDecorator() authUser: IAuthUser,
  ): Promise<IResponse<{ user: IAuthUser }>> {
    const user = await this.userService.getProfile(authUser._id);
    return {
      statusCode: HttpStatus.OK,
      message: EResponseMessages.PROFILE_FETCHED,
      payload: { user },
    };
  }

  /**
   * Updates the profile of the authenticated user.
   * @summary Update Profile
   * @description Endpoint to update user profile with new information.
   * @route PUT /profile
   * @operationId updateProfile
   * @param {UpdateProfileDto} updateProfileDto - The DTO containing updated profile information.
   * @param {IAuthUser} authUser - The authenticated user object.
   * @returns {Promise<IResponse>} A promise containing the response.
   */

  @Put('/profile')
  @ApiBody({ type: UpdateProfileDto })
  @ApiOperation({
    summary: 'Update Profile',
    description: 'Endpoint to update user with fullName.',
  })
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UserDecorator() authUser: IAuthUser,
  ): Promise<IResponse> {
    await this.userService.updateProfile(authUser._id, updateProfileDto);
    return {
      statusCode: HttpStatus.OK,
      message: EResponseMessages.PROFILE_UPDATED,
    };
  }

  /**
   * Update user password.
   * @summary Update Password
   * @description Endpoint to update user password.
   * @route PUT /password
   * @operationId updatePassword
   * @param {UpdatePasswordDto} updatePasswordDto - The data containing the new password.
   * @param {IAuthUser} authUser - The authenticated user data.
   * @returns {Promise<IResponse>} - A promise that resolves with the response indicating password update success.
   */

  @Put('/password')
  @ApiBody({ type: UpdatePasswordDto })
  @ApiOperation({
    summary: 'Update Password',
    description: 'Endpoint to update user password with password.',
  })
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @UserDecorator() authUser: IAuthUser,
  ): Promise<IResponse> {
    await this.userService.updatePassword(authUser._id, updatePasswordDto);
    return {
      statusCode: HttpStatus.OK,
      message: EResponseMessages.PASSWORD_UPDATED,
    };
  }

  /**
   * Updates a user's profile image.
   *
   * @param {Base64ImageDto} base64ImageDto - The DTO containing the base64-encoded image data.
   * @param {IAuthUser} authUser - The authenticated user.
   * @returns {Promise<IResponse>} An object containing the status code and message.
   */
  @Put('/avatar')
  @ApiBody({ type: Base64ImageDto })
  @ApiOperation({
    summary: 'Update Profile Image',
    description: "Update a user's profile image ",
  })
  @HttpCode(HttpStatus.OK)
  async uploadImage(
    @Body() base64ImageDto: Base64ImageDto,
    @UserDecorator() authUser: IAuthUser,
  ): Promise<IResponse<{ user: IAuthUser }>> {
    const user = await this.userService.updateProfileImage(
      authUser._id,
      base64ImageDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: EResponseMessages.IMAGE_UPDATED,
      payload: { user },
    };
  }
}
