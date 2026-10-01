import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  Field,
  Float,
  ID,
  Int,
  ObjectType,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { Gasto } from './gasto.entity';

/**
 * NUMERIC → Float en GraphQL: mismo patrón que BancoCajaNestJs (cuenta/movimiento).
 * cantidad/precio: precision 15,4; montos: 15,2.
 */
@ObjectType()
@Entity({ name: 'gasto_detalle', schema: 'public' })
export class GastoDetalle {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_gasto_detalle: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_gasto: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_item?: string | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  impuesto_id?: number | null;

  @Field()
  @Column({ type: 'text' })
  descripcion: string;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 4, default: 1 })
  cantidad: number;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 4, default: 0 })
  precio_unitario: number;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  descuento: number;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  valor_impuesto: number;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  total: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 1 })
  orden: number;

  @Field()
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Field(() => GraphQLISODateTime)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Gasto, (g) => g.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_gasto' })
  gasto?: Gasto;
}
