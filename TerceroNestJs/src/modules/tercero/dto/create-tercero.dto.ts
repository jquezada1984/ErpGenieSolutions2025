import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';

@InputType()
export class CreateTerceroInput {
  @Field() @IsUUID() id_empresa: string;
  @Field() @IsString() @Length(1, 150) nombre: string;

  // Tipos
  @Field({ defaultValue: false }) @IsBoolean() @IsOptional() cliente_potencial?: boolean;
  @Field({ defaultValue: false }) @IsBoolean() @IsOptional() cliente?: boolean;
  @Field({ defaultValue: false }) @IsBoolean() @IsOptional() proveedor?: boolean;

  // General
  @Field({ defaultValue: true }) @IsBoolean() @IsOptional() estado?: boolean;
  @Field({ nullable: true }) @IsString() @IsOptional() apodo?: string;
  @Field({ nullable: true }) @IsString() @IsOptional() codigo_cliente?: string;
  @Field({ nullable: true }) @IsString() @IsOptional() codigo_proveedor?: string;

  // Contacto
  @Field({ nullable: true }) @IsString() @IsOptional() direccion?: string;
  @Field({ nullable: true }) @IsString() @IsOptional() poblacion?: string;
  @Field({ nullable: true }) @IsString() @IsOptional() codigo_postal?: string;
  @Field({ nullable: true }) @IsUUID() @IsOptional() id_pais?: string;
  @Field({ nullable: true }) @IsString() @IsOptional() provincia?: string;
  @Field({ nullable: true }) @IsString() @IsOptional() telefono?: string;
  @Field({ nullable: true }) @IsString() @IsOptional() movil?: string;
  @Field({ nullable: true }) @IsString() @IsOptional() fax?: string;
  @Field({ nullable: true }) @IsEmail() @IsOptional() correo?: string;
  @Field({ nullable: true }) @IsString() @IsOptional() web?: string;

  // IDs
  @Field({ nullable: true }) @IsString() @IsOptional() id_profesional_1?: string;
  @Field({ nullable: true }) @IsString() @IsOptional() id_profesional_2?: string;
  @Field({ nullable: true }) @IsString() @IsOptional() cif_intra?: string;

  // Comercial
  @Field({ defaultValue: true }) @IsBoolean() @IsOptional() sujeto_iva?: boolean;
  @Field({ nullable: true }) @IsString() @IsOptional() capital?: string;
  @Field({ nullable: true }) @IsUUID() @IsOptional() id_condicion_pago?: string;
  @Field({ nullable: true }) @IsUUID() @IsOptional() id_forma_pago?: string;

  // Clasificaciones
  @Field({ nullable: true }) @IsString() @IsOptional() categoria_cliente?: string;
  @Field({ nullable: true }) @IsString() @IsOptional() categoria_proveedor?: string;

  // Organización
  @Field({ nullable: true }) @IsUUID() @IsOptional() sede_central?: string;
  @Field({ nullable: true }) @IsUUID() @IsOptional() asignado_a?: string;

  // Catálogo tipo de tercero
  @Field({ nullable: true }) @IsUUID() @IsOptional() id_tipo_tercero?: string;

  // Auditoría
  @Field({ nullable: true }) @IsUUID() @IsOptional() creado_por?: string;
}
