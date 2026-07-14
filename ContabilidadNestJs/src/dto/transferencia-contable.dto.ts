import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class ResumenVinculacionItem {
  @Field()
  cuenta: string;

  @Field(() => Int)
  mes: number;

  @Field(() => Int)
  num_lineas: number;

  @Field(() => Float)
  total: number;
}

@ObjectType()
export class ResumenVinculacion {
  @Field(() => [ResumenVinculacionItem])
  no_vinculadas: ResumenVinculacionItem[];

  @Field(() => [ResumenVinculacionItem])
  vinculadas: ResumenVinculacionItem[];
}

@ObjectType()
export class LineaRegistroRow {
  @Field({ nullable: true })
  fecha: string;

  @Field({ nullable: true })
  doc_ref: string;

  @Field({ nullable: true })
  cuenta_codigo: string;

  @Field({ nullable: true })
  subcuenta: string;

  @Field({ nullable: true })
  etiqueta: string;

  @Field({ nullable: true })
  forma_pago: string;

  @Field(() => Float, { nullable: true })
  debe: number;

  @Field(() => Float, { nullable: true })
  haber: number;
}

@ObjectType()
export class CuentaBancariaContabilidad {
  @Field()
  id_cuenta_bancaria: string;

  @Field({ nullable: true })
  numero_cuenta: string;

  @Field({ nullable: true })
  etiqueta_cuenta: string;

  @Field({ nullable: true })
  iban: string;

  @Field({ nullable: true })
  id_cuenta_contable: string;

  @Field({ nullable: true })
  id_diario_contable: string;

  @Field({ nullable: true })
  cuenta_codigo: string;

  @Field({ nullable: true })
  cuenta_nombre: string;

  @Field({ nullable: true })
  diario_codigo: string;
}

@ObjectType()
export class CuentaIvaRow {
  @Field()
  id_cuenta_iva: string;

  @Field()
  tipo_iva: string;

  @Field(() => Float)
  porcentaje: number;

  @Field()
  id_cuenta_contable: string;

  @Field({ nullable: true })
  cuenta_codigo: string;

  @Field({ nullable: true })
  cuenta_nombre: string;
}

@ObjectType()
export class CuentaImpuestoRow {
  @Field()
  id_cuenta_impuesto: string;

  @Field()
  tipo_impuesto: string;

  @Field(() => Float)
  porcentaje: number;

  @Field()
  id_cuenta_contable: string;

  @Field({ nullable: true })
  cuenta_codigo: string;

  @Field({ nullable: true })
  cuenta_nombre: string;
}

@ObjectType()
export class GrupoCuentaRow {
  @Field()
  id_grupo_cuenta_personalizado: string;

  @Field()
  nombre: string;

  @Field({ nullable: true })
  codigo: string;

  @Field({ nullable: true })
  etiqueta: string;

  @Field(() => Int, { nullable: true })
  posicion: number;
}
