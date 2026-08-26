import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Factura } from '../entities/factura.entity';

@ObjectType()
export class FacturasClientePaginadas {
  @Field(() => [Factura])
  items: Factura[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}
