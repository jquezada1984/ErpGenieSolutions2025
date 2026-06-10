import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('forma_pago_catalogo')
export class FormaPago {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_forma_pago: string;

  @Field()
  @Column({ type: 'varchar', length: 16, unique: true })
  codigo: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  etiqueta: string;

  @Field()
  @Column({ type: 'varchar', length: 30, default: 'cliente_proveedor' })
  tipo_uso: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', default: 0 })
  orden: number;

  @Field()
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Field(() => String, { name: 'descripcion' })
  get descripcion(): string {
    return this.etiqueta;
  }
}
