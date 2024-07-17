import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { env } from 'process';

/**
 * Service for interacting with AWS S3.
 *
 * This service provides methods for uploading files to an AWS S3 bucket.
 *
 * @@Injectable
 */
@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor() {
    // Initialize AWS S3 with credentials and region
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  /**
   * Uploads a file to AWS S3 bucket.
   *
   * @param {any} fileBuffer - The file content buffer (base64 encoded).
   * @param {string} contentType - The content type of the file.
   * @param {string} filePath - The path and filename to save the file in S3.
   * @returns {Promise<string>} A promise that resolves to the S3 object URL.
   */
  async uploadFile(
    fileBuffer: any,
    contentType: string,
    filePath: string,
  ): Promise<string> {
    const buffer = Buffer.from(fileBuffer, 'base64');

    const params = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: filePath,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: contentType,
    };

    return new Promise((resolve, reject) => {
      // Upload file to S3 bucket
      this.s3.upload(params, (err: any, data: any) => {
        if (err) {
          console.error('Error uploading file to S3:', err);
          reject(err.message);
        }
        resolve(data.Location); // Return the S3 object URL
      });
    });
  }
}
