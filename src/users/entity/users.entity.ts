import { Branch } from 'src/branch/entity/branch.entity';
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

export enum UserRole {
  ADMIN = 'admin',
  VENTAS = 'ventas',
  CAJERO = 'cajero',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  /** Único por tienda (mismo email en otra tienda sí puede existir). */
  @Unique('UQ_users_store_email', ['store', 'email'])
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    name: 'role',
  })
  role: UserRole;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // RELATIONS
  // Un usuario pertenece a una tienda
  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

   /**
   * Nullable: admin u otros usuarios sin sede fija.
   * Si borras la sede, el usuario queda sin branch (`SET NULL`), no se borra el usuario.
   */
  // Un usuario puede tener un sola sede, excepto el admin
  @ManyToOne(() => Branch, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch | null;
}
