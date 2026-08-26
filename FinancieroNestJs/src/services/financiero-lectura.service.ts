import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CondicionPagoCatalogo } from '../entities/condicion-pago-catalogo.entity';
import { FormaPagoCatalogo } from '../entities/forma-pago-catalogo.entity';
import { Moneda } from '../entities/moneda.entity';
import { Factura } from '../entities/factura.entity';
import { FacturaLinea } from '../entities/factura-linea.entity';
import { FacturasClientePaginadas } from '../dto/facturas-cliente-paginadas.dto';
import { Pago } from '../entities/pago.entity';
import { PagoFactura } from '../entities/pago-factura.entity';
import { PagosPaginados } from '../dto/pagos-paginados.dto';

const SQL_PENDIENTE = `COALESCE(f.total_factura, 0) - COALESCE((
  SELECT SUM(pf.monto_aplicado) FROM pago_factura pf
  INNER JOIN pago p ON p.id_pago = pf.id_pago
  WHERE pf.id_factura = f.id_factura AND p.estado = 'VALIDADA'
), 0)`;

@Injectable()
export class FinancieroLecturaService {
  constructor(
    @InjectRepository(CondicionPagoCatalogo)
    private readonly condicionRepo: Repository<CondicionPagoCatalogo>,
    @InjectRepository(FormaPagoCatalogo)
    private readonly formaRepo: Repository<FormaPagoCatalogo>,
    @InjectRepository(Moneda)
    private readonly monedaRepo: Repository<Moneda>,
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,
    @InjectRepository(FacturaLinea)
    private readonly lineaRepo: Repository<FacturaLinea>,
    @InjectRepository(Pago)
    private readonly pagoRepo: Repository<Pago>,
    @InjectRepository(PagoFactura)
    private readonly pagoFacturaRepo: Repository<PagoFactura>,
    private readonly dataSource: DataSource,
  ) {}

  listarCondicionesPago(soloActivos = true, id_empresa?: string): Promise<CondicionPagoCatalogo[]> {
    const where: Record<string, unknown> = {};
    if (soloActivos) where.activo = true;
    if (id_empresa) where.id_empresa = id_empresa;
    return this.condicionRepo.find({
      where,
      order: { orden: 'ASC', codigo: 'ASC' },
    });
  }

  listarFormasPago(soloActivos = true, tipoUso?: string, id_empresa?: string): Promise<FormaPagoCatalogo[]> {
    const qb = this.formaRepo
      .createQueryBuilder('f')
      .orderBy('f.orden', 'ASC')
      .addOrderBy('f.codigo', 'ASC');
    if (soloActivos) {
      qb.andWhere('f.activo = :activo', { activo: true });
    }
    if (tipoUso) {
      qb.andWhere('f.tipo_uso = :tipoUso', { tipoUso });
    }
    if (id_empresa) {
      qb.andWhere('f.id_empresa = :id_empresa', { id_empresa });
    }
    return qb.getMany();
  }

  listarMonedas(soloActivos = true): Promise<Moneda[]> {
    return this.monedaRepo.find({
      where: soloActivos ? { activo: true } : {},
      order: { codigo: 'ASC' },
    });
  }

  async obtenerFacturaCliente(
    id_factura: string,
    id_empresa: string,
  ): Promise<Factura | null> {
    return this.obtenerFactura(id_factura, id_empresa, true);
  }

  async obtenerFacturaProveedor(
    id_factura: string,
    id_empresa: string,
  ): Promise<Factura | null> {
    return this.obtenerFactura(id_factura, id_empresa, false);
  }

  private async obtenerFactura(
    id_factura: string,
    id_empresa: string,
    esCliente: boolean,
  ): Promise<Factura | null> {
    const rol = esCliente ? 't.cliente = true' : 't.proveedor = true';
    const raw = await this.dataSource.query(
      `SELECT f.*, t.nombre AS tercero_nombre, ${SQL_PENDIENTE} AS monto_pendiente
       FROM factura f
       INNER JOIN tercero t ON t.id_tercero = f.id_tercero
       WHERE f.id_factura = $1 AND f.id_empresa = $2 AND ${rol}
       LIMIT 1`,
      [id_factura, id_empresa],
    );
    if (!raw[0]) return null;
    const factura = this.mapFactura(raw[0]);
    factura.lineas = await this.lineaRepo.find({
      where: { id_factura },
      order: { orden: 'ASC' },
    });
    return factura;
  }

