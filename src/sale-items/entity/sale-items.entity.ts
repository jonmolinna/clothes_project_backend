import { ProductVariant } from 'src/product-variants/entity/product-variant.entity';
import { Sale } from 'src/sales/entity/sale.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Línea de detalle de una venta: variante, cantidades y montos al momento de la venta.
 */
@Entity('sale_items')
export class SaleItem {
  /** Identificador único */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Cantidad */
  @Column({ type: 'int' })
  quantity: number;

  /** Precio al momento de venta */
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price' })
  unitPrice: string;

  /** Descuento por ítem */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount: string;

  /** quantity × unit_price − discount */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: string;

  // Relaciones
   /** Venta (FK → sales) */
   @ManyToOne(() => Sale, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'sale_id' })
   sale: Sale;
 
   /** Variante vendida (FK → product_variants) */
   @ManyToOne(() => ProductVariant, { onDelete: 'RESTRICT' })
   @JoinColumn({ name: 'variant_id' })
   variant: ProductVariant;
}
