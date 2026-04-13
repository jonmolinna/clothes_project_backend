import { Test, TestingModule } from '@nestjs/testing';
import { SunatCatalogItemsService } from './sunat-catalog-items.service';

describe('SunatCatalogItemsService', () => {
  let service: SunatCatalogItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SunatCatalogItemsService],
    }).compile();

    service = module.get<SunatCatalogItemsService>(SunatCatalogItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
