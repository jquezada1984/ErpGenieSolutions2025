import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType, Int, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
@Entity('factura_linea')
export class FacturaLinea {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_factura_linea: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_factura: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_item: string | null;

  @Field()
  @Column({ type: 'varchar', length: 500 })
  descripcion: string;

  @Field(() => String)
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  cantidad: string;

  @Field(() => String)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  precio_unitario: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  descuento_porcentaje: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  descuento_valor: string | null;

  @Field(() => String)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  subtotal: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_cuenta_contable: string | null;

  @Field(() => Int)
  @Column({ type: 'int' })
  orden: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
