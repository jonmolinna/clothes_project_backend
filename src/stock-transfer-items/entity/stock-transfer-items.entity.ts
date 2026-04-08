import { ProductVariant } from 'src/product-variants/entity/product-variant.entity';
import { StockTransfer } from 'src/stock-transfers/entity/stock-transfers.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Línea de detalle de un traslado: variante y cantidad movida en esa transferencia.
 */
@Entity('stock_transfer_items')
export class StockTransferItem {
  /** Identificador único. */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Cantidad de unidades de la variante en este traslado. */
  @Column({ type: 'int' })
  quantity: number;
 
  /** Transferencia a la que pertenece esta línea (FK → stock_transfers). */
  @ManyToOne(() => StockTransfer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transfer_id' })
  transfer: StockTransfer;

  /** Variante de producto trasladada (FK → product_variants). */
  @ManyToOne(() => ProductVariant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;
}
