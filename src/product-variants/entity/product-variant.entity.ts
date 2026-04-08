import { Inventory } from 'src/inventory/entity/inventory.entity';
import { Product } from 'src/products/entity/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product_variants')
export class ProductVariant {
  /** Identificador único de la variante. */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Talla (S, M, L, XL, 28, 30…). */
  @Column({ type: 'varchar', length: 50 })
  size: string;

  /** Color de la variante. */
  @Column({ type: 'varchar', length: 80 })
  color: string;

  /** Código de barras; único en todo el catálogo. */
  @Column({ type: 'varchar', length: 64, unique: true })
  barcode: string;

  /** Precio especial que sustituye al precio base del producto; null = usar precio del producto. */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'price_override',
    nullable: true,
  })
  priceOverride: string | null;

  // RELATIONS
   /** Producto padre al que pertenece esta variante (talla/color/código). */
   @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => Inventory, (row) => row.variant)
  inventoryRows: Inventory[];
}
