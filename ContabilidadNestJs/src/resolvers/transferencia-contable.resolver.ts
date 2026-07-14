import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { TransferenciaContableService } from '../services/transferencia-contable.service';
import {
  ResumenVinculacion,
  ResumenVinculacionItem,
  LineaRegistroRow,
  CuentaBancariaContabilidad,
  CuentaIvaRow,
  CuentaImpuestoRow,
  GrupoCuentaRow,
} from '../dto/transferencia-contable.dto';

@Resolver()
export class TransferenciaContableResolver {
  constructor(private readonly svc: TransferenciaContableService) {}

  @Query(() => ResumenVinculacion)
  async resumenVinculacionFacturas(
    @Args('id_empresa') id_empresa: string,
    @Args('anio', { type: () => Int }) anio: number,
    @Args('tipo') tipo: string,
  ): Promise<ResumenVinculacion> {
    const esCliente = tipo === 'CLIENTE';
    const raw = await this.svc.resumenVinculacion(id_empresa, anio, esCliente);
    return {
      no_vinculadas: (raw.no_vinculadas as Record<string, unknown>[]).map(this.mapResumen),
      vinculadas: (raw.vinculadas as Record<string, unknown>[]).map(this.mapResumen),
    };
  }

  @Query(() => [LineaRegistroRow])
  async lineasRegistroContable(
    @Args('id_empresa') id_empresa: string,
    @Args('origen') origen: string,
    @Args('fecha_desde') fecha_desde: string,
    @Args('fecha_hasta') fecha_hasta: string,
  ): Promise<LineaRegistroRow[]> {
    const rows = await this.svc.lineasRegistroContable(id_empresa, origen, fecha_desde, fecha_hasta);
    return rows.map((r) => ({
      fecha: r.fecha instanceof Date ? r.fecha.toISOString().slice(0, 10) : String(r.fecha ?? ''),
      doc_ref: String(r.doc_ref ?? ''),
      cuenta_codigo: String(r.cuenta_codigo ?? ''),
      subcuenta: r.subcuenta != null ? String(r.subcuenta) : null,
      etiqueta: String(r.etiqueta ?? ''),
      forma_pago: r.forma_pago != null ? String(r.forma_pago) : null,
      debe: Number(r.debe ?? 0),
      haber: Number(r.haber ?? 0),
    }));
  }

  @Query(() => [CuentaBancariaContabilidad])
  async cuentasBancariasContabilidad(
    @Args('id_empresa') id_empresa: string,
  ): Promise<CuentaBancariaContabilidad[]> {
    const rows = await this.svc.cuentasBancariasContabilidad(id_empresa);
    return rows.map((r) => ({
      id_cuenta_bancaria: String(r.id_cuenta_bancaria),
      numero_cuenta: r.numero_cuenta != null ? String(r.numero_cuenta) : null,
      etiqueta_cuenta: r.etiqueta_cuenta != null ? String(r.etiqueta_cuenta) : null,
      iban: r.iban != null ? String(r.iban) : null,
      id_cuenta_contable: r.id_cuenta_contable != null ? String(r.id_cuenta_contable) : null,
      id_diario_contable: r.id_diario_contable != null ? String(r.id_diario_contable) : null,
      cuenta_codigo: r.cuenta_codigo != null ? String(r.cuenta_codigo) : null,
      cuenta_nombre: r.cuenta_nombre != null ? String(r.cuenta_nombre) : null,
      diario_codigo: r.diario_codigo != null ? String(r.diario_codigo) : null,
    }));
  }

  @Query(() => [CuentaIvaRow])
  async cuentasIva(@Args('id_empresa') id_empresa: string): Promise<CuentaIvaRow[]> {
    const rows = await this.svc.cuentasIva(id_empresa);
    return rows.map((r) => ({
      id_cuenta_iva: String(r.id_cuenta_iva),
      tipo_iva: String(r.tipo_iva),
      porcentaje: Number(r.porcentaje),
      id_cuenta_contable: String(r.id_cuenta_contable),
      cuenta_codigo: r.cuenta_codigo != null ? String(r.cuenta_codigo) : null,
      cuenta_nombre: r.cuenta_nombre != null ? String(r.cuenta_nombre) : null,
    }));
  }

  @Query(() => [CuentaImpuestoRow])
  async cuentasImpuesto(@Args('id_empresa') id_empresa: string): Promise<CuentaImpuestoRow[]> {
    const rows = await this.svc.cuentasImpuesto(id_empresa);
    return rows.map((r) => ({
      id_cuenta_impuesto: String(r.id_cuenta_impuesto),
      tipo_impuesto: String(r.tipo_impuesto),
      porcentaje: Number(r.porcentaje),
      id_cuenta_contable: String(r.id_cuenta_contable),
      cuenta_codigo: r.cuenta_codigo != null ? String(r.cuenta_codigo) : null,
      cuenta_nombre: r.cuenta_nombre != null ? String(r.cuenta_nombre) : null,
    }));
  }

  @Query(() => [GrupoCuentaRow])
  async gruposCuentaPersonalizado(@Args('id_empresa') id_empresa: string): Promise<GrupoCuentaRow[]> {
    const rows = await this.svc.gruposCuentaPersonalizado(id_empresa);
    return rows.map((r) => ({
      id_grupo_cuenta_personalizado: String(r.id_grupo_cuenta_personalizado),
      nombre: String(r.nombre),
      codigo: r.codigo != null ? String(r.codigo) : null,
      etiqueta: r.etiqueta != null ? String(r.etiqueta) : null,
      posicion: r.posicion != null ? Number(r.posicion) : null,
    }));
  }

  private mapResumen(r: Record<string, unknown>): ResumenVinculacionItem {
    return {
      cuenta: String(r.cuenta),
      mes: Number(r.mes),
      num_lineas: Number(r.num_lineas),
      total: Number(r.total),
    };
  }
}
