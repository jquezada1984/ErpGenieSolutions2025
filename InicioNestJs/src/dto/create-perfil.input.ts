import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class CreatePerfilInput {
  @Field()
  nombre: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field({ nullable: true })
  estado?: boolean;

  @Field(() => ID)
  id_empresa: string;
} 