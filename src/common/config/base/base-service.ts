import { OnModuleDestroy, OnApplicationShutdown, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export abstract class BaseModule
  implements OnModuleDestroy, OnApplicationShutdown
{
  protected readonly logger = new Logger(BaseModule.name);

  constructor(protected readonly dataSource?: DataSource) {}

  async onModuleDestroy() {
    this.logger.log('Module is being destroyed. Closing connections...');
    await this.closeConnections();
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(
      `Application shutting down with signal: ${signal}. Closing connections...`,
    );
    await this.closeConnections();
  }

  private async closeConnections() {
    await this.closeDatabaseConnection();
  }

  private async closeDatabaseConnection() {
    try {
      if (this.dataSource && this.dataSource.isInitialized) {
        await this.dataSource.destroy();
        this.logger.log('Database connection closed successfully.');
      }
    } catch (error) {
      this.logger.error('Error while closing database connection:', error);
    }
  }
}
