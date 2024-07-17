import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { AuthHelperService } from 'src/helper/auth.helper';
import { MongooseModel } from 'src/interfaces/mongoose.interface';
import { User } from './user.model';
import { InjectModel } from 'src/transformers/model.transformer';
// import { IAuthUser } from '../auth/interface/auth-user.interface';
import { EErrorMessages } from 'src/enums/error-messages.enum';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { Base64ImageDto } from './dtos/file-upload.dto';
import { S3Service } from '../common/services/s3.service';
import { UpdateQuery } from 'mongoose';
import { IAuthUser } from '../auth/interface/auth-user.interface';

@Injectable()
export class UserService {
  selectUserFields;
  constructor(
    @InjectModel(User) private readonly userModel: MongooseModel<User>,
    private readonly authHelperService: AuthHelperService,
    private readonly s3Service: S3Service,
  ) {
    this.selectUserFields = {
      _id: true,
      email: true,
      fullName: true,
      role: true,
    };
  }

  /**
   * Retrieves user profile.
   * @param {string} _id - The ID of the user to retrieve profile.
   * @returns {Promise<IAuthUser>} - A promise that resolves with the user profile.
   * @throws {HttpException} - If the user is not found.
   */
  async getProfile(_id: string): Promise<IAuthUser> {
    const user = await this.userModel.findOne({ _id: _id });

    if (!user) {
      throw new HttpException(
        EErrorMessages.USER_NOT_EXISTS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      _id: String(user._id),
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      role: user.role,
    };
  }

  /**
   * Updates user profile.
   * @param {string} _id - The ID of the user to update.
   * @param {UpdateProfileDto} updateProfileDto - The data to update user's profile.
   * @returns {Promise<void>} - A promise that resolves when the profile is updated.
   * @throws {HttpException} - If the user is not found.
   */
  async updateProfile(_id: string, updateProfileDto: UpdateProfileDto) {
    let user = await this.userModel.findOne({ _id: _id });

    if (!user) {
      throw new HttpException(
        EErrorMessages.USER_NOT_EXISTS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    user = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        fullName: updateProfileDto.fullName,
      },
    );
  }
  /**
   * Retrieves all users that are not marked as deleted.
   *
   * @returns {Promise<IAuthUser[]>} A promise that resolves to an array of users.
   */
  async all(): Promise<IAuthUser[]> {
    const query = {
      deletedAt: { $exists: false },
    };

    return await this.userModel.find(query);
  }
  /**
   * Updates user information based on the provided user ID and update body.
   *
   * This method retrieves the user by ID, checks if the user exists,
   * and updates the user's information using the provided update body.
   *
   * @param {string} _id - The ID of the user to update.
   * @param {UpdateQuery<User>} body - The update body containing fields to update.
   * @returns {Promise<User>} A promise that resolves to the updated user object.
   * @throws {HttpException} Throws HTTP exception if the user is not found.
   */
  async update(_id: string, body: UpdateQuery<User>): Promise<User> {
    const user = await this.userModel.findOne({ _id: _id });

    if (!user) {
      throw new HttpException(
        EErrorMessages.USER_NOT_EXISTS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.userModel.findOneAndUpdate({ _id: user._id }, body, {
      new: true,
    });
  }

  /**
   * Updates user password.
   * @param {string} _id - The ID of the user whose password is to be updated.
   * @param {UpdatePasswordDto} updatePasswordDto - The data containing the new password.
   * @returns {Promise<void>} - A promise that resolves when the password is updated.
   * @throws {HttpException} - If the user is not found.
   */
  async updatePassword(_id: string, updatePasswordDto: UpdatePasswordDto) {
    let user = await this.userModel.findOne(
      { _id: _id },
      { ...this.selectUserFields, password: true },
    );

    if (!user) {
      throw new HttpException(
        EErrorMessages.USER_NOT_EXISTS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Check Password
    const isCorrect = this.authHelperService.comparePassword(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isCorrect) {
      throw new HttpException(
        EErrorMessages.INVALID_OLD_PASSWORD,
        HttpStatus.CONFLICT,
      );
    }
    // Generate a hashed password
    const hashedPassword = this.authHelperService.hashPassword(
      updatePasswordDto.password,
    );
    user = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        password: hashedPassword,
      },
    );
  }

  /**
   * Uploads a user profile image to Google Cloud Storage (GCS) and updates the user's avatar URL in the database.
   * If the user already has an avatar, the existing avatar is deleted from GCS before uploading the new image.
   * @param _id The ID of the user.
   * @param base64ImageDto The DTO containing the base64-encoded image data and its metadata.
   * @throws {HttpException} If the user is not found.
   */
  async updateProfileImage(
    _id: string,
    base64ImageDto: Base64ImageDto,
  ): Promise<IAuthUser> {
    // Find the user in the database
    const user = await this.userModel.findById(_id);
    // If user is not found, throw an error
    if (!user) {
      throw new HttpException(
        EErrorMessages.USER_NOT_EXISTS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // If the user already has an avatar, delete it from GCS
    // if (user.avatar) {
    //   await this.gcpDeleteFileService.delete(user.avatar, bucketName);
    // }

    // Generate file metadata
    const baseFileName = base64ImageDto.fileName;
    const currentYear = new Date().getFullYear();
    const destination = `${currentYear}/${user._id}/images/profile`;
    const extension = base64ImageDto.fileType;
    const contentType = `image/${base64ImageDto.fileType}`;
    const filePath = `${destination}/${baseFileName}.${extension}`;
    const buffer = Buffer.from(base64ImageDto?.base64Data, 'base64');
    // Upload the new image to GCS and get its public URL

    const publicUrl = await this.s3Service.uploadFile(
      buffer,
      contentType,
      filePath,
    );

    // Update the user's avatar URL in the database
    await this.userModel.findByIdAndUpdate(user._id, { avatar: publicUrl });
    return {
      _id: String(user._id),
      email: user.email,
      fullName: user.fullName,
      avatar: publicUrl,
    };
  }
}
