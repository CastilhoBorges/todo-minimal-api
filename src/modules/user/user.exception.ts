/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions/base.exception';

export class EmailExistsException extends BaseException {
  constructor(error?: any) {
    super({
      name: EmailExistsException.name,
      message: 'Invalid email or already exists',
      statusCode: HttpStatus.BAD_REQUEST,
      stack: error?.stack as string,
    });
  }
}
