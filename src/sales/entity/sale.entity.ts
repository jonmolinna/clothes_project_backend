import { Branch } from 'src/branch/entity/branch.entity';
import { Cash } from 'src/cash/entity/cash.entity';
import { Customer } from 'src/customers/entity/customer.entity';
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
  /** id — Identificador único (PK, uuid). */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** store_id — Tienda dueña (FK → stores). Denormalizado para consultas y futuro multi-tenant. */
  @ManyToOne(() => Store, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  /** branch_id — Sede (FK → branches). */
  @ManyToOne(() => Branch, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  /** user_id — Cajero (FK → users). */
  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /** customer_id — Cliente (nullable; FK → customers). */
  @ManyToOne(() => Customer, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer | null;

  /**
   * session_id — Sesión de caja (FK → cash).
   * Si renombras la tabla a `cash_sessions`, el mapeo sigue siendo el mismo `session_id`.
   */
  @ManyToOne(() => Cash, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'session_id' })
  session: Cash;

  /** subtotal — Antes de descuentos (decimal 10,2). */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: string;

  /** discount — Descuento aplicado (decimal 10,2). */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount: string;

  /** total — Total final (decimal 10,2). */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: string;

  /** payment_method — cash / card / yape / plin / mixed. */
  @Column({
    type: 'enum',
    enum: SalePaymentMethod,
    name: 'payment_method',
  })
  paymentMethod: SalePaymentMethod;

  /** status — completed / cancelled / refunded. */
  @Column({
    type: 'enum',
    enum: SaleStatus,
    name: 'status',
  })
  status: SaleStatus;

  /** created_at — Fecha y hora de registro. */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
