import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class CuentaIndividualLibroAuxiliar {
  @Field(() => String)
  codigo: string;

  @Field(() => String)
  etiqueta: string;

  @Field(() => String)
  tipo: string;

  @Field(() => ID, { nullable: true })
  id_origen: string | null;
}

@ObjectType()
export class CuentasIndividualesPaginadas {
  @Field(() => [CuentaIndividualLibroAuxiliar])
  items: CuentaIndividualLibroAuxiliar[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}
