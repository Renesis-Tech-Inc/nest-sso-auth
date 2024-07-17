import { env } from 'process';

import { Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer';

import { IEmailOptions } from '../../../interfaces/email.interface';
import 'dotenv/config';
/**
 * Service for sending emails using nodemailer.
 * This service initializes a nodemailer transporter and provides methods for sending emails.
 * @class
 */

@Injectable()
export class EmailService {
  private transporter: nodemailer;
  private clientIsValid: boolean;

  /**
   * Initializes the email transporter and verifies its validity.
   * @constructor
   */
  constructor() {
    // Initialize nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      secure: false,
      port: env.EMAIL_PORT,
      auth: {
        user: env.EMAIL_ACCOUNT,
        pass: env.EMAIL_PASSWORD,
      },
    });
    // Verify the client
    this.verifyClient();
  }

  /**
   * Verifies the validity of the email client.
   * This method checks if the email client is initialized successfully and re-attempts after a delay if not.
   * @private
   */
  private verifyClient(): void {
    return this.transporter.verify((error) => {
      if (error) {
        this.clientIsValid = false;
        // Retry after a delay
        setTimeout(this.verifyClient.bind(this), 1000 * 60 * 30);
        console.warn(
          'The mail client failed to initialize the connection! Will try again in half an hour:',
          error?.message || error,
        );
      } else {
        this.clientIsValid = true;
        console.info(
          'The mail client initialized the connection successfully! Ready to send mail.',
        );
      }
    });
  }

  /**
   * Sends an email using the initialized transporter.
   * @param {IEmailOptions} mailOptions - Options for the email to be sent.
   */
  public sendMail(mailOptions: IEmailOptions) {
    // Check if the client is valid
    if (!this.clientIsValid) {
      console.warn(
        'Email client is not initialized successfully! Email sending rejected!',
      );
      return false;
    }
    // Set default "from" address if not provided
    const options = Object.assign(mailOptions, {
      from: mailOptions.from ?? env.EMAIL_FROM,
    });

    // Send email
    this.transporter.sendMail(options, (error, info) => {
      if (error) {
        console.warn('Failed to send mail!', error?.message || error);
      } else {
        console.info('Mail sent successfully', info.messageId, info.response);
      }
    });
  }
}
