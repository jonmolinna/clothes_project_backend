import { Test, TestingModule } from '@nestjs/testing';
import { StockTransferItemsService } from './stock-transfer-items.service';

describe('StockTransferItemsService', () => {
  let service: StockTransferItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockTransferItemsService],
    }).compile();

    service = module.get<StockTransferItemsService>(StockTransferItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
