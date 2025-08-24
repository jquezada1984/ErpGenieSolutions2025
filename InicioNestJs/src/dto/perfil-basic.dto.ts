import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PerfilBasicDto {
  @Field(() => ID)
  id_perfil: string;

  @Field()
  nombre: string;

  @Field()
  estado: boolean;
}
