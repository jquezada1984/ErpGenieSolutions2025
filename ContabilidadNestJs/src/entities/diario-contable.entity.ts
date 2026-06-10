import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('diario_contable')
export class DiarioContable {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_diario_contable: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 20 })
  codigo: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Field(() => String)
  @Column({ type: 'varchar', length: 50 })
  tipo_diario: string;

  @Field(() => String)
  etiqueta: string;

  @Field(() => String)
  tipo_diario_label: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
