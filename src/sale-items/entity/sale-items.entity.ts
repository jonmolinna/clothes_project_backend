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

  /** Catálogo SUNAT 07 — tipo de afectación al IGV (ej. 10 gravado); null en nota interna. */
  @Column({ type: 'varchar', length: 2, name: 'igv_affectation_code', nullable: true })
  igvAffectationCode: string | null;

  /** Código de producto SUNAT (cat. 25 u otros) si aplica. */
  @Column({ type: 'varchar', length: 20, name: 'sunat_product_code', nullable: true })
  sunatProductCode: string | null;

  /** Unidad de medida (cat. 03). */
  @Column({ type: 'varchar', length: 3, name: 'unit_code', nullable: true })
  unitCode: string | null;

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
