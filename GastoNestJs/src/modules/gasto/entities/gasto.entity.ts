import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  Field,
  Float,
  ID,
  ObjectType,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { CategoriaGasto } from '../../categoria-gasto/entities/categoria-gasto.entity';
import { GastoDetalle } from './gasto-detalle.entity';

/**
 * Relación externa (tercero, item, impuesto, usuarios): solo IDs.
 * Los nombres/catálogos se resuelven en el front vía queries de otros Nest
 * (Terceros, Items, Inicio) — evita acoplar entities de otros dominios.
 */
@ObjectType()
@Entity({ name: 'gasto', schema: 'public' })
export class Gasto {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_gasto: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  numero_gasto: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_tercero?: string | null;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_categoria_gasto: string;

  @Field(() => CategoriaGasto, { nullable: true })
  @ManyToOne(() => CategoriaGasto, { nullable: false })
  @JoinColumn({ name: 'id_categoria_gasto' })
  categoria?: CategoriaGasto;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo_documento?: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  numero_documento?: string | null;

  @Field(() => String)
  @Column({ type: 'date' })
  fecha_gasto: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  fecha_vencimiento?: string | null;

  @Field()
  @Column({ type: 'text' })
  concepto: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  observacion?: string | null;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  descuento: number;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  impuesto: number;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  total: number;

  @Field()
  @Column({ type: 'varchar', length: 20, default: 'BORRADOR' })
  estado_gasto: string;

  @Field()
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  created_by?: string | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  updated_by?: string | null;

  @Field(() => GraphQLISODateTime)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  /** Solo se carga en query `gasto` (detalle), no en listado `gastos`. */
  @Field(() => [GastoDetalle], { nullable: true })
  @OneToMany(() => GastoDetalle, (d) => d.gasto)
  detalles?: GastoDetalle[];
}
