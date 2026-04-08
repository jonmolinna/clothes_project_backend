import { Branch } from 'src/branch/entity/branch.entity';
import { Category } from 'src/categories/entity/category.entity';
import { Product } from 'src/products/entity/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('stores')
export class Store {
  // ID del negocio
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // NOMBRE DEL NEGOCIO
  @Column({ type: 'varchar', length: 255 })
  name: string;

  // RAZON SOCIAL
  @Column({ type: 'varchar', length: 255, name: 'business_name' })
  businessName: string;

  // SLUG DEL NEGOCIO
  @Column({ type: 'varchar', length: 255, unique: true, name: 'slug' })
  slug: string;

  // EMAIL DEL NEGOCIO
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  // LOGO DEL NEGOCIO
  @Column({ type: 'varchar', name: 'logo_url', length: 255, nullable: true })
  logoUrl: string;

  // RUC DEL NEGOCIO
  @Column({ type: 'varchar', length: 11, unique: true, name: 'ruc' })
  ruc: string;

  // ESTADO DEL NEGOCIO
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

   // Fechas de auditoría y soft delete
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  // RELATIONS
  // 1 - N
  @OneToMany(() => Branch, (branch) => branch.store)
  branches: Branch[];

  // 1 - N
  @OneToMany(() => Category, (category) => category.store)
  categories: Category[];

  // 1 - N
  @OneToMany(() => Product, (product) => product.store)
  products: Product[];
}
