import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';

import { Tercero } from '../../entities/tercero.entity';

@ObjectType()
@Entity('contacto_direccion')
export class Contacto {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_contacto: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  id_tercero: string;

  @Field(() => Tercero, { nullable: true })
  @ManyToOne(() => Tercero, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_tercero' })
  tercero: Tercero;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  apellidos_etiqueta?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  nombre?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  titulo_cortesia?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  puesto_trabajo?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  direccion?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  codigo_postal?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  poblacion?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 36, nullable: true })
  id_pais?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_provincia?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  telefono_trabajo?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  telefono_particular?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  movil?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  fax?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  correo?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  visibilidad?: string;

  @Field(() => String, { nullable: true, description: 'Fecha de nacimiento (YYYY-MM-DD)' })
  @Column({
    type: 'date',
    nullable: true,
    transformer: {
      from: (val: Date | string | null) =>
        val == null ? null : typeof val === 'string' ? val : (val as Date).toISOString().slice(0, 10),
      to: (val: string | Date | null) => val ?? null,
    },
  })
  fecha_nacimiento?: string | Date;

  @Field({ defaultValue: false })
  @Column({ type: 'boolean', default: false })
  alerta_cumpleanos: boolean;

  @Field({ defaultValue: true })
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
