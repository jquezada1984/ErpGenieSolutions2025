import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EstadoAreaContabilidad } from '../dto/estado-area-contabilidad.dto';
import { OperacionDiarioRow } from '../dto/operacion-diario.dto';
import { SaldoCuentaRow } from '../dto/saldo-cuenta.dto';
import { LibroMayorRow } from '../dto/libro-mayor.dto';

export interface OperacionesFiltros {
  id_diario?: string | null;
  id_cuenta?: string | null;
  incluir_exportados?: boolean;
}

export interface SaldosFiltros {
  id_diario?: string | null;
  cuenta_desde?: string | null;
  cuenta_hasta?: string | null;
  subtotal_por_nivel?: boolean;
}

@Injectable()
export class OperativaContableService {
  constructor(private readonly dataSource: DataSource) {}

  async estadoAreaContabilidad(id_empresa: string): Promise<EstadoAreaContabilidad> {
    const [[diarios], [modelos], [plan], [periodo], [defecto], [bancos], [iva], [imp], [prod]] =
      await Promise.all([
        this.dataSource.query(
          `SELECT COUNT(*)::int AS c FROM diario_contable WHERE id_empresa = $1 AND estado = true`,
          [id_empresa],
        ),
        this.dataSource.query(`SELECT COUNT(*)::int AS c FROM modelo_plan_contable WHERE estado = true`),
        this.dataSource.query(
          `SELECT p.nombre FROM plan_contable p
           WHERE p.id_empresa = $1 AND p.estado = true
           ORDER BY p.created_at DESC LIMIT 1`,
          [id_empresa],
        ),
        this.dataSource.query(
          `SELECT COUNT(*)::int AS c FROM periodo_contable
           WHERE id_empresa = $1 AND estado = 'ABIERTO'`,
          [id_empresa],
        ),
        this.dataSource.query(
          `SELECT COUNT(*)::int AS c FROM cuenta_contable_defecto
           WHERE id_empresa = $1 AND estado = true AND id_cuenta_contable IS NOT NULL`,
          [id_empresa],
        ),
        this.dataSource.query(
          `SELECT COUNT(*)::int AS total,
                  COUNT(*) FILTER (WHERE id_cuenta_contable IS NOT NULL)::int AS con_cuenta
           FROM cuenta_bancaria WHERE id_empresa = $1 AND estado = true`,
          [id_empresa],
        ),
        this.dataSource.query(
          `SELECT COUNT(*)::int AS c FROM cuenta_iva
           WHERE id_empresa = $1 AND estado = true AND id_cuenta_contable IS NOT NULL`,
          [id_empresa],
        ),
        this.dataSource.query(
          `SELECT COUNT(*)::int AS c FROM cuenta_impuesto
           WHERE id_empresa = $1 AND estado = true AND id_cuenta_contable IS NOT NULL`,
          [id_empresa],
        ),
        this.dataSource.query(
          `SELECT COUNT(*)::int AS c FROM cuenta_contable_defecto
           WHERE id_empresa = $1 AND estado = true AND tipo_operacion LIKE 'PRODUCTO%'
             AND id_cuenta_contable IS NOT NULL`,
          [id_empresa],
        ),
      ]);

    const totalBancos = Number(bancos?.total ?? 0);
    const bancosConCuenta = Number(bancos?.con_cuenta ?? 0);

    return {
      paso1_diarios: Number(diarios?.c ?? 0) > 0,
      paso2_modelos: Number(modelos?.c ?? 0) > 0,
      paso3_plan: !!plan?.nombre,
      plan_activo_nombre: plan?.nombre ?? null,
      paso4_periodo: Number(periodo?.c ?? 0) > 0,
      paso5_cuentas_defecto: Number(defecto?.c ?? 0) > 0,
      paso6_cuentas_bancarias: totalBancos === 0 || bancosConCuenta === totalBancos,
      paso7_cuentas_iva: Number(iva?.c ?? 0) > 0,
      paso8_cuentas_impuestos: Number(imp?.c ?? 0) > 0,
      paso9_cuentas_productos: Number(prod?.c ?? 0) > 0,
    };
  }

