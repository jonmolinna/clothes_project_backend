import { Branch } from 'src/branch/entity/branch.entity';
import { ProductVariant } from 'src/product-variants/entity/product-variant.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Stock por variante y sede. `branches.id` en tu esquema es numérico; `product_variants.id` es UUID.
 */
@Entity('inventory')
@Unique('UQ_inventory_variant_branch', ['variant', 'branch'])
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // CANTIDAD ACTUAL
  @Column({ type: 'int', default: 0 })
  quantity: number;

  // CANTIDAD MINIMA
  @Column({ type: 'int', name: 'min_stock', default: 0 })
  minStock: number;

  // AUDITORIA
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // RELATIONS
  @ManyToOne(() => ProductVariant, (variant) => variant.inventoryRows, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  /** Una sola fila de stock por variante en cada sede (`variant_id` + `branch_id` únicos juntos). */
  @ManyToOne(() => Branch, (branch) => branch.inventoryRows, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;
}
