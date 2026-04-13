import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('platform_admins')
export class PlatformAdmin {
  /** id — Identificador único (PK, uuid). */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** name — Nombre. */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /** email — Correo (único a nivel plataforma). */
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  /** password_hash — Contraseña (hash, nunca en claro). */
  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  /** created_at — Fecha de alta. */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
