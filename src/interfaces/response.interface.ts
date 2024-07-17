import { HttpStatus } from '@nestjs/common';

/**
 * Interface representing a standardized response structure.
 *
 * This interface defines the structure of a response object, which includes
 * a status code, a message, and an optional payload of type `T`.
 *
 * @interface
 * @template T - The type of the payload.
 */
export interface IResponse<T = null> {
  /**
   * The HTTP status code of the response.
   *
   * @type {HttpStatus}
   */
  statusCode: HttpStatus;

  /**
   * The message describing the response.
   *
   * @type {string}
   */
  message: string;

  /**
   * The optional payload of the response.
   *
   * @type {T}
   */
  payload?: T;
}
