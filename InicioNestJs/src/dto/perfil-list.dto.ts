import { ObjectType, Field, ID } from '@nestjs/graphql';
import { EmpresaBasicDto } from './empresa-basic.dto';

@ObjectType()
export class PerfilListDto {
  @Field(() => ID)
  id_perfil: string;

  @Field()
  nombre: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field()
  estado: boolean;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => EmpresaBasicDto, { nullable: true })
  empresa?: EmpresaBasicDto;
} 