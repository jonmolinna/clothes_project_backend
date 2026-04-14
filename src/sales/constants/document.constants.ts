/** Catálogo SUNAT 01 — comprobantes de pago; NV = nota de venta interna (no SUNAT). */
export const SaleDocumentTypeCode = {
  FACTURA: '01',
  BOLETA: '03',
  NOTA_VENTA_INTERNA: 'NV',
} as const;

export type SaleDocumentTypeCodeValue =
  (typeof SaleDocumentTypeCode)[keyof typeof SaleDocumentTypeCode];

export const SALE_DOCUMENT_TYPE_CODES: SaleDocumentTypeCodeValue[] = [
  SaleDocumentTypeCode.FACTURA,
  SaleDocumentTypeCode.BOLETA,
  SaleDocumentTypeCode.NOTA_VENTA_INTERNA,
];

/** Estado ante OSE/SUNAT (opcional hasta integrar facturación electrónica). */
export enum ElectronicDocumentStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  VOIDED = 'voided',
}
