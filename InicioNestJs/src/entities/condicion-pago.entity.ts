import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('condicion_pago_catalogo')
export class CondicionPago {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_condicion_pago: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  etiqueta: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  etiqueta_documento?: string;

  @Column({ type: 'numeric', nullable: true })
  porcentaje_deposito?: number;

  @Column({ type: 'int', nullable: true })
  numero_dias?: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo_fin_mes?: string;

  @Column({ type: 'int', nullable: true })
  decalaje_dias?: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  orden: number;

  @Field()
  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
