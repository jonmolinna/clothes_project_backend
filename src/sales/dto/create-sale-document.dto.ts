import { SaleDocumentTypeCodeValue } from 'src/sales/constants/document.constants';

export class CreateSaleDocumentDto {
  documentTypeCode!: SaleDocumentTypeCodeValue;
  series!: string;
  /** Si se omite, se usa la fecha actual al emitir. */
  issuedAt?: string;
  customerName?: string;
  customerDocType?: string;
  customerDocNumber?: string;
  customerAddress?: string;
  taxableAmount?: number;
  exemptAmount?: number;
  unaffectedAmount?: number;
  igvAmount?: number;
  igvRate?: number;
}
