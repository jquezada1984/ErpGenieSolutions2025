import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

import { Tercero } from '../../tercero/entities/tercero.entity';
import { RolSocio } from './rol-socio.entity';

@ObjectType()
@Entity('socio')
export class Socio {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_socio: string;

  @Column({ type: 'uuid', nullable: true })
  id_rol_socio?: string;

  @Field(() => RolSocio, { nullable: true })
  @ManyToOne(() => RolSocio, { nullable: true })
  @JoinColumn({ name: 'id_rol_socio' })
  rol_socio?: RolSocio;

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  fecha_inicio?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  fecha_fin?: string;

  @Field()
  @Column({ type: 'boolean' })
  estado: boolean;

  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  @OneToMany(() => SocioTercero, (st) => st.socio)
  socioTerceros: SocioTercero[];
}

@Entity('socio_tercero')
export class SocioTercero {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  id_socio: string;

  @Column({ type: 'uuid' })
  id_tercero: string;

  @ManyToOne(() => Socio, (s) => s.socioTerceros, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_socio' })
  socio: Socio;

  @ManyToOne(() => Tercero, { nullable: false })
  @JoinColumn({ name: 'id_tercero' })
  tercero: Tercero;
}
