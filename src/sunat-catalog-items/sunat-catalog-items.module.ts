import { Module } from '@nestjs/common';
import { SunatCatalogItemsController } from './sunat-catalog-items.controller';
import { SunatCatalogItemsService } from './sunat-catalog-items.service';

@Module({
  controllers: [SunatCatalogItemsController],
  providers: [SunatCatalogItemsService]
})
export class SunatCatalogItemsModule {}
