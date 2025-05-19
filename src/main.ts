import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VersioningType, ValidationPipe, Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { ENVIRONMENT } from './common/enum/environment.enum';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

config();

async function bootstrap() {
  const { PORT, NODE_ENV } = process.env;
  const logger = new Logger();

  const app = await NestFactory.create(AppModule, {
    logger: NODE_ENV !== ENVIRONMENT.PRODUCTION.toString() ? logger : false,
  });

  app.enableCors();

  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      errorHttpStatusCode: 422,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  if (NODE_ENV === ENVIRONMENT.DEVELOPMENT.toString()) {
    const config = new DocumentBuilder()
      .setTitle('ToDo Minimal API')
      .setDescription('API for managing services of a ToDo Minimal application')
      .setVersion('1.0')
      .addTag('services')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'Bearer',
          bearerFormat: 'JWT',
        },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(PORT ?? 3333);
}

void (async () => {
  await bootstrap();
})();
