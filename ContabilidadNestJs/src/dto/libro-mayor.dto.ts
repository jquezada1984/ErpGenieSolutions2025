import { ObjectType, Field, Float, ID } from '@nestjs/graphql';

@ObjectType()
export class LibroMayorRow {
  @Field(() => ID)
  asiento_id: string;

  @Field()
  numero: string;

  @Field({ nullable: true })
  codigo_diario: string | null;

  @Field()
  fecha: string;

  @Field({ nullable: true })
  referencia: string | null;

  @Field()
  concepto: string;

  @Field(() => Float)
  debe: number;

  @Field(() => Float)
  haber: number;

  @Field(() => Float)
  saldo_acum: number;
}
