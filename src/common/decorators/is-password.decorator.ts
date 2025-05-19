/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { REGEX_VALIDATE_PASSWORD } from '../constants/regex.constant';

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _: ValidationArguments) {
          const strongPasswordRegex = REGEX_VALIDATE_PASSWORD;
          return typeof value === 'string' && strongPasswordRegex.test(value);
        },
        defaultMessage(_: ValidationArguments) {
          return 'The password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character.';
        },
      },
    });
  };
}
