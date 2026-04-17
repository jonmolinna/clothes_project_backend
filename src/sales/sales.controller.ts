import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CreateSaleDto } from 'src/sales/dto/create-sale.dto';
import { SaleActorContextDto } from 'src/sales/dto/sale-actor.dto';
import { SalesService } from './sales.service';
import { UserRole } from 'src/users/entity/users.entity';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  /**
   * Crea una venta con comprobante y descuenta stock.
   * `branchId` y `storeId` deben venir del token JWT; aquí se leen cabeceras para desarrollo.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENTAS, UserRole.CAJERO)
  @Post()
  create(
    @Body() dto: CreateSaleDto,
    @Req() req: { user: JwtPayload },
  ) {
    const actor = this.parseActor(req.user);
    return this.salesService.create(dto, actor);
  }

  private parseActor(payload: JwtPayload | undefined): SaleActorContextDto {
    if (!payload) {
      throw new BadRequestException('Usuario autenticado requerido');
    }
    if (!payload.branchId || !Number.isFinite(payload.branchId)) {
      throw new BadRequestException(
        'El usuario autenticado no tiene una sede asignada',
      );
    }
    return {
      userId: payload.sub,
      branchId: payload.branchId,
      storeId: payload.storeId,
    };
  }
}
