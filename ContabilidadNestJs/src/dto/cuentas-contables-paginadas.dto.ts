import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CuentaContable } from '../entities/cuenta-contable.entity';

@ObjectType()
export class CuentasContablesPaginadas {
  @Field(() => [CuentaContable])
  items: CuentaContable[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}
