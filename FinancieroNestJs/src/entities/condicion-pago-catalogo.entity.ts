import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('condicion_pago_catalogo')
export class CondicionPagoCatalogo {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_condicion_pago: string;

  @Field()
  @Column({ type: 'varchar', length: 32, unique: true })
  codigo: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  etiqueta: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  etiqueta_documento: string | null;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  porcentaje_deposito: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', default: 0 })
  numero_dias: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, default: 'ninguno' })
  tipo_fin_mes: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  decalaje_dias: number | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', default: 0 })
  orden: number;

  @Field()
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Field({ name: 'descripcion' })
  get descripcion(): string {
    return this.etiqueta;
  }
}
