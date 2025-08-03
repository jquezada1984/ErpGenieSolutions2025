import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class EmpresaBasicDto {
  @Field(() => ID)
  id_empresa: string;

  @Field()
  nombre: string;

  @Field()
  ruc: string;
}

@ObjectType()
export class SucursalListDto {
  @Field(() => ID)
  id_sucursal: string;

  @Field()
  nombre: string;

  @Field({ nullable: true })
  direccion?: string;

  @Field({ nullable: true })
  telefono?: string;

  @Field()
  estado: boolean;

  @Field()
  codigo_establecimiento: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => EmpresaBasicDto, { nullable: true })
  empresa?: EmpresaBasicDto;
} 