import { Entity, PrimaryColumn, Column } from 'typeorm';

/** Solo para joins en consultas de ítem (misma tabla que InicioNestJs). */
@Entity('tipo_item_catalogo')
export class TipoItemCatalogo {
  @PrimaryColumn('uuid', { name: 'id_tipo_item' })
  id_tipo_item: string;

  @Column({ type: 'varchar', length: 50 })
  codigo: string;
}
