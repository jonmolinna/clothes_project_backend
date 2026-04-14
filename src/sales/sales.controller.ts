import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { CreateSaleDto } from 'src/sales/dto/create-sale.dto';
import { SaleActorContextDto } from 'src/sales/dto/sale-actor.dto';
import { SalesService } from './sales.service';

function headerString(
  headers: Record<string, string | string[] | undefined>,
  name: string,
): string | undefined {
  const v = headers[name.toLowerCase()] ?? headers[name];
  if (Array.isArray(v)) {
    return v[0];
  }
  return v;
}

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  /**
   * Crea una venta con comprobante y descuenta stock.
   * `branchId` y `storeId` deben venir del token JWT; aquí se leen cabeceras para desarrollo.
   */
  @Post()
  create(
    @Body() dto: CreateSaleDto,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    const actor = this.parseActor(headers);
    return this.salesService.create(dto, actor);
  }

  private parseActor(
    headers: Record<string, string | string[] | undefined>,
  ): SaleActorContextDto {
    const userId = headerString(headers, 'x-user-id');
    const branchRaw = headerString(headers, 'x-branch-id');
    const storeId = headerString(headers, 'x-store-id');
    if (!userId || !branchRaw || !storeId) {
      throw new BadRequestException(
        'Cabeceras x-user-id, x-branch-id y x-store-id son requeridas',
      );
    }
    const branchId = Number.parseInt(branchRaw, 10);
    if (!Number.isFinite(branchId)) {
      throw new BadRequestException('x-branch-id inválido');
    }
    return { userId, branchId, storeId };
  }
}