  async libroMayor(
    id_empresa: string,
    id_cuenta: string,
    fecha_desde: string,
    fecha_hasta: string,
  ): Promise<LibroMayorRow[]> {
    const raw = await this.dataSource.query(
      `SELECT
         a.id_asiento_contable AS asiento_id,
         a.numero_asiento AS numero,
         d.codigo AS codigo_diario,
         a.fecha_asiento AS fecha,
         a.referencia,
         COALESCE(m.concepto, a.concepto) AS concepto,
         m.debe,
         m.haber,
         SUM(
           CASE
             WHEN c.tipo_cuenta IN ('ACTIVO', 'GASTO', 'COSTO') THEN m.debe - m.haber
             ELSE m.haber - m.debe
           END
         ) OVER (ORDER BY a.fecha_asiento, a.numero_asiento, m.orden) AS saldo_acum
       FROM movimiento_contable m
       INNER JOIN asiento_contable a ON a.id_asiento_contable = m.id_asiento_contable
       INNER JOIN cuenta_contable c ON c.id_cuenta_contable = m.id_cuenta_contable
       LEFT JOIN diario_contable d ON d.id_diario_contable = a.id_diario_contable
       WHERE m.id_cuenta_contable = $2
         AND a.id_empresa = $1
         AND a.estado = 'APROBADO'
         AND a.fecha_asiento >= $3
         AND a.fecha_asiento <= $4
       ORDER BY a.fecha_asiento ASC, a.numero_asiento ASC, m.orden ASC`,
      [id_empresa, id_cuenta, fecha_desde, fecha_hasta],
    );
    return raw.map((r: Record<string, unknown>) => this.mapLibroMayorRow(r));
  }

  async operacionesDiarios(
    id_empresa: string,
    fecha_desde: string,
    fecha_hasta: string,
    filtros: OperacionesFiltros = {},
  ): Promise<OperacionDiarioRow[]> {
    const params: unknown[] = [id_empresa, fecha_desde, fecha_hasta];
    let extra = '';
    if (filtros.id_diario) {
      params.push(filtros.id_diario);
      extra += ` AND a.id_diario_contable = $${params.length}`;
    }
    if (filtros.id_cuenta) {
      params.push(filtros.id_cuenta);
      extra += ` AND m.id_cuenta_contable = $${params.length}`;
    }
    if (!filtros.incluir_exportados) {
      extra += ` AND m.fecha_exportacion IS NULL`;
    }

    const raw = await this.dataSource.query(
      `SELECT
         m.id_movimiento_contable,
         a.id_asiento_contable AS asiento_id,
         a.numero_asiento,
         d.codigo AS codigo_diario,
         a.fecha_asiento,
         a.referencia,
         c.codigo AS codigo_cuenta,
         NULL::text AS subcuenta,
         COALESCE(m.concepto, a.concepto) AS concepto,
         m.debe,
         m.haber,
         m.fecha_exportacion
       FROM movimiento_contable m
       INNER JOIN asiento_contable a ON a.id_asiento_contable = m.id_asiento_contable
       INNER JOIN cuenta_contable c ON c.id_cuenta_contable = m.id_cuenta_contable
       INNER JOIN diario_contable d ON d.id_diario_contable = a.id_diario_contable
       WHERE a.id_empresa = $1
         AND a.estado = 'APROBADO'
         AND a.fecha_asiento >= $2
         AND a.fecha_asiento <= $3
         ${extra}
       ORDER BY a.fecha_asiento DESC, a.numero_asiento DESC, m.orden ASC`,
      params,
    );
    return raw.map((r: Record<string, unknown>) => this.mapOperacionRow(r));
  }

  async movimientosPendientesExportar(
    id_empresa: string,
    fecha_desde: string,
    fecha_hasta: string,
    incluir_exportados = false,
  ): Promise<OperacionDiarioRow[]> {
    return this.operacionesDiarios(id_empresa, fecha_desde, fecha_hasta, {
      incluir_exportados,
    });
  }

