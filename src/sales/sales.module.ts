import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cash } from 'src/cash/entity/cash.entity';
import { Customer } from 'src/customers/entity/customer.entity';
import { DocumentSeries } from 'src/document-series/entity/document-series.entity';
import { Inventory } from 'src/inventory/entity/inventory.entity';
import { ProductVariant } from 'src/product-variants/entity/product-variant.entity';
import { SaleItem } from 'src/sale-items/entity/sale-items.entity';
import { SaleDocument } from 'src/sales/entity/sale-document.entity';
import { Sale } from 'src/sales/entity/sale.entity';
import { User } from 'src/users/entity/users.entity';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sale,
      SaleDocument,
      DocumentSeries,
      SaleItem,
      Inventory,
      ProductVariant,
      Cash,
      User,
      Customer,
    ]),
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
