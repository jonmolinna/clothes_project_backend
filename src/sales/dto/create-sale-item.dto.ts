export class CreateSaleItemDto {
  variantId!: string;
  quantity!: number;
  /** Si se omite, se usa precio de variante (override) o del producto. */
  unitPrice?: number;
  discount?: number;
  /** Catálogo SUNAT 07; por defecto `10` en comprobantes fiscales. */
  igvAffectationCode?: string;
  sunatProductCode?: string;
  unitCode?: string;
}
