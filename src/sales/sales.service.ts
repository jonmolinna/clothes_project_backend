import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Cash, CashStatus } from 'src/cash/entity/cash.entity';
import { Customer } from 'src/customers/entity/customer.entity';
import { DocumentSeries } from 'src/document-series/entity/document-series.entity';
import { Inventory } from 'src/inventory/entity/inventory.entity';
import { ProductVariant } from 'src/product-variants/entity/product-variant.entity';
import { SaleItem } from 'src/sale-items/entity/sale-items.entity';
import {
  ElectronicDocumentStatus,
  SALE_DOCUMENT_TYPE_CODES,
  SaleDocumentTypeCode,
} from 'src/sales/constants/document.constants';
import { CreateSaleDto } from 'src/sales/dto/create-sale.dto';
import { SaleActorContextDto } from 'src/sales/dto/sale-actor.dto';
import { SaleDocument } from 'src/sales/entity/sale-document.entity';
import {
  Sale,
  SalePaymentMethod,
  SaleStatus,
} from 'src/sales/entity/sale.entity';
import { User } from 'src/users/entity/users.entity';
import { DataSource } from 'typeorm';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i; // UUID v1–v8

function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

function roundMoney(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2);
}

function parseMoney(s: string): number {
  return Number.parseFloat(s);
}

@Injectable()
export class SalesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateSaleDto, actor: SaleActorContextDto): Promise<Sale> {
    this.validateDtoShape(dto);

