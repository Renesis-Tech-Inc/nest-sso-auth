import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { env } from 'process';

@Injectable()
export class AuthHelperService {
  /**
   * Hashes a plain-text password using a secure hashing algorithm.
   *
   * @param {string} password - The plain-text password to be hashed.
   * @returns {string} - The hashed password.
   */
  hashPassword(password: string): string {
    const passwordSalt = env.BCRYPT_SALT;

    const salt = bcrypt.genSaltSync(Number(passwordSalt));

    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  /**
   * Compares a provided password with the stored hashed password for user authentication.
   *
   * @param {string} providedPassword - The password entered by the user during authentication.
   * @param {string} storedHashedPassword - The hashed password stored in the database.
   * @returns {boolean} - True if the provided password matches the stored hashed password, false otherwise.
   */
  comparePassword(
    providedPassword: string,
    storedHashedPassword: string,
  ): boolean {
    const isCorrect = bcrypt.compareSync(
      providedPassword,
      storedHashedPassword,
    );
    return isCorrect;
  }

  /**
   * Generates an expiry time for a token based on the given duration in minutes.
   *
   * @param {number} durationInMinutes - The duration for which the token should remain valid in minutes.
   * @returns {number} - The expiry timestamp calculated from the current time and the provided duration.
   */
  generateExpiryTime(time = env.REGISTER_OTP_EXPIRATION): number {
    const currentTime = new Date().getTime();
    const expiryTime = currentTime + Number(time) * 60 * 1000;
    return Number(expiryTime);
  }

  /**
   * Generates a random one-time password (OTP) with a specified length.
   *
   * @returns {string} - The randomly generated OTP.
   */
  generateOTP(): number {
    const otp = Math.floor(1000 + Math.random() * 9000); // Updated to ensure a 4-digit OTP
    return Number(otp);
  }
}
