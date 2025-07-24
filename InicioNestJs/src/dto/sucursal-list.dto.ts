import { ObjectType, Field, ID } from '@nestjs/graphql';

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
} 