import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CuentasIndividualesPaginadas } from '../dto/cuenta-individual.dto';

@Injectable()
export class CuentaIndividualService {
  constructor(private readonly dataSource: DataSource) {}

  async listar(
    id_empresa: string,
    tipo?: string,
    busqueda?: string,
    page = 1,
    limit = 20,
  ): Promise<CuentasIndividualesPaginadas> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(2000, Math.max(1, limit));
    const offset = (safePage - 1) * safeLimit;

    const parts: string[] = [];
    const params: unknown[] = [id_empresa];
    let p = 2;

    if (!tipo || tipo === 'CLIENTE') {
      parts.push(`
        SELECT t.codigo_cliente AS codigo,
               t.nombre AS etiqueta,
               'CLIENTE' AS tipo,
               t.id_tercero::text AS id_origen
        FROM tercero t
        WHERE t.id_empresa = $1
          AND t.cliente = true
          AND t.codigo_cliente IS NOT NULL
          AND TRIM(t.codigo_cliente) <> ''
      `);
    }
    if (!tipo || tipo === 'PROVEEDOR') {
      parts.push(`
        SELECT t.codigo_proveedor AS codigo,
               t.nombre AS etiqueta,
               'PROVEEDOR' AS tipo,
               t.id_tercero::text AS id_origen
        FROM tercero t
        WHERE t.id_empresa = $1
          AND t.proveedor = true
          AND t.codigo_proveedor IS NOT NULL
          AND TRIM(t.codigo_proveedor) <> ''
      `);
    }
    if (!tipo || tipo === 'EMPLEADO') {
      parts.push(`
        SELECT u.codigo_contable AS codigo,
               COALESCE(NULLIF(TRIM(u.nombre_completo), ''), CONCAT(u.nombre, ' ', u.apellidos)) AS etiqueta,
               'EMPLEADO' AS tipo,
               u.id_usuario::text AS id_origen
        FROM usuario u
        WHERE u.id_empresa = $1
          AND u.es_empleado = true
          AND u.codigo_contable IS NOT NULL
          AND TRIM(u.codigo_contable) <> ''
      `);
    }

    if (!parts.length) {
      return { items: [], total: 0, page: safePage, limit: safeLimit, totalPages: 1 };
    }

    let unionSql = parts.join(' UNION ALL ');
    if (busqueda?.trim()) {
      unionSql = `SELECT * FROM (${unionSql}) sub WHERE (
        LOWER(sub.codigo) LIKE $${p} OR LOWER(sub.etiqueta) LIKE $${p}
      )`;
      params.push(`%${busqueda.trim().toLowerCase()}%`);
      p += 1;
    }

    const countSql = `SELECT COUNT(*)::int AS total FROM (${unionSql}) c`;
    const countRows = await this.dataSource.query(countSql, params);
    const total = countRows[0]?.total ?? 0;

    const dataSql = `
      SELECT codigo, etiqueta, tipo, id_origen
      FROM (${unionSql}) d
      ORDER BY tipo ASC, codigo ASC
      LIMIT $${p} OFFSET $${p + 1}
    `;
    params.push(safeLimit, offset);
    const items = await this.dataSource.query(dataSql, params);

    return {
      items,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    };
  }
}
