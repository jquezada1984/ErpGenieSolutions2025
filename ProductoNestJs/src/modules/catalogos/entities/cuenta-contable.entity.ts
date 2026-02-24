import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@ObjectType()
@Entity('cuenta_contable')
export class CuentaContable {

  @Field(() => ID)
  @PrimaryColumn({ name: 'id_cuenta_contable', type: 'uuid' })
  id_cuenta_contable: string;

  @Field({ nullable: true })
  @Column({ name: 'id_plan_contable', type: 'uuid', nullable: true })
  id_plan_contable?: string;

  @Field()
  @Column({ name: 'codigo', type: 'varchar', length: 20 })
  codigo: string;

  @Field()
  @Column({ name: 'nombre', type: 'varchar', length: 150 })
  nombre: string;

  @Field({ nullable: true })
  @Column({ name: 'descripcion', type: 'varchar', length: 255, nullable: true })
  descripcion?: string;

  @Field({ nullable: true })
  @Column({ name: 'tipo_cuenta', type: 'varchar', length: 50, nullable: true })
  tipo_cuenta?: string;

  @Field({ nullable: true })
  @Column({ name: 'nivel', type: 'int', nullable: true })
  nivel?: number;

  @Field({ nullable: true })
  @Column({ name: 'permite_movimientos', type: 'boolean', nullable: true })
  permite_movimientos?: boolean;

  @Field({ nullable: true })
  @Column({ name: 'estado', type: 'boolean', nullable: true })
  estado?: boolean;
}
