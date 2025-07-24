import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsUUID, IsInt, Min, Max, IsEmail, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateEmpresaIdentificacionInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  administradores?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  delegado_datos?: string;

  @Field({ nullable: true })
  @IsOptional()
  capital?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  id_tipo_entidad?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  objeto_empresa?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cif_intra?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id_profesional1?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id_profesional2?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id_profesional3?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id_profesional4?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id_profesional5?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id_profesional6?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id_profesional7?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id_profesional8?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id_profesional9?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id_profesional10?: string;
}

@InputType()
export class CreateEmpresaRedSocialInput {
  @Field()
  @IsUUID()
  id_red_social: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  identificador?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  url?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  es_principal?: boolean;
}

@InputType()
export class CreateEmpresaHorarioAperturaInput {
  @Field()
  @IsInt()
  @Min(1)
  @Max(7)
  dia: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  valor?: string;
}

@InputType()
export class CreateEmpresaInput {
  @Field()
  @IsString()
  nombre: string;

  @Field()
  @IsString()
  ruc: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  direccion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  telefono?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  // Nuevos campos
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  id_moneda?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  id_pais?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  codigo_postal?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  poblacion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  movil?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fax?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  web?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nota?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  sujeto_iva?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  id_provincia?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  fiscal_year_start_month?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  fiscal_year_start_day?: number;

  // Relaciones
  @Field(() => CreateEmpresaIdentificacionInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEmpresaIdentificacionInput)
  identificacion?: CreateEmpresaIdentificacionInput;

  @Field(() => [CreateEmpresaRedSocialInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEmpresaRedSocialInput)
  redes_sociales?: CreateEmpresaRedSocialInput[];

  @Field(() => [CreateEmpresaHorarioAperturaInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEmpresaHorarioAperturaInput)
  horarios_apertura?: CreateEmpresaHorarioAperturaInput[];
} 