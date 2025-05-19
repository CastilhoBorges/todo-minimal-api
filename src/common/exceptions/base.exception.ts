import { HttpException, HttpStatus } from '@nestjs/common';

type BaseExceptionType = {
  name: string;
  message: string;
  statusCode: HttpStatus;
  metadata?: unknown;
  stack?: string;
};

/**
 * Base exception class for custom errors in NestJS.
 *
 * Extends `HttpException` and allows additional details for better error tracking.
 */
export class BaseException extends HttpException {
  /**
   * Constructs a new BaseException instance.
   *
   * @param name - The name of the exception.
   * @param message - A descriptive error message.
   * @param statusCode - The HTTP status code associated with the exception.
   * @param metadata - (Optional) Additional data related to the error.
   * @param stack - (Optional) Stack trace for debugging purposes.
   */
  constructor({
    name,
    message,
    statusCode,
    metadata,
    stack,
  }: BaseExceptionType) {
    super({ name, message, statusCode, metadata, stack }, statusCode);
  }
}
