import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Branch } from "./branch.entity";

@Entity({name: "branch_phones"})
export class BranchPhone {
    @PrimaryGeneratedColumn('uuid')
  id: string;

    @Column({ type: 'varchar', length: 20, name: 'phone_number' })
    phoneNumber: string;

    /** Etiqueta opcional: principal, ventas, soporte, etc. */
    @Column({ type: 'varchar', length: 50, name: 'label', nullable: true })
    label: string | null;

    /** Si es el teléfono principal (solo uno por perfil debería ser true). */
    @Column({ type: 'boolean', name: 'is_primary', default: false })
    isPrimary: boolean;

    // AUDITORIA
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date | null;

    // RELATIONS
    @ManyToOne(() => Branch, (branch) => branch.phones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'branch_id' })
    branch: Branch;
}