import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StoreModule } from './store/store.module';
import { BranchModule } from './branch/branch.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';
import { InventoryModule } from './inventory/inventory.module';
import { StockTransfersModule } from './stock-transfers/stock-transfers.module';
import { StockTransferItemsModule } from './stock-transfer-items/stock-transfer-items.module';
import { CashModule } from './cash/cash.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      // Hace que ConfigModule esté disponible en toda la aplicación
      isGlobal: true,
      // Archivo desde el que se leen las variables de entorno
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // autoLoadEntities: true,
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    StoreModule,
    BranchModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    ProductVariantsModule,
    InventoryModule,
    StockTransfersModule,
    StockTransferItemsModule,
    CashModule,
    SalesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
