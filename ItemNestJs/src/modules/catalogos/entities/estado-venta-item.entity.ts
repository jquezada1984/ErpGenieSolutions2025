import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('estado_venta_item')
export class EstadoVentaItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_estado_venta: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion?: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'smallint', default: 0 })
  orden: number;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  created_by?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updated_by?: string;
}