    return this.dataSource.transaction(async (mgr) => {
      const user = await mgr.findOne(User, {
        where: { id: actor.userId },
        relations: ['store', 'branch'],
      });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      if (!user.branch || user.branch.id !== actor.branchId) {
        throw new ForbiddenException(
          'El usuario no pertenece a la sede indicada',
        );
      }
      if (user.store.id !== actor.storeId) {
        throw new ForbiddenException(
          'El usuario no pertenece a la tienda indicada',
        );
      }

      const cash = await mgr.findOne(Cash, {
        where: {
          id: dto.sessionId,
          status: CashStatus.OPEN,
          branch: { id: actor.branchId },
        },
        relations: ['branch'],
      });
      if (!cash) {
        throw new BadRequestException(
          'Sesión de caja no encontrada, cerrada o de otra sede',
        );
      }

      const docDto = dto.document;
      const variantIds = [...new Set(dto.items.map((i) => i.variantId))].sort();

      const variants = await mgr.find(ProductVariant, {
        where: variantIds.map((id) => ({ id })),
        relations: ['product', 'product.store'],
      });
      if (variants.length !== variantIds.length) {
        throw new BadRequestException('Una o más variantes no existen');
      }
      const variantById = new Map(variants.map((v) => [v.id, v]));
      for (const v of variants) {
        if (v.product.store.id !== actor.storeId) {
          throw new BadRequestException(
            'Las variantes deben pertenecer a la tienda del usuario',
          );
        }
      }

      const inventories: Inventory[] = [];
      for (const vid of variantIds) {
        const inv = await mgr.findOne(Inventory, {
          where: {
            variant: { id: vid },
            branch: { id: actor.branchId },
          },
          relations: ['variant', 'branch'],
          lock: { mode: 'pessimistic_write' },
        });
        if (!inv) {
          throw new BadRequestException(
            `Sin registro de stock para la variante ${vid} en esta sede`,
          );
        }
        inventories.push(inv);
      }
      const invByVariantId = new Map(
        inventories.map((i) => [i.variant.id, i]),
      );

      const qtyNeededByVariant = new Map<string, number>();
      for (const line of dto.items) {
        qtyNeededByVariant.set(
          line.variantId,
          (qtyNeededByVariant.get(line.variantId) ?? 0) + line.quantity,
        );
      }
      for (const [vid, need] of qtyNeededByVariant) {
        const inv = invByVariantId.get(vid)!;
        if (inv.quantity < need) {
          throw new BadRequestException(
            `Stock insuficiente para la variante ${vid}`,
          );
        }
      }

      const seriesRow = await mgr.findOne(DocumentSeries, {
        where: {
          branch: { id: actor.branchId },
          documentTypeCode: docDto.documentTypeCode,
          series: docDto.series,
        },
        relations: ['branch'],
        lock: { mode: 'pessimistic_write' },
      });
      if (!seriesRow) {
        throw new BadRequestException(
          'Serie no configurada para esta sede y tipo de documento',
        );
      }

      const correlativo = seriesRow.nextNumber;
      seriesRow.nextNumber = correlativo + 1;
      await mgr.save(DocumentSeries, seriesRow);

      const isInternal = docDto.documentTypeCode === SaleDocumentTypeCode.NOTA_VENTA_INTERNA;
      const defaultIgvCode = isInternal ? null : '10';

      let sumLineSubtotals = 0;
      const linePayloads: {
        variant: ProductVariant;
        quantity: number;
        unitPrice: string;
        discount: string;
        subtotal: string;
        igvAffectationCode: string | null;
        sunatProductCode: string | null;
        unitCode: string | null;
      }[] = [];

      for (const line of dto.items) {
        const variant = variantById.get(line.variantId)!;
        const qty = line.quantity;
        const lineDisc = line.discount ?? 0;
        if (lineDisc < 0) {
          throw new BadRequestException('Descuento de línea inválido');
        }

        const unitNum =
          line.unitPrice !== undefined
            ? line.unitPrice
            : variant.priceOverride !== null
              ? parseMoney(variant.priceOverride)
              : parseMoney(variant.product.price);
        if (unitNum < 0) {
          throw new BadRequestException('Precio unitario inválido');
        }

        const rawSubtotal = qty * unitNum - lineDisc;
        if (rawSubtotal < 0) {
          throw new BadRequestException('Subtotal de línea negativo');
        }
        const subtotalStr = roundMoney(rawSubtotal);
        sumLineSubtotals += Number.parseFloat(subtotalStr);

        const igvCode =
          line.igvAffectationCode !== undefined
            ? line.igvAffectationCode
            : defaultIgvCode;

        linePayloads.push({
          variant,
          quantity: qty,
          unitPrice: roundMoney(unitNum),
          discount: roundMoney(lineDisc),
          subtotal: subtotalStr,
          igvAffectationCode: igvCode,
          sunatProductCode: line.sunatProductCode ?? null,
          unitCode: line.unitCode ?? null,
        });
      }

      const headerDiscount = dto.discount ?? 0;
      if (headerDiscount < 0) {
        throw new BadRequestException('Descuento global inválido');
      }
      const subtotalStr = roundMoney(sumLineSubtotals);
      const totalNum = sumLineSubtotals - headerDiscount;
      if (totalNum < 0) {
        throw new BadRequestException('Total de venta negativo');
      }
      const totalStr = roundMoney(totalNum);

      let customer: Customer | null = null;
      if (dto.customerId) {
        customer = await mgr.findOne(Customer, {
          where: { id: dto.customerId, store: { id: actor.storeId } },
        });
        if (!customer) {
          throw new BadRequestException('Cliente no encontrado en la tienda');
        }
      }

      const sale = mgr.create(Sale, {
        store: user.store,
        branch: user.branch,
        user,
        customer,
        session: cash,
        subtotal: subtotalStr,
        discount: roundMoney(headerDiscount),
        total: totalStr,
        paymentMethod: dto.paymentMethod,
        status: SaleStatus.COMPLETED,
      });
      const savedSale = await mgr.save(Sale, sale);

      const issuedAt = docDto.issuedAt
        ? new Date(docDto.issuedAt)
        : new Date();
      if (Number.isNaN(issuedAt.getTime())) {
        throw new BadRequestException('issuedAt inválido');
      }

      const snapName =
        docDto.customerName ?? customer?.name ?? null;
      const snapDocNumber =
        docDto.customerDocNumber ?? customer?.dni ?? null;
      const snapDocType =
        docDto.customerDocType ?? (snapDocNumber ? '1' : null);

      const fiscal = this.resolveFiscalSnapshot(
        docDto.documentTypeCode,
        totalNum,
        {
          taxableAmount: docDto.taxableAmount,
          exemptAmount: docDto.exemptAmount,
          unaffectedAmount: docDto.unaffectedAmount,
          igvAmount: docDto.igvAmount,
          igvRate: docDto.igvRate,
        },
      );

      const saleDoc = mgr.create(SaleDocument, {
        sale: savedSale,
        documentSeries: seriesRow,
        branchId: actor.branchId,
        documentTypeCode: docDto.documentTypeCode,
        series: docDto.series,
        number: correlativo,
        issuedAt,
        customerName: snapName,
        customerDocType: snapDocType,
        customerDocNumber: snapDocNumber,
        customerAddress: docDto.customerAddress ?? null,
        taxableAmount: fiscal.taxableAmount,
        exemptAmount: fiscal.exemptAmount,
        unaffectedAmount: fiscal.unaffectedAmount,
        igvAmount: fiscal.igvAmount,
        igvRate: fiscal.igvRate,
        electronicStatus: isInternal
          ? null
          : ElectronicDocumentStatus.DRAFT,
      });
      await mgr.save(SaleDocument, saleDoc);

      for (const row of linePayloads) {
        const item = mgr.create(SaleItem, {
          sale: savedSale,
          variant: row.variant,
          quantity: row.quantity,
          unitPrice: row.unitPrice,
          discount: row.discount,
          subtotal: row.subtotal,
          igvAffectationCode: row.igvAffectationCode,
          sunatProductCode: row.sunatProductCode,
          unitCode: row.unitCode,
        });
        await mgr.save(SaleItem, item);
      }

      for (const line of dto.items) {
        const inv = invByVariantId.get(line.variantId)!;
        inv.quantity -= line.quantity;
        await mgr.save(Inventory, inv);
      }

      return mgr.findOneOrFail(Sale, {
        where: { id: savedSale.id },
        relations: ['document', 'saleItems', 'branch', 'store', 'customer'],
      });
    });
  }

  private validateDtoShape(dto: CreateSaleDto): void {
    if (!dto || typeof dto !== 'object') {
      throw new BadRequestException('Cuerpo inválido');
    }
    if (!isUuid(dto.sessionId)) {
      throw new BadRequestException('sessionId inválido');
    }
    if (!Object.values(SalePaymentMethod).includes(dto.paymentMethod)) {
      throw new BadRequestException('paymentMethod inválido');
    }
    if (!dto.document || typeof dto.document !== 'object') {
      throw new BadRequestException('document requerido');
    }
    if (!SALE_DOCUMENT_TYPE_CODES.includes(dto.document.documentTypeCode)) {
      throw new BadRequestException('documentTypeCode inválido');
    }
    if (
      typeof dto.document.series !== 'string' ||
      dto.document.series.length < 1 ||
      dto.document.series.length > 8
    ) {
      throw new BadRequestException('series inválida');
    }
    if (!Array.isArray(dto.items) || dto.items.length === 0) {
      throw new BadRequestException('Debe incluir al menos un ítem');
    }
    if (dto.customerId !== undefined && !isUuid(dto.customerId)) {
      throw new BadRequestException('customerId inválido');
    }
    for (const it of dto.items) {
      if (!it || typeof it !== 'object') {
        throw new BadRequestException('Ítem inválido');
      }
      if (!isUuid(it.variantId)) {
        throw new BadRequestException('variantId inválido');
      }
      if (
        typeof it.quantity !== 'number' ||
        !Number.isInteger(it.quantity) ||
        it.quantity < 1
      ) {
        throw new BadRequestException('quantity inválida');
      }
      if (it.discount !== undefined && (typeof it.discount !== 'number' || it.discount < 0)) {
        throw new BadRequestException('discount de línea inválido');
      }
      if (
        it.unitPrice !== undefined &&
        (typeof it.unitPrice !== 'number' || it.unitPrice < 0)
      ) {
        throw new BadRequestException('unitPrice inválido');
      }
    }
    if (dto.discount !== undefined && (typeof dto.discount !== 'number' || dto.discount < 0)) {
      throw new BadRequestException('discount inválido');
    }
  }

  private resolveFiscalSnapshot(
    documentTypeCode: string,
    totalWithTax: number,
    input: {
      taxableAmount?: number;
      exemptAmount?: number;
      unaffectedAmount?: number;
      igvAmount?: number;
      igvRate?: number;
    },
  ): {
    taxableAmount: string | null;
    exemptAmount: string | null;
    unaffectedAmount: string | null;
    igvAmount: string | null;
    igvRate: string | null;
  } {
    if (documentTypeCode === SaleDocumentTypeCode.NOTA_VENTA_INTERNA) {
      return {
        taxableAmount: null,
        exemptAmount: null,
        unaffectedAmount: null,
        igvAmount: null,
        igvRate: null,
      };
    }

    const rate = input.igvRate ?? 18;
    if (
      input.taxableAmount !== undefined &&
      input.igvAmount !== undefined
    ) {
      return {
        taxableAmount: roundMoney(input.taxableAmount),
        exemptAmount:
          input.exemptAmount !== undefined
            ? roundMoney(input.exemptAmount)
            : null,
        unaffectedAmount:
          input.unaffectedAmount !== undefined
            ? roundMoney(input.unaffectedAmount)
            : null,
        igvAmount: roundMoney(input.igvAmount),
        igvRate: roundMoney(rate),
      };
    }

    /** Precios con IGV incluido: total = taxable + igv, igv = taxable * rate/100. */
    const taxable = totalWithTax / (1 + rate / 100);
    const igv = totalWithTax - taxable;
    return {
      taxableAmount: roundMoney(taxable),
      exemptAmount:
        input.exemptAmount !== undefined
          ? roundMoney(input.exemptAmount)
          : roundMoney(0),
      unaffectedAmount:
        input.unaffectedAmount !== undefined
          ? roundMoney(input.unaffectedAmount)
          : roundMoney(0),
      igvAmount: roundMoney(igv),
      igvRate: roundMoney(rate),
    };
  }
}
