import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sunat_catalog_items')
export class SunatCatalogItem {
  /** id — Identificador único (PK, uuid). */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** catalog_number — Número del catálogo (ej: 09, 01, 10). */
  @Column({ type: 'varchar', length: 3, name: 'catalog_number' })
  catalogNumber: string;

  /** catalog_name — Nombre del catálogo (ej: Tipo de Afectación al IGV). */
  @Column({ type: 'varchar', length: 255, name: 'catalog_name' })
  catalogName: string;

  /** code — Código del ítem (ej: 10, 20). */
  @Column({ type: 'varchar', length: 5 })
  code: string;

  /** description — Descripción oficial del ítem. */
  @Column({ type: 'varchar', length: 512 })
  description: string;

  /**
   * group — Grupo (nullable; típico del catálogo 09).
   * Columna `group` entrecomillada en BD (palabra reservada).
   */
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'group' })
  group: string | null;

  /** igv_rate — Tasa IGV % (nullable; típico del catálogo 09). Decimal(5,2). */
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'igv_rate',
    nullable: true,
  })
  igvRate: string | null;

  /** applies_igv — Aplica IGV (nullable; típico del catálogo 09). */
  @Column({ type: 'boolean', name: 'applies_igv', nullable: true })
  appliesIgv: boolean | null;

  /** is_active — Si el ítem está vigente para uso en el sistema. */
  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;
}

/*
10: Gravado - Operación Onerosa
11: Gravado – Retiro por premio
12: Gravado – Retiro por donación
13: Gravado – Retiro
14: Gravado – Retiro por publicidad
15: Gravado – Bonificaciones
16: Gravado – Retiro por entrega a trabajadores
20: Exonerado - Operación Onerosa
21: Exonerado – Transferencia Gratuita
30: Inafecto - Operación Onerosa
31: Inafecto – Retiro por Bonificación
32: Inafecto – Retiro
33: Inafecto – Retiro por Muestras Médicas
34: Inafecto - Retiro por Convenio Colectivo
35: Inafecto – Retiro por premio
36: Inafecto - Retiro por publicidad
37: Inafecto - Transferencia gratuita
40: Exportación de bienes o serviciosExportación
*/