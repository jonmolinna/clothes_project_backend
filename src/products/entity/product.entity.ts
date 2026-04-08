import { Category } from 'src/categories/entity/category.entity';
import { ProductVariant } from 'src/product-variants/entity/product-variant.entity';
import { Store } from 'src/store/entity/store.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // NOMBRE DEL PRODUCTO
  @Column({ type: 'varchar', length: 255 })
  name: string;

  // DESCRIPCION DEL PRODUCTO
  @Column({ type: 'text', nullable: true })
  description: string;

  /** Código interno único dentro de la misma tienda. */
  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  // PRECIO BASE DEL PRODUCTO
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'price' })
  price: string;

  // ESTADO DEL PRODUCTO
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  // AUDITORIA
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // RELATION
  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  /** Variantes del producto (talla, color, barcode, precio opcional). */
  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];
}
