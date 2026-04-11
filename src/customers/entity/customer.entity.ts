import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('customers')
export class Customer {
  /** Identificador único */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Nombre completo */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /** Teléfono (único) */
  @Column({ type: 'varchar', length: 32, unique: true })
  phone: string;

  /** Correo (nullable) */
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  /** DNI (nullable, único) */
  @Column({ type: 'varchar', length: 32, nullable: true, unique: true })
  dni: string | null;

  /** Puntos acumulados */
  @Column({ type: 'int', name: 'loyalty_points', default: 0 })
  loyaltyPoints: number;

  /** Fecha de registro */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
