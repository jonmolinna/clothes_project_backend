import { Test, TestingModule } from '@nestjs/testing';
import { StockTransferItemsController } from './stock-transfer-items.controller';

describe('StockTransferItemsController', () => {
  let controller: StockTransferItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockTransferItemsController],
    }).compile();

    controller = module.get<StockTransferItemsController>(StockTransferItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
