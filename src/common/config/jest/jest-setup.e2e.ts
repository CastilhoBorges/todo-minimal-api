/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { modules } from '../../../app.module';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import typeorm from '../typeorm/typeorm.config';

dotenvConfig({ path: '.env.test' });

export class JestSetupE2E {
  private mailhogAPI: string;
  private postgresContainer: StartedPostgreSqlContainer;
  private mailhogContainer: StartedTestContainer;
  private appContainer: INestApplication;

  async init() {
    const { host, port } = await this.startPostgresContainer();
    await this.startMailhogContainer();
    await this.startAppContainer(host, port);

    return { app: this.appContainer, mailhogAPI: this.mailhogAPI };
  }

  async close() {
    await this.appContainer.close();
    await this.postgresContainer.stop();
    await this.mailhogContainer.stop();
  }

  private startPostgresContainer = async () => {
    this.postgresContainer = await new PostgreSqlContainer('postgres:17')
      .withName(`postgres_${process.env.npm_package_name}`)
      .start();

    const host = this.postgresContainer.getHost();
    const port = this.postgresContainer.getMappedPort(
      Number(process.env.DATABASE_PORT),
    );

    return { host, port };
  };

  private startMailhogContainer = async () => {
    this.mailhogContainer = await new GenericContainer('mailhog/mailhog')
      .withName(`mailhog_${process.env.npm_package_name}`)
      .withExposedPorts(
        Number(process.env.EMAIL_SMTP_PORT),
        Number(process.env.EMAIL_SMTP_WEB),
      )
      .start();

    process.env.EMAIL_SMTP_HOST = this.mailhogContainer.getHost();
    process.env.EMAIL_SMTP_PORT = this.mailhogContainer
      .getMappedPort(Number(process.env.EMAIL_SMTP_PORT))
      .toString();

    this.mailhogAPI = `http://${this.mailhogContainer.getHost()}:${this.mailhogContainer.getMappedPort(
      Number(process.env.EMAIL_SMTP_WEB),
    )}`;
  };

  private startAppContainer = async (host: string, port: number) => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const config = await configService.get('typeorm');
            config.port = port;
            config.host = host;

            return {
              ...config,
            } as TypeOrmModuleOptions;
          },
        }),
        ...modules,
      ],
    }).compile();

    this.appContainer = moduleFixture.createNestApplication();

    this.appContainer.enableVersioning({
      defaultVersion: '1',
      type: VersioningType.URI,
    });

    this.appContainer.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        errorHttpStatusCode: 422,
      }),
    );
    await this.appContainer.init();
  };
}
