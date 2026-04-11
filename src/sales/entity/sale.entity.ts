import { Branch } from 'src/branch/entity/branch.entity';
import { Cash } from 'src/cash/entity/cash.entity';
import { User } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum SalePaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  YAPE = 'yape',
  PLIN = 'plin',
  MIXED = 'mixed',
}

export enum SaleStatus {
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Entity('sales')
export class Sale {
  /** Identificador único */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Antes de descuentos */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: string;

  /** Descuento aplicado */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount: string;

  /** Total final */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: string;

  /** cash / card / yape / plin / mixed */
  @Column({
    type: 'enum',
    enum: SalePaymentMethod,
    name: 'payment_method',
  })
  paymentMethod: SalePaymentMethod;

  /** completed / cancelled / refunded */
  @Column({
    type: 'enum',
    enum: SaleStatus,
    name: 'status',
  })
  status: SaleStatus;

  /** Fecha y hora */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  /** Sede (FK → branches) */
  @ManyToOne(() => Branch, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  /** Cajero que registró (FK → users) */
  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /** Cliente (nullable; FK → customers) */
  @Column({ type: 'uuid', name: 'customer_id', nullable: true })
  customerId: string | null;

   /** Sesión de caja (FK → cash; equivale a cash_sessions si renombras la tabla) */
   @ManyToOne(() => Cash, { onDelete: 'RESTRICT' })
   @JoinColumn({ name: 'session_id' })
   session: Cash;

}
