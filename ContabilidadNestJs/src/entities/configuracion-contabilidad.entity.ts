import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, GraphQLISODateTime, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('configuracion_contabilidad')
export class ConfiguracionContabilidad {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id_configuracion_contabilidad: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_moneda_base: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  formato_cuenta: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 5, nullable: true })
  separador_cuenta: string | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'integer', nullable: true })
  longitud_nivel: number | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  usar_centavos: boolean | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  metodo_contable: string | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  desactivar_transacciones_directas: boolean | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  lista_combinada_subsidiaria: boolean | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  gestion_cero_final: boolean | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'integer', nullable: true })
  longitud_cuentas_generales: number | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'integer', nullable: true })
  longitud_subcuentas_terceros: number | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  periodo_por_defecto: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  fecha_excluir_antes: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 40, nullable: true })
  etiqueta_operacion_defecto: string | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  deshabilitar_transferencia_ventas: boolean | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  deshabilitar_transferencia_compras: boolean | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  deshabilitar_informes_gastos: boolean | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  deshabilitar_activos_fijos: boolean | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  deshabilitar_descuentos: boolean | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  usar_fecha_fin_periodo_informe_gastos: boolean | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  solo_lineas_conciliadas_extracto: boolean | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  numeracion_modelo: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  mascara_helium: string | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  coincidencia_contable: boolean | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  iva_revertido_compras: boolean | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  tab_libro_auxiliar_terceros: boolean | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  prefijo_exportacion: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 40, nullable: true })
  formato_exportacion: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 10, nullable: true })
  formato_archivo: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 5, nullable: true })
  separador_columnas: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 10, nullable: true })
  tipo_retorno_carro: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  formato_fecha_exportacion: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_cuenta_resultado_ganancia: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_cuenta_resultado_perdida: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_diario_cierre: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  grupos_cuenta_balance: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  grupos_cuenta_resultado: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;
}
