import { ObjectType, Field, Float, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class SaldoCuentaRow {
  @Field(() => ID)
  cuenta_id: string;

  @Field()
  codigo: string;

  @Field()
  nombre: string;

  @Field(() => Int)
  nivel: number;

  @Field(() => Float)
  total_debe: number;

  @Field(() => Float)
  total_haber: number;

  @Field(() => Float)
  saldo: number;
}
