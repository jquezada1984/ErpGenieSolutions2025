import { ObjectType, Field, Float, ID } from '@nestjs/graphql';

@ObjectType()
export class OperacionDiarioRow {
  @Field(() => ID)
  id_movimiento_contable: string;

  @Field(() => ID)
  asiento_id: string;

  @Field()
  numero_asiento: string;

  @Field()
  codigo_diario: string;

  @Field()
  fecha_asiento: string;

  @Field({ nullable: true })
  referencia: string | null;

  @Field()
  codigo_cuenta: string;

  @Field({ nullable: true })
  subcuenta: string | null;

  @Field()
  concepto: string;

  @Field(() => Float)
  debe: number;

  @Field(() => Float)
  haber: number;

  @Field({ nullable: true })
  fecha_exportacion: string | null;
}
