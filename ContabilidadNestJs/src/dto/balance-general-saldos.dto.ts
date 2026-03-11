import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class BalanceGeneralSaldosRow {
  @Field()
  tipo_cuenta: string;

  @Field(() => Float)
  saldo: number;
}
