import { Store } from 'src/store/entity/store.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('customers')
@Unique('UQ_customers_store_phone', ['store', 'phone'])
@Unique('UQ_customers_store_dni', ['store', 'dni'])
export class Customer {
  /** id — Identificador único (PK, uuid). */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** store_id — Tienda dueña (FK → stores). */
  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  /** name — Nombre completo. */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /** phone — Teléfono (único por tienda). */
  @Column({ type: 'varchar', length: 32 })
  phone: string;

  /** email — Correo (nullable). */
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  /** dni — DNI (nullable; único por tienda). */
  @Column({ type: 'varchar', length: 32, nullable: true })
  dni: string | null;

  /** loyalty_points — Puntos acumulados. */
  @Column({ type: 'int', name: 'loyalty_points', default: 0 })
  loyaltyPoints: number;

  /** created_at — Fecha de registro. */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
