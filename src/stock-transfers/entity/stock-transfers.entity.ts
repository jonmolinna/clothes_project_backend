import { Branch } from 'src/branch/entity/branch.entity';
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
 * Traslado de stock entre sedes. Las FK a `branches` usan el tipo real de `branches.id` (INT en tu esquema).
 */
@Entity('stock_transfers')
export class StockTransfer {
  /** Identificador único del traslado. */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Ciclo de vida: pendiente → aprobado → completado (o cancelado). */
  @Column({
    type: 'enum',
    enum: StockTransferStatus,
    name: 'status',
    default: StockTransferStatus.PENDING,
  })
  status: StockTransferStatus;

  /** Fecha en que se creó la solicitud de traslado. */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;


  // RELATIONS
  /** Sede desde la que sale el stock. */
  @ManyToOne(() => Branch, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'from_branch_id' })
  fromBranch: Branch;

  /** Sede que recibe el stock. */
  @ManyToOne(() => Branch, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'to_branch_id' })
  toBranch: Branch;

  /** Usuario que registró o solicitó el traslado. */
  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'requested_by' })
  requestedBy: User;

  /** Usuario que aprobó el traslado; null mientras no se aprueba. */
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approved_by' })
  approvedBy: User | null;
}
