import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateContactoInput } from './create-contacto.dto';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateContactoInput extends PartialType(CreateContactoInput) {
  @Field()
  @IsUUID()
  id_contacto: string;
}
