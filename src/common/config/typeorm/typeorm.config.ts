import path from 'path';
import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ENVIRONMENT } from '../../enum/environment.enum';

const isProd = process.env.NODE_ENV === ENVIRONMENT.PRODUCTION.toString();
const isTest = process.env.NODE_ENV === ENVIRONMENT.TEST.toString();

if (!isProd) {
  dotenvConfig({ path: isTest ? '.env.test' : '.env' });
}

const {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USERNAME,
} = process.env;

const migrationsPath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'migrations',
  '*.{ts,js}',
);

const entityPath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '**',
  '*.entity.{ts,js}',
);

const config = {
  type: 'postgres',
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  entities: [entityPath],
  migrations: [migrationsPath],
  migrationsRun: true,
  autoLoadEntities: true,
  synchronize: false,
  logging: isProd || isTest ? false : true,
};

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
