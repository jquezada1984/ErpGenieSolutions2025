import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class EstadoAreaContabilidad {
  @Field()
  paso1_diarios: boolean;

  @Field()
  paso2_modelos: boolean;

  @Field()
  paso3_plan: boolean;

  @Field({ nullable: true })
  plan_activo_nombre: string | null;

  @Field()
  paso4_periodo: boolean;

  @Field()
  paso5_cuentas_defecto: boolean;

  @Field()
  paso6_cuentas_bancarias: boolean;

  @Field()
  paso7_cuentas_iva: boolean;

  @Field()
  paso8_cuentas_impuestos: boolean;

  @Field()
  paso9_cuentas_productos: boolean;
}
