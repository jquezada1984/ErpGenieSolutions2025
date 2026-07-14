import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TransferenciaContableService {
  constructor(private readonly dataSource: DataSource) {}

  async resumenVinculacion(id_empresa: string, anio: number, esCliente: boolean): Promise<Record<string, unknown>> {
    const filtro = esCliente ? 't.cliente = true' : 't.proveedor = true';
    const noVinc = await this.dataSource.query(
      `SELECT COALESCE(c.codigo, 'SIN CUENTA') AS cuenta,
              EXTRACT(MONTH FROM f.fecha_factura)::int AS mes,
              COUNT(*)::int AS num_lineas,
              COALESCE(SUM(fl.subtotal), 0) AS total
       FROM factura_linea fl
       INNER JOIN factura f ON f.id_factura = fl.id_factura
       INNER JOIN tercero t ON t.id_tercero = f.id_tercero
       LEFT JOIN cuenta_contable c ON c.id_cuenta_contable = fl.id_cuenta_contable
       WHERE f.id_empresa = $1 AND ${filtro}
         AND EXTRACT(YEAR FROM f.fecha_factura) = $2
         AND (fl.vinculado = false OR fl.vinculado IS NULL)
       GROUP BY cuenta, mes ORDER BY cuenta, mes`,
      [id_empresa, anio],
    );
    const vinc = await this.dataSource.query(
      `SELECT COALESCE(c.codigo, 'SIN CUENTA') AS cuenta,
              EXTRACT(MONTH FROM f.fecha_factura)::int AS mes,
              COUNT(*)::int AS num_lineas,
              COALESCE(SUM(fl.subtotal), 0) AS total
       FROM factura_linea fl
       INNER JOIN factura f ON f.id_factura = fl.id_factura
       INNER JOIN tercero t ON t.id_tercero = f.id_tercero
       LEFT JOIN cuenta_contable c ON c.id_cuenta_contable = fl.id_cuenta_contable
       WHERE f.id_empresa = $1 AND ${filtro}
         AND EXTRACT(YEAR FROM f.fecha_factura) = $2 AND fl.vinculado = true
       GROUP BY cuenta, mes ORDER BY cuenta, mes`,
      [id_empresa, anio],
    );
    return { no_vinculadas: noVinc, vinculadas: vinc };
  }

  async lineasRegistroContable(
    id_empresa: string,
    origen: string,
    desde: string,
    hasta: string,
  ): Promise<Record<string, unknown>[]> {
    if (origen === 'banco') {
      return this.dataSource.query(
        `SELECT mb.fecha_movimiento AS fecha, mb.numero_documento AS doc_ref,
                c.codigo AS cuenta_codigo, mb.concepto AS etiqueta,
                mb.tipo_movimiento AS forma_pago,
                CASE WHEN mb.tipo_movimiento IN ('INGRESO','ABONO') THEN mb.monto ELSE 0 END AS debe,
                CASE WHEN mb.tipo_movimiento IN ('EGRESO','CARGO') THEN mb.monto ELSE 0 END AS haber
         FROM movimiento_bancario mb
         INNER JOIN cuenta_bancaria cb ON cb.id_cuenta_bancaria = mb.id_cuenta_bancaria
         LEFT JOIN cuenta_contable c ON c.id_cuenta_contable = cb.id_cuenta_contable
         WHERE mb.id_empresa = $1 AND mb.id_asiento_contable IS NULL
           AND mb.fecha_movimiento >= $2 AND mb.fecha_movimiento <= $3
         ORDER BY mb.fecha_movimiento`,
        [id_empresa, desde, hasta],
      );
    }
    const esCliente = origen === 'ventas';
    const filtro = esCliente ? 't.cliente = true' : 't.proveedor = true';
    return this.dataSource.query(
      `SELECT f.fecha_factura AS fecha, f.numero_factura AS doc_ref,
              c.codigo AS cuenta_codigo, fl.descripcion AS etiqueta,
              CASE WHEN $4 THEN fl.subtotal ELSE 0 END AS debe,
              CASE WHEN $4 THEN 0 ELSE fl.subtotal END AS haber
       FROM factura_linea fl
       INNER JOIN factura f ON f.id_factura = fl.id_factura
       INNER JOIN tercero t ON t.id_tercero = f.id_tercero
       INNER JOIN cuenta_contable c ON c.id_cuenta_contable = fl.id_cuenta_contable
       WHERE f.id_empresa = $1 AND fl.vinculado = true AND fl.transferido = false
         AND f.fecha_factura >= $2 AND f.fecha_factura <= $3 AND ${filtro}
       ORDER BY f.fecha_factura`,
      [id_empresa, desde, hasta, esCliente],
    );
  }

  async cuentasBancariasContabilidad(id_empresa: string): Promise<Record<string, unknown>[]> {
    return this.dataSource.query(
      `SELECT cb.id_cuenta_bancaria, cb.numero_cuenta, cb.etiqueta_cuenta, cb.iban,
              cb.id_cuenta_contable, cb.id_diario_contable, cb.estado,
              c.codigo AS cuenta_codigo, c.nombre AS cuenta_nombre,
              d.codigo AS diario_codigo
       FROM cuenta_bancaria cb
       LEFT JOIN cuenta_contable c ON c.id_cuenta_contable = cb.id_cuenta_contable
       LEFT JOIN diario_contable d ON d.id_diario_contable = cb.id_diario_contable
       WHERE cb.id_empresa = $1 AND cb.estado = true
       ORDER BY cb.etiqueta_cuenta`,
      [id_empresa],
    );
  }

  async cuentasIva(id_empresa: string): Promise<Record<string, unknown>[]> {
    return this.dataSource.query(
      `SELECT ci.*, c.codigo AS cuenta_codigo, c.nombre AS cuenta_nombre
       FROM cuenta_iva ci
       LEFT JOIN cuenta_contable c ON c.id_cuenta_contable = ci.id_cuenta_contable
       WHERE ci.id_empresa = $1 AND ci.estado = true ORDER BY ci.tipo_iva`,
      [id_empresa],
    );
  }

  async cuentasImpuesto(id_empresa: string): Promise<Record<string, unknown>[]> {
    return this.dataSource.query(
      `SELECT ci.*, c.codigo AS cuenta_codigo, c.nombre AS cuenta_nombre
       FROM cuenta_impuesto ci
       LEFT JOIN cuenta_contable c ON c.id_cuenta_contable = ci.id_cuenta_contable
       WHERE ci.id_empresa = $1 AND ci.estado = true ORDER BY ci.tipo_impuesto`,
      [id_empresa],
    );
  }

  async gruposCuentaPersonalizado(id_empresa: string): Promise<Record<string, unknown>[]> {
    return this.dataSource.query(
      `SELECT g.*,
              COALESCE(
                (SELECT json_agg(cgp.id_cuenta_contable)
                 FROM cuenta_grupo_personalizado cgp
                 WHERE cgp.id_grupo_cuenta_personalizado = g.id_grupo_cuenta_personalizado),
                '[]'::json
              ) AS ids_cuentas_contables
       FROM grupo_cuenta_personalizado g
       WHERE g.id_empresa = $1 AND g.estado = true
       ORDER BY g.posicion, g.nombre`,
      [id_empresa],
    );
  }
}
