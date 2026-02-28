import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateContactoInput {
  @Field()
  @IsUUID()
  id_tercero: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  apellidos_etiqueta?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nombre?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  titulo_cortesia?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  puesto_trabajo?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  direccion?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  codigo_postal?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  poblacion?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  provincia?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  telefono_trabajo?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  telefono_particular?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  movil?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  fax?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  correo?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  visibilidad?: string;

  @Field({ nullable: true })
  @IsOptional()
  fecha_nacimiento?: Date;

  @Field({ defaultValue: false })
  @IsBoolean()
  @IsOptional()
  alerta_cumpleanos?: boolean;

  @Field({ defaultValue: true })
  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}
