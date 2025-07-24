import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateEmpresaInput } from './create-empresa.input';

@InputType()
export class UpdateEmpresaInput extends PartialType(CreateEmpresaInput) {} 