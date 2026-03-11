import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class LibroMayorRow {
  @Field(() => Number)
  asiento_id: number;

  @Field()
  numero: string;

  @Field()
  fecha: string;

  @Field()
  concepto: string;

  @Field(() => Float)
  debe: number;

  @Field(() => Float)
  haber: number;

  @Field(() => Float)
  saldo_acum: number;
}
