/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ENVIRONMENT } from '../enum/environment.enum';
import { BaseException } from '../exceptions/base.exception';

/**
 * Global exception filter to handle and format all exceptions in a unified way.
 * Captures instances of `HttpException` and unknown errors, providing a consistent error response structure.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private environment: string;

  constructor() {
    const { NODE_ENV } = process.env;
    this.environment = NODE_ENV ?? 'development';
  }

  /**
   * Handles exceptions and sends a formatted response to the client.
   *
   * @param exception - The thrown exception.
   * @param host - The context of the request and response.
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let exceptionName = 'InternalServerError';
    let message: string = 'An unexpected error occurred';
    const timestamp =
      this.environment !== ENVIRONMENT.TEST.toString()
        ? new Date().toISOString()
        : null;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: Record<string, unknown> = {
      name: exceptionName,
      message: 'An unexpected error occurred',
      statusCode: status,
      timestamp,
    };

    if (exception instanceof BaseException) {
      status = exception.getStatus();
      exceptionName = exception?.name;
      message = exception?.message;
      errorResponse = {
        name: exceptionName,
        message,
        statusCode: status,
        timestamp,
        metadata: exception.getResponse(),
      };
    } else if (exception instanceof HttpException) {
      const metadata: any = exception.getResponse();
      status = exception.getStatus();
      exceptionName = exception.name || 'HttpException';
      message = metadata?.message || exception?.message;
      errorResponse = {
        name: exceptionName,
        message,
        statusCode: status,
        timestamp,
        metadata,
      };
    } else if (exception instanceof Error) {
      exceptionName = exception.name || 'HttpException';
      message = exception?.message || 'Internal Server Error';

      errorResponse = {
        name: exceptionName,
        message,
        statusCode: status,
        timestamp,
      };
      if (this.environment !== ENVIRONMENT.TEST.toString()) {
        errorResponse.stack = exception.stack;
        this.logger.error(
          `Unexpected error: ${exception.message}`,
          exception.stack,
        );
      }
    } else {
      if (this.environment !== ENVIRONMENT.TEST.toString()) {
        this.logger.error('Unknown exception caught', exception);
      }
    }

    if (this.environment !== ENVIRONMENT.TEST.toString()) {
      this.logger.error(`${exceptionName}`, errorResponse);
    }

    const { statusCode, message: messageError } = errorResponse;

    response.status(status).json({ statusCode, message: messageError });
  }
}
