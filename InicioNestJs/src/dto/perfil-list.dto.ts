import { ObjectType, Field, ID } from '@nestjs/graphql';

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
} 