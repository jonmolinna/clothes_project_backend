import { Module } from '@nestjs/common';
import { LoyaltyTransactionsController } from './loyalty-transactions.controller';
import { LoyaltyTransactionsService } from './loyalty-transactions.service';

@Module({
  controllers: [LoyaltyTransactionsController],
  providers: [LoyaltyTransactionsService]
})
export class LoyaltyTransactionsModule {}
