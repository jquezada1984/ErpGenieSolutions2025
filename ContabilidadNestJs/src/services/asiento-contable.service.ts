import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AsientoContable } from '../entities/asiento-contable.entity';
import { MovimientoContable } from '../entities/movimiento-contable.entity';

@Injectable()
export class AsientoContableService {
  constructor(
    @InjectRepository(AsientoContable)
    private asientoContableRepository: Repository<AsientoContable>,
    @InjectRepository(MovimientoContable)
    private movimientoRepository: Repository<MovimientoContable>,
    private dataSource: DataSource,
  ) {}

  async findByEmpresa(
    id_empresa: string,
    fecha_desde?: string,
    fecha_hasta?: string,
    id_diario?: string,
  ): Promise<AsientoContable[]> {
    const params: unknown[] = [id_empresa];
    let extra = '';
    if (fecha_desde) {
      params.push(fecha_desde);
      extra += ` AND a.fecha_asiento >= $${params.length}`;
    }
    if (fecha_hasta) {
      params.push(fecha_hasta);
      extra += ` AND a.fecha_asiento <= $${params.length}`;
    }
    if (id_diario) {
      params.push(id_diario);
      extra += ` AND a.id_diario_contable = $${params.length}`;
    }

    const raw = await this.dataSource.query(
      `SELECT a.*, d.codigo AS codigo_diario, d.nombre AS nombre_diario
       FROM asiento_contable a
       LEFT JOIN diario_contable d ON d.id_diario_contable = a.id_diario_contable
       WHERE a.id_empresa = $1 ${extra}
       ORDER BY a.fecha_asiento DESC, a.numero_asiento DESC`,
      params,
    );
    return raw.map((r: Record<string, unknown>) => this.mapAsiento(r));
  }

  async findOne(id: string): Promise<AsientoContable | null> {
    const raw = await this.dataSource.query(
      `SELECT a.*, d.codigo AS codigo_diario, d.nombre AS nombre_diario
       FROM asiento_contable a
       LEFT JOIN diario_contable d ON d.id_diario_contable = a.id_diario_contable
       WHERE a.id_asiento_contable = $1`,
      [id],
    );
    return raw[0] ? this.mapAsiento(raw[0]) : null;
  }

  async findMovimientosByAsiento(asientoId: string): Promise<MovimientoContable[]> {
    const raw = await this.dataSource.query(
      `SELECT m.*, c.codigo AS codigo_cuenta, c.nombre AS nombre_cuenta
       FROM movimiento_contable m
       INNER JOIN cuenta_contable c ON c.id_cuenta_contable = m.id_cuenta_contable
       WHERE m.id_asiento_contable = $1
       ORDER BY m.orden ASC`,
      [asientoId],
    );
    return raw.map((r: Record<string, unknown>) => this.mapMovimiento(r));
  }

  private mapAsiento(r: Record<string, unknown>): AsientoContable {
    const a = new AsientoContable();
    a.id_asiento_contable = String(r.id_asiento_contable);
    a.id_empresa = String(r.id_empresa);
    a.id_diario_contable = String(r.id_diario_contable);
    a.numero_asiento = String(r.numero_asiento);
    a.fecha_asiento =
      r.fecha_asiento instanceof Date
        ? r.fecha_asiento.toISOString().slice(0, 10)
        : String(r.fecha_asiento);
    a.concepto = String(r.concepto);
    a.referencia = r.referencia != null ? String(r.referencia) : null;
    a.total_debe = Number(r.total_debe);
    a.total_haber = Number(r.total_haber);
    a.estado = String(r.estado);
    a.id_usuario_creacion = r.id_usuario_creacion != null ? String(r.id_usuario_creacion) : null;
    a.id_usuario_aprobacion = r.id_usuario_aprobacion != null ? String(r.id_usuario_aprobacion) : null;
    a.reversed_entry_id = r.reversed_entry_id != null ? String(r.reversed_entry_id) : null;
    a.fecha_exportacion = r.fecha_exportacion as Date | null;
    a.codigo_diario = r.codigo_diario != null ? String(r.codigo_diario) : null;
    a.nombre_diario = r.nombre_diario != null ? String(r.nombre_diario) : null;
    return a;
  }

  private mapMovimiento(r: Record<string, unknown>): MovimientoContable {
    const m = new MovimientoContable();
    m.id_movimiento_contable = String(r.id_movimiento_contable);
    m.id_asiento_contable = String(r.id_asiento_contable);
    m.id_cuenta_contable = String(r.id_cuenta_contable);
    m.concepto = String(r.concepto);
    m.debe = Number(r.debe);
    m.haber = Number(r.haber);
    m.orden = Number(r.orden);
    m.fecha_exportacion = r.fecha_exportacion as Date | null;
    m.codigo_cuenta = r.codigo_cuenta != null ? String(r.codigo_cuenta) : null;
    m.nombre_cuenta = r.nombre_cuenta != null ? String(r.nombre_cuenta) : null;
    return m;
  }
}
