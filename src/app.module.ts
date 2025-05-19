import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseModule } from './common/config/base/base-service';
import { TransactionModule } from './common/config/transaction/transaction.module';
import typeorm, {
  connectionSource,
} from './common/config/typeorm/typeorm.config';

export const modules = [TransactionModule];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        (await configService.get('typeorm')) as TypeOrmModuleOptions,
    }),
    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule extends BaseModule {
  constructor() {
    super(connectionSource);
  }
}