  async saldosPorCuenta(
    id_empresa: string,
    fecha_desde: string,
    fecha_hasta: string,
    filtros: SaldosFiltros = {},
  ): Promise<SaldoCuentaRow[]> {
    const params: unknown[] = [id_empresa, fecha_desde, fecha_hasta];
    let extraJoin = '';
    let extraWhere = '';

    if (filtros.id_diario) {
      params.push(filtros.id_diario);
      extraWhere += ` AND a.id_diario_contable = $${params.length}`;
    }
    if (filtros.cuenta_desde) {
      params.push(filtros.cuenta_desde);
      extraWhere += ` AND c.codigo >= $${params.length}`;
    }
    if (filtros.cuenta_hasta) {
      params.push(filtros.cuenta_hasta);
      extraWhere += ` AND c.codigo <= $${params.length}`;
    }

    const raw = await this.dataSource.query(
      `SELECT
         c.id_cuenta_contable AS cuenta_id,
         c.codigo,
         c.nombre,
         c.nivel,
         COALESCE(SUM(m.debe), 0) AS total_debe,
         COALESCE(SUM(m.haber), 0) AS total_haber,
         COALESCE(SUM(m.debe), 0) - COALESCE(SUM(m.haber), 0) AS saldo
       FROM cuenta_contable c
       INNER JOIN plan_contable p ON p.id_plan_contable = c.id_plan_contable
       LEFT JOIN movimiento_contable m ON m.id_cuenta_contable = c.id_cuenta_contable
       LEFT JOIN asiento_contable a ON a.id_asiento_contable = m.id_asiento_contable
         AND a.id_empresa = $1
         AND a.estado = 'APROBADO'
         AND a.fecha_asiento >= $2
         AND a.fecha_asiento <= $3
         ${extraWhere}
       ${extraJoin}
       WHERE p.id_empresa = $1 AND p.estado = true AND c.estado = true
       GROUP BY c.id_cuenta_contable, c.codigo, c.nombre, c.nivel
       HAVING COALESCE(SUM(m.debe), 0) <> 0 OR COALESCE(SUM(m.haber), 0) <> 0
       ORDER BY c.codigo ASC`,
      params,
    );

    const rows = raw.map((r: Record<string, unknown>) => ({
      cuenta_id: String(r.cuenta_id),
      codigo: String(r.codigo),
      nombre: String(r.nombre),
      nivel: Number(r.nivel),
      total_debe: Number(r.total_debe),
      total_haber: Number(r.total_haber),
      saldo: Number(r.saldo),
    }));

    if (!filtros.subtotal_por_nivel) return rows;

    const result: SaldoCuentaRow[] = [];
    const byLevel = new Map<number, SaldoCuentaRow[]>();
    for (const row of rows) {
      if (!byLevel.has(row.nivel)) byLevel.set(row.nivel, []);
      byLevel.get(row.nivel)!.push(row);
      result.push(row);
    }
    for (const [nivel, group] of [...byLevel.entries()].sort((a, b) => a[0] - b[0])) {
      const sub: SaldoCuentaRow = {
        cuenta_id: `subtotal-${nivel}`,
        codigo: '',
        nombre: `Subtotal nivel ${nivel}`,
        nivel,
        total_debe: group.reduce((s, r) => s + r.total_debe, 0),
        total_haber: group.reduce((s, r) => s + r.total_haber, 0),
        saldo: group.reduce((s, r) => s + r.saldo, 0),
      };
      result.push(sub);
    }
    return result;
  }

  private mapLibroMayorRow(r: Record<string, unknown>): LibroMayorRow {
    return {
      asiento_id: String(r.asiento_id),
      numero: String(r.numero),
      codigo_diario: r.codigo_diario != null ? String(r.codigo_diario) : null,
      fecha: r.fecha instanceof Date ? r.fecha.toISOString().slice(0, 10) : String(r.fecha),
      referencia: r.referencia != null ? String(r.referencia) : null,
      concepto: String(r.concepto ?? ''),
      debe: Number(r.debe),
      haber: Number(r.haber),
      saldo_acum: Number(r.saldo_acum),
    };
  }

  private mapOperacionRow(r: Record<string, unknown>): OperacionDiarioRow {
    return {
      id_movimiento_contable: String(r.id_movimiento_contable),
      asiento_id: String(r.asiento_id),
      numero_asiento: String(r.numero_asiento),
      codigo_diario: String(r.codigo_diario),
      fecha_asiento:
        r.fecha_asiento instanceof Date
          ? r.fecha_asiento.toISOString().slice(0, 10)
          : String(r.fecha_asiento),
      referencia: r.referencia != null ? String(r.referencia) : null,
      codigo_cuenta: String(r.codigo_cuenta),
      subcuenta: r.subcuenta != null ? String(r.subcuenta) : null,
      concepto: String(r.concepto ?? ''),
      debe: Number(r.debe),
      haber: Number(r.haber),
      fecha_exportacion:
        r.fecha_exportacion instanceof Date
          ? r.fecha_exportacion.toISOString()
          : r.fecha_exportacion != null
            ? String(r.fecha_exportacion)
            : null,
    };
  }
}
