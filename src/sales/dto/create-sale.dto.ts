import { SalePaymentMethod } from 'src/sales/entity/sale.entity';
import { CreateSaleDocumentDto } from './create-sale-document.dto';
import { CreateSaleItemDto } from './create-sale-item.dto';

export class CreateSaleDto {
  sessionId!: string;
  paymentMethod!: SalePaymentMethod;
  /** Descuento global sobre el subtotal de ítems (>= 0). */
  discount?: number;
  customerId?: string;
  document!: CreateSaleDocumentDto;
  items!: CreateSaleItemDto[];
}