  async listarFacturasCliente(
    id_empresa: string,
    page = 1,
    limit = 50,
    estado?: string,
    busqueda?: string,
    soloPendientes = false,
    idTercero?: string,
  ): Promise<FacturasClientePaginadas> {
    return this.listarFacturas(
      id_empresa,
      true,
      page,
      limit,
      estado,
      busqueda,
      soloPendientes,
      idTercero,
    );
  }

  async listarFacturasProveedor(
    id_empresa: string,
    page = 1,
    limit = 50,
    estado?: string,
    busqueda?: string,
    soloPendientes = false,
    idTercero?: string,
  ): Promise<FacturasClientePaginadas> {
    return this.listarFacturas(
      id_empresa,
      false,
      page,
      limit,
      estado,
      busqueda,
      soloPendientes,
      idTercero,
    );
  }

  private async listarFacturas(
    id_empresa: string,
    esCliente: boolean,
    page = 1,
    limit = 50,
    estado?: string,
    busqueda?: string,
    soloPendientes = false,
    idTercero?: string,
  ): Promise<FacturasClientePaginadas> {
    const offset = (Math.max(1, page) - 1) * limit;
    const params: unknown[] = [id_empresa];
    let where = esCliente
      ? `f.id_empresa = $1 AND t.cliente = true`
      : `f.id_empresa = $1 AND t.proveedor = true`;
    if (estado) {
      params.push(estado);
      where += ` AND f.estado = $${params.length}`;
    }
    if (busqueda?.trim()) {
      params.push(`%${busqueda.trim()}%`);
      where += ` AND (f.numero_factura ILIKE $${params.length} OR t.nombre ILIKE $${params.length})`;
    }
    if (idTercero) {
      params.push(idTercero);
      where += ` AND f.id_tercero = $${params.length}`;
    }
    if (soloPendientes) {
      where += ` AND (${SQL_PENDIENTE}) > 0 AND f.estado = 'VALIDADA'`;
    }

    const countRows = await this.dataSource.query(
      `SELECT COUNT(*)::int AS total
       FROM factura f
       INNER JOIN tercero t ON t.id_tercero = f.id_tercero
       WHERE ${where}`,
      params,
    );
    const total = countRows[0]?.total ?? 0;

    params.push(limit, offset);
    const rows = await this.dataSource.query(
      `SELECT f.*, t.nombre AS tercero_nombre, ${SQL_PENDIENTE} AS monto_pendiente
       FROM factura f
       INNER JOIN tercero t ON t.id_tercero = f.id_tercero
       WHERE ${where}
       ORDER BY f.fecha_factura DESC, f.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    return {
      items: rows.map((r: Record<string, unknown>) => this.mapFactura(r)),
      total,
      page,
      limit,
    };
  }

  async listarPagos(
    id_empresa: string,
    tipoPago: string,
    page = 1,
    limit = 50,
    estado?: string,
    busqueda?: string,
  ): Promise<PagosPaginados> {
    const offset = (Math.max(1, page) - 1) * limit;
    const params: unknown[] = [id_empresa, tipoPago];
    let where = `p.id_empresa = $1 AND p.tipo_pago = $2`;
    if (estado) {
      params.push(estado);
      where += ` AND p.estado = $${params.length}`;
    }
    if (busqueda?.trim()) {
      params.push(`%${busqueda.trim()}%`);
      where += ` AND (p.numero_pago ILIKE $${params.length} OR t.nombre ILIKE $${params.length})`;
    }
    const countRows = await this.dataSource.query(
      `SELECT COUNT(*)::int AS total
       FROM pago p INNER JOIN tercero t ON t.id_tercero = p.id_tercero
       WHERE ${where}`,
      params,
    );
    const total = countRows[0]?.total ?? 0;
    params.push(limit, offset);
    const rows = await this.dataSource.query(
      `SELECT p.*, t.nombre AS tercero_nombre
       FROM pago p INNER JOIN tercero t ON t.id_tercero = p.id_tercero
       WHERE ${where}
       ORDER BY p.fecha_pago DESC, p.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );
    return {
      items: rows.map((r: Record<string, unknown>) => this.mapPago(r)),
      total,
      page,
      limit,
    };
  }

