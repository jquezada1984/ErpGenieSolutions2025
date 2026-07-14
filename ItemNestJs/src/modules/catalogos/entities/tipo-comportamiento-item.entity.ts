import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('tipo_comportamiento_item')
export class TipoComportamientoItem {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_tipo_comportamiento: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', default: 0 })
  orden: number;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string;
}
