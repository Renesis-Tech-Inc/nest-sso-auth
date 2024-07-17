import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

/**
 * Exception filter for catching all unhandled exceptions.
 *
 * This class extends the `BaseExceptionFilter` provided by NestJS to catch all unhandled exceptions.
 * It overrides the `catch` method to provide custom handling for the caught exceptions.
 *
 * @class
 * @extends BaseExceptionFilter
 */
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  /**
   * Method to catch all unhandled exceptions.
   *
   * This method overrides the `catch` method from the base exception filter to provide custom
   * handling for all unhandled exceptions.
   *
   * @async
   * @param {unknown} exception - The unhandled exception caught by the filter.
   * @param {ArgumentsHost} host - The arguments host containing the context of the exception.
   */
  async catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
