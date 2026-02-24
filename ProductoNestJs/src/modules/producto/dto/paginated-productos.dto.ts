import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ProductoListDTO } from './producto-list.dto';

@ObjectType()
export class PaginatedProductosDTO {
  @Field(() => [ProductoListDTO])
  items: ProductoListDTO[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}
