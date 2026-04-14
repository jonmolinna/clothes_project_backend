import { DocumentSeries } from 'src/document-series/entity/document-series.entity';
import { ElectronicDocumentStatus } from 'src/sales/constants/document.constants';
import type { Sale } from './sale.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('sale_documents')
@Unique('UQ_sale_documents_branch_series_number', [
  'branchId',
  'series',
  'number',
])
export class SaleDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(
    () => require('./sale.entity').Sale,
    (sale: Sale) => sale.document,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => DocumentSeries, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'document_series_id' })
  documentSeries: DocumentSeries | null;

  @Column({ type: 'int', name: 'branch_id' })
  branchId: number;

  @Column({ type: 'varchar', length: 4, name: 'document_type_code' })
  documentTypeCode: string;

  @Column({ type: 'varchar', length: 8 })
  series: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'timestamp', name: 'issued_at' })
  issuedAt: Date;

  @Column({ type: 'varchar', length: 255, name: 'customer_name', nullable: true })
  customerName: string | null;

  @Column({ type: 'varchar', length: 2, name: 'customer_doc_type', nullable: true })
  customerDocType: string | null;

  @Column({ type: 'varchar', length: 32, name: 'customer_doc_number', nullable: true })
  customerDocNumber: string | null;

  @Column({ type: 'varchar', length: 512, name: 'customer_address', nullable: true })
  customerAddress: string | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'taxable_amount',
    nullable: true,
  })
  taxableAmount: string | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'exempt_amount',
    nullable: true,
  })
  exemptAmount: string | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'unaffected_amount',
    nullable: true,
  })
  unaffectedAmount: string | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'igv_amount',
    nullable: true,
  })
  igvAmount: string | null;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'igv_rate',
    nullable: true,
  })
  igvRate: string | null;

  @Column({
    type: 'enum',
    enum: ElectronicDocumentStatus,
    name: 'electronic_status',
    nullable: true,
  })
  electronicStatus: ElectronicDocumentStatus | null;
}
