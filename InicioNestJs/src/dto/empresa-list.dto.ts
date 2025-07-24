import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class EmpresaListDto {
  @Field(() => ID)
  id_empresa: string;

  @Field()
  nombre: string;

  @Field()
  ruc: string;

  @Field()
  direccion: string;

  @Field()
  telefono: string;

  @Field()
  email: string;

  @Field()
  estado: boolean;
} 