import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Empresa } from './empresa.entity';

@ObjectType()
@Entity('sucursal')
export class Sucursal {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_sucursal: string;

  @Field(() => ID)
  @Column()
  id_empresa: string;

  @Field()
  @Column({ length: 100 })
  nombre: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  direccion?: string;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  telefono?: string;

  @Field()
  @Column({ default: true })
  estado: boolean;

  @Field()
  @Column({ 
    type: 'char', 
    length: 3, 
    default: '001',
    transformer: {
      to: (value: string) => value,
      from: (value: string) => value?.trim()
    }
  })
  codigo_establecimiento: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => Empresa, { nullable: true })
  @ManyToOne(() => Empresa, empresa => empresa.sucursales)
  @JoinColumn({ name: 'id_empresa' })
  empresa?: Empresa;
} 