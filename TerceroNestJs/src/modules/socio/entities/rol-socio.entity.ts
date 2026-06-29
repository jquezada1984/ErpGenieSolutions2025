import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('rol_socio')
export class RolSocio {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_rol_socio: string;

  @Field()
  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;
}
