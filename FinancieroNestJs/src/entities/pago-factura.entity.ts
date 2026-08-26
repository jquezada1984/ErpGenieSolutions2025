import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
@Entity('pago_factura')
export class PagoFactura {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_pago_factura: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_pago: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_factura: string;

  @Field(() => String)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  monto_aplicado: string;

  @Field(() => String, { nullable: true })
  numero_factura?: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
