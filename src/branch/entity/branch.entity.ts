import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Inventory } from 'src/inventory/entity/inventory.entity';
import { BranchPhone } from './branch-phone.entity';
import { Store } from 'src/store/entity/store.entity';

@Entity('branches')
export class Branch {
  // ID de la sede
  @PrimaryGeneratedColumn()
  id: number;

  // ID del negocio
  @Column({ type: 'int', name: 'store_id', nullable: false })
  storeId: number;

  // NOMBRE DE LA SEDE
  @Column({ type: 'varchar', length: 255 })
  name: string;

  // DIRECCION DE LA SEDE
  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  // ESTADO DE LA SEDE
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
  @OneToMany(() => BranchPhone, (phone) => phone.branch)
  phones: BranchPhone[];

  @ManyToOne(() => Store, (store) => store.branches)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @OneToMany(() => Inventory, (row) => row.branch)
  inventoryRows: Inventory[];
}
