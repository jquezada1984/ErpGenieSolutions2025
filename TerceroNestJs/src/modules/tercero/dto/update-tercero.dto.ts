import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateTerceroInput } from './create-tercero.dto';
import { IsUUID, IsOptional } from 'class-validator';

@InputType()
export class UpdateTerceroInput extends PartialType(CreateTerceroInput) {
  @Field() @IsUUID() id_tercero: string;
  @Field({ nullable: true }) @IsUUID() @IsOptional() updated_by?: string;
}
