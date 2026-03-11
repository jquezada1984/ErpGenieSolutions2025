import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Empresa } from '../entities/empresa.entity';
import { Perfil } from '../entities/perfil.entity';

@ObjectType()
export class UsuarioListDto {
  @Field(() => ID)
  id_usuario: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  nombre_completo?: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  estado: boolean;

  @Field({ nullable: true })
  created_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;

  @Field(() => Empresa, { nullable: true })
  empresa?: Empresa;

  @Field(() => Perfil, { nullable: true })
  perfil?: Perfil;
} 