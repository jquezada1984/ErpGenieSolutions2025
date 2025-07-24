import { ObjectType, Field, ID } from '@nestjs/graphql';

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
} 