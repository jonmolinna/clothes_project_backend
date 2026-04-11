import { Customer } from 'src/customers/entity/customer.entity';
import { Sale } from 'src/sales/entity/sale.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Movimiento de puntos de fidelidad: acumulación o canje vinculado a un cliente y opcionalmente a una venta.
 */
@Entity('loyalty_transactions')
export class LoyaltyTransaction {
  /** Identificador único */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Puntos ganados */
  @Column({ type: 'int', name: 'points_earned', default: 0 })
  pointsEarned: number;

  /** Puntos canjeados */
  @Column({ type: 'int', name: 'points_redeemed', default: 0 })
  pointsRedeemed: number;

  /** Motivo (ej.: "Compra", "Canje") */
  @Column({ type: 'varchar', length: 255 })
  reason: string;

  /** Fecha */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // RELATIONS
  /** Cliente (FK → customers) */
  @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  /** Venta relacionada (nullable; FK → sales) */
  @ManyToOne(() => Sale, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale | null;
}
