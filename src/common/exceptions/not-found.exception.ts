import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

/**
 * A custom exception that represents a "Not Found" HTTP error.
 * This exception extends from the BaseException class.
 *
 * It is typically thrown when a resource is not found in the system.
 *
 * @example
 * throw new NotFoundException('The requested resource could not be found');
 */
export class NotFoundException extends BaseException {
  /**
   * Creates an instance of the NotFoundException.
   *
   * @param message - The error message describing what was not found.
   * @param metadata - Optional additional metadata related to the error (e.g., error codes).
   */
  constructor(message: string, metadata?: unknown) {
    super({
      name: NotFoundException.name,
      message,
      statusCode: HttpStatus.NOT_FOUND,
      metadata,
    });
  }
}
