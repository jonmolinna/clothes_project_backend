import { Branch } from 'src/branch/entity/branch.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('document_series')
@Unique('UQ_document_series_branch_type_series', [
  'branch',
  'documentTypeCode',
  'series',
])
export class DocumentSeries {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Branch, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ type: 'varchar', length: 4, name: 'document_type_code' })
  documentTypeCode: string;

  @Column({ type: 'varchar', length: 8 })
  series: string;

  /** Siguiente correlativo a asignar (reservado con bloqueo pesimista al emitir). */
  @Column({ type: 'int', name: 'next_number' })
  nextNumber: number;

  @Column({ type: 'boolean', name: 'is_electronic', default: true })
  isElectronic: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
