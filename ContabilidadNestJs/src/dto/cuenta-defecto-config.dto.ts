import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CuentaDefectoConfigItem {
  @Field(() => String)
  tipo_operacion: string;

  @Field(() => String)
  seccion: string;

  @Field(() => String)
  label: string;

  @Field(() => ID, { nullable: true })
  id_cuenta_contable_defecto: string | null;

  @Field(() => ID, { nullable: true })
  id_cuenta_contable: string | null;

  @Field(() => String, { nullable: true })
  cuenta_codigo: string | null;

  @Field(() => String, { nullable: true })
  cuenta_nombre: string | null;
}
