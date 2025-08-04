import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class EmpresaBasicDto {
  @Field(() => ID)
  id_empresa: string;

  @Field()
  nombre: string;

  @Field()
  ruc: string;
} 