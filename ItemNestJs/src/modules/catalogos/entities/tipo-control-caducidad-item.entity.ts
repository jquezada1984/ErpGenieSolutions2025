import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('tipo_control_caducidad_item')
export class TipoControlCaducidadItem {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_tipo_control_caducidad: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Field(() => Int)
  @Column({ type: 'integer' })
  orden: number;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Column({ type: 'timestamp without time zone', nullable: true })
  created_at?: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  updated_at?: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string;
}