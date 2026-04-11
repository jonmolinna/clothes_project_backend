import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyTransactionsService } from './loyalty-transactions.service';

describe('LoyaltyTransactionsService', () => {
  let service: LoyaltyTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoyaltyTransactionsService],
    }).compile();

    service = module.get<LoyaltyTransactionsService>(LoyaltyTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
