import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

/**
 * A custom exception that represents a "Business Logic" error.
 * This exception extends from the BaseException class.
 *
 * It is typically thrown when an error occurs that violates business rules
 * or logic in the system.
 *
 * @example
 * throw new BusinessException('Invalid business logic', { code: 'INVALID_ACTION' });
 */
export class BusinessException extends BaseException {
  /**
   * Creates an instance of the BusinessException.
   *
   * @param message - The error message describing the business logic violation.
   * @param metadata - Optional additional metadata related to the error (e.g., error codes).
   */
  constructor(message: string, metadata?: unknown) {
    super({
      name: BusinessException.name,
      message,
      statusCode: HttpStatus.BAD_REQUEST,
      metadata,
    });
  }
}
