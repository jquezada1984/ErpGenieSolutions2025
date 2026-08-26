import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Mapeo mínimo de public.movimiento_inventario para consultas de historial.
 * synchronize:false en la configuración global: no crea ni altera la tabla.
 */
@Entity({ name: 'movimiento_inventario', schema: 'public' })
export class MovimientoInventario {
  @PrimaryColumn('uuid')
  id_movimiento_inventario: string;

  @Column({ type: 'uuid' })
  id_empresa: string;

  @Column({ type: 'uuid' })
  id_item: string;

  @Column({ type: 'varchar', nullable: true })
  tipo_movimiento?: string | null;

  @Column({ type: 'numeric', nullable: true })
  cantidad?: string | null;

  @Column({ type: 'date', nullable: true })
  fecha_movimiento?: string | null;

  @Column({ type: 'varchar', nullable: true })
  referencia?: string | null;

  @Column({ type: 'text', nullable: true })
  concepto?: string | null;

  @Column({ type: 'uuid', nullable: true })
  id_almacen?: string | null;

  @Column({ type: 'varchar', nullable: true })
  modulo_origen?: string | null;

  @Column({ type: 'uuid', nullable: true })
  id_almacen_destino?: string | null;

  @Column({ type: 'boolean', nullable: true })
  estado?: boolean | null;
}
