import { InputType, Field, Int, ID, PartialType } from '@nestjs/graphql';
import { CreatePerfilInput } from './create-perfil.input';

@InputType()
export class UpdatePerfilInput extends PartialType(CreatePerfilInput) {
  @Field(() => ID)
  id_perfil: string;
} 