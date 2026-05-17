import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('formato_papel_catalogo')
export class FormatoPapel {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_formato_papel: string;

  @Field()
  @Column({ type: 'varchar', length: 32, unique: true })
  codigo: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  etiqueta: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  largo: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  alto: number;

  @Field()
  @Column({ type: 'varchar', length: 10, default: 'mm' })
  unidad_medida: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', default: 0 })
  orden: number;

  @Field()
  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
