import { Module } from '@nestjs/common';
import { StockTransferItemsController } from './stock-transfer-items.controller';
import { StockTransferItemsService } from './stock-transfer-items.service';

@Module({
  controllers: [StockTransferItemsController],
  providers: [StockTransferItemsService]
})
export class StockTransferItemsModule {}
