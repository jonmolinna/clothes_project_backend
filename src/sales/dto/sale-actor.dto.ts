/** Contexto del cajero; en producción debe rellenarse desde JWT, no desde el body. */
export class SaleActorContextDto {
  userId!: string;
  branchId!: number;
  storeId!: string;
}