  async obtenerPago(
    id_pago: string,
    id_empresa: string,
    tipoPago?: string,
  ): Promise<Pago | null> {
    const params: unknown[] = [id_pago, id_empresa];
    let tipoSql = '';
    if (tipoPago) {
      params.push(tipoPago);
      tipoSql = ` AND p.tipo_pago = $3`;
    }
    const raw = await this.dataSource.query(
      `SELECT p.*, t.nombre AS tercero_nombre
       FROM pago p INNER JOIN tercero t ON t.id_tercero = p.id_tercero
       WHERE p.id_pago = $1 AND p.id_empresa = $2${tipoSql} LIMIT 1`,
      params,
    );
    if (!raw[0]) return null;
    const pago = this.mapPago(raw[0]);
    const apps = await this.dataSource.query(
      `SELECT pf.*, f.numero_factura
       FROM pago_factura pf
       INNER JOIN factura f ON f.id_factura = pf.id_factura
       WHERE pf.id_pago = $1`,
      [id_pago],
    );
    pago.aplicaciones = apps.map((a: Record<string, unknown>) => {
      const row = new PagoFactura();
      row.id_pago_factura = String(a.id_pago_factura);
      row.id_pago = String(a.id_pago);
      row.id_factura = String(a.id_factura);
      row.monto_aplicado = String(a.monto_aplicado);
      row.numero_factura = a.numero_factura != null ? String(a.numero_factura) : null;
      return row;
    });
    return pago;
  }

  private mapPago(r: Record<string, unknown>): Pago {
    const p = new Pago();
    p.id_pago = String(r.id_pago);
    p.id_empresa = String(r.id_empresa);
    p.numero_pago = String(r.numero_pago);
    p.tipo_pago = String(r.tipo_pago);
    p.id_tercero = String(r.id_tercero);
    p.id_cuenta_bancaria = r.id_cuenta_bancaria != null ? String(r.id_cuenta_bancaria) : null;
    p.fecha_pago =
      r.fecha_pago instanceof Date
        ? r.fecha_pago.toISOString().slice(0, 10)
        : String(r.fecha_pago);
    p.monto = String(r.monto);
    p.id_moneda = String(r.id_moneda);
    p.tipo_cambio = r.tipo_cambio != null ? String(r.tipo_cambio) : null;
    p.concepto = r.concepto != null ? String(r.concepto) : null;
    p.estado = r.estado != null ? String(r.estado) : null;
    p.id_asiento_contable = r.id_asiento_contable != null ? String(r.id_asiento_contable) : null;
    p.tercero_nombre = r.tercero_nombre != null ? String(r.tercero_nombre) : null;
    return p;
  }

  private mapFactura(r: Record<string, unknown>): Factura {
    const f = new Factura();
    f.id_factura = String(r.id_factura);
    f.id_empresa = String(r.id_empresa);
    f.numero_factura = r.numero_factura != null ? String(r.numero_factura) : null;
    f.tipo_factura = String(r.tipo_factura);
    f.id_tercero = String(r.id_tercero);
    f.fecha_factura =
      r.fecha_factura instanceof Date
        ? r.fecha_factura.toISOString().slice(0, 10)
        : String(r.fecha_factura);
    f.fecha_vencimiento =
      r.fecha_vencimiento == null
        ? null
        : r.fecha_vencimiento instanceof Date
          ? r.fecha_vencimiento.toISOString().slice(0, 10)
          : String(r.fecha_vencimiento);
    f.subtotal = r.subtotal != null ? String(r.subtotal) : null;
    f.total_impuestos = r.total_impuestos != null ? String(r.total_impuestos) : null;
    f.total_descuentos = r.total_descuentos != null ? String(r.total_descuentos) : null;
    f.total_factura = r.total_factura != null ? String(r.total_factura) : null;
    f.estado = r.estado != null ? String(r.estado) : null;
    f.id_asiento_contable = r.id_asiento_contable != null ? String(r.id_asiento_contable) : null;
    f.id_condicion_pago = r.id_condicion_pago != null ? String(r.id_condicion_pago) : null;
    f.id_forma_pago = r.id_forma_pago != null ? String(r.id_forma_pago) : null;
    f.id_cuenta_bancaria = r.id_cuenta_bancaria != null ? String(r.id_cuenta_bancaria) : null;
    f.origen = r.origen != null ? String(r.origen) : null;
    f.id_proyecto = r.id_proyecto != null ? String(r.id_proyecto) : null;
    f.categorias = Array.isArray(r.categorias) ? (r.categorias as string[]) : [];
    f.plantilla_documento = r.plantilla_documento != null ? String(r.plantilla_documento) : 'crabe';
    f.id_moneda = r.id_moneda != null ? String(r.id_moneda) : null;
    f.nota_publica = r.nota_publica != null ? String(r.nota_publica) : null;
    f.nota_privada = r.nota_privada != null ? String(r.nota_privada) : null;
    f.tercero_nombre = r.tercero_nombre != null ? String(r.tercero_nombre) : null;
    f.monto_pendiente = r.monto_pendiente != null ? String(r.monto_pendiente) : null;
    return f;
  }
}
