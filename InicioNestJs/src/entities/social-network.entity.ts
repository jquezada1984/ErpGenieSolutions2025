import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('social_network')
export class SocialNetwork {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_red_social: string;

  @Field()
  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;

  @Field()
  @Column({ type: 'varchar', length: 10 })
  icono: string;

  @Field()
  @Column({ type: 'int', default: 0 })
  orden: number;
} 