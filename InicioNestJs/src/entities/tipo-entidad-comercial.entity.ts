import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('tipo_entidad_comercial')
export class TipoEntidadComercial {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_tipo_entidad: number;

  @Field()
  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Field()
  @Column({ type: 'boolean', default: true })
  activo: boolean;
} 