import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyTransactionsController } from './loyalty-transactions.controller';

describe('LoyaltyTransactionsController', () => {
  let controller: LoyaltyTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyTransactionsController],
    }).compile();

    controller = module.get<LoyaltyTransactionsController>(LoyaltyTransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
