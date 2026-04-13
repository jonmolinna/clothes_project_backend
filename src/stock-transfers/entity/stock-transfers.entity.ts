import { Branch } from 'src/branch/entity/branch.entity';
import { Store } from 'src/store/entity/store.entity';
import { User } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StockTransferStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Traslado de stock entre sedes de una misma tienda.
 * `from_branch_id` / `to_branch_id` usan el tipo de `branches.id` (entero en el esquema actual).
 */
@Entity('stock_transfers')
export class StockTransfer {
  /** id — Identificador único (PK, uuid). */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** store_id — Tienda dueña (FK → stores). */
  @ManyToOne(() => Store, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  /** from_branch_id — Sede origen (FK → branches). */
  @ManyToOne(() => Branch, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'from_branch_id' })
  fromBranch: Branch;

  /** to_branch_id — Sede destino (FK → branches). */
  @ManyToOne(() => Branch, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'to_branch_id' })
  toBranch: Branch;

  /** requested_by — Quién solicitó (FK → users). */
  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'requested_by' })
  requestedBy: User;

  /** approved_by — Quién aprobó (nullable; FK → users). */
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approved_by' })
  approvedBy: User | null;

  /** status — pending / approved / completed / cancelled. */
  @Column({
    type: 'enum',
    enum: StockTransferStatus,
    name: 'status',
    default: StockTransferStatus.PENDING,
  })
  status: StockTransferStatus;

  /** created_at — Fecha de creación de la solicitud. */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
