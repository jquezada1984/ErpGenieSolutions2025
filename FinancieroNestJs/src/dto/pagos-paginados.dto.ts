import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Pago } from '../entities/pago.entity';

@ObjectType()
export class PagosPaginados {
  @Field(() => [Pago])
  items: Pago[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}
