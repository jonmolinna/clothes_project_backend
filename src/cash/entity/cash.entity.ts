import { Branch } from 'src/branch/entity/branch.entity';
import { User } from 'src/users/entity/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CashStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

@Entity('cash')
export class Cash {
  /** Identificador unico de la caja. */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Monto de apertura de caja. */
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'opening_amount' })
  openingAmount: string;

  /** Monto registrado al cierre de caja (nullable). */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'closing_amount',
    nullable: true,
  })
  closingAmount: string | null;

  /** Monto esperado calculado segun movimientos. */
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'expected_amount' })
  expectedAmount: string;

  /** Fecha y hora de apertura de caja. */
  @Column({
    type: 'timestamp',
    name: 'opened_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  openedAt: Date;

  /** Fecha y hora de cierre de caja (nullable). */
  @Column({ type: 'timestamp', name: 'closed_at', nullable: true })
  closedAt: Date | null;

  /** Estado actual de la caja: open o closed. */
  @Column({
    type: 'enum',
    enum: CashStatus,
    name: 'status',
    default: CashStatus.OPEN,
  })
  status: CashStatus;

  // RELATIONS
  /** Sede a la que pertenece la caja (FK -> branches). */
  @ManyToOne(() => Branch, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  /** Cajero responsable de la caja (FK -> users). */
  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
