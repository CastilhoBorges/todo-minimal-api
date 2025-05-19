import { Global, Module } from '@nestjs/common';
import { Transaction } from './transaction';

@Global()
@Module({
  providers: [Transaction],
  exports: [Transaction],
})
export class TransactionModule {}
