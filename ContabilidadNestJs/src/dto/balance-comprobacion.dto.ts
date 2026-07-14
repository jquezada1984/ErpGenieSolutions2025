import { ObjectType, Field, Float, ID } from '@nestjs/graphql';

@ObjectType()
export class BalanceComprobacionRow {
  @Field(() => ID)
  cuenta_id: string;

  @Field()
  codigo: string;

  @Field()
  nombre: string;

  @Field()
  tipo: string;

  @Field()
  naturaleza: string;

  @Field(() => Float)
  total_debe: number;

  @Field(() => Float)
  total_haber: number;

  @Field(() => Float)
  saldo: number;
}
