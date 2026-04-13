import { Test, TestingModule } from '@nestjs/testing';
import { SunatCatalogItemsController } from './sunat-catalog-items.controller';

describe('SunatCatalogItemsController', () => {
  let controller: SunatCatalogItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SunatCatalogItemsController],
    }).compile();

    controller = module.get<SunatCatalogItemsController>(SunatCatalogItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
