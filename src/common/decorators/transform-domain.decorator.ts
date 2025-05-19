/* eslint-disable @typescript-eslint/no-unsafe-return */
import { REGEX_REPLACE_DOMAIN_URL } from '../constants/regex.constant';
import { Transform } from 'class-transformer';

export function TransformDomain() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value.replace(REGEX_REPLACE_DOMAIN_URL, '').toLowerCase().trim();
  });
}
