import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Unidad } from '../entities/unidad.entity';
import { TipoUnidad } from '../entities/tipo-unidad.entity';

@Injectable()
export class UnidadService {
  constructor(private readonly dataSource: DataSource) {}

  private async tableExists(tableName: string): Promise<boolean> {
    const rows = await this.dataSource.query(
      `
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = $1
        LIMIT 1
      `,
      [tableName],
    );
    return rows.length > 0;
  }

  private async pickFirstExisting(candidates: string[]): Promise<string | null> {
    for (const t of candidates) {
      // eslint-disable-next-line no-await-in-loop
      if (await this.tableExists(t)) return t;
    }
    return null;
  }

  private async getTableColumns(tableName: string): Promise<Set<string>> {
    const rows = await this.dataSource.query(
      `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
      `,
      [tableName],
    );
    return new Set((rows || []).map((r: { column_name: string }) => r.column_name));
  }

  private pickColumn(cols: Set<string>, candidates: string[]): string | null {
    for (const c of candidates) {
      if (cols.has(c)) return c;
    }
    return null;
  }

  private nombreExpr(alias: string, cols: Set<string>): string {
    const hasNombre = cols.has('nombre');
    const hasDesc = cols.has('descripcion');
    if (hasNombre && hasDesc) {
      return `COALESCE(${alias}.nombre, ${alias}.descripcion, '')`;
    }
    if (hasNombre) return `COALESCE(${alias}.nombre, '')`;
    if (hasDesc) return `COALESCE(${alias}.descripcion, '')`;
    return "''";
  }

  async listarTiposUnidad(): Promise<TipoUnidad[]> {
    const tipoTable = await this.pickFirstExisting([
      'tipo_unidad_medida',
      'tipo_unidad',
      'tipo_unidad_catalogo',
      'tipos_unidad',
    ]);
    if (!tipoTable) return [];

    const cols = await this.getTableColumns(tipoTable);
    const idCol = this.pickColumn(cols, ['id_tipo_unidad_medida', 'id_tipo_unidad']);
    if (!idCol) return [];

    const codigoExpr = cols.has('codigo') ? "COALESCE(t.codigo, '')" : "''";
    const nombreSel = this.nombreExpr('t', cols);
    const estadoClause = cols.has('estado') ? 'WHERE COALESCE(t.estado, true) = true' : '';

    const query = `
      SELECT
        t.${idCol} AS id_tipo_unidad,
        ${codigoExpr} AS codigo,
        ${nombreSel} AS nombre
      FROM "${tipoTable}" t
      ${estadoClause}
      ORDER BY ${nombreSel} ASC
    `;
    const rows = await this.dataSource.query(query);
    return (rows || []).map((r: any) => ({
      id_tipo_unidad: r.id_tipo_unidad,
      codigo: r.codigo ?? '',
      nombre: r.nombre ?? '',
    })) as TipoUnidad[];
  }

  async listarUnidades(tipoCodigo?: string): Promise<Unidad[]> {
    const unidadTable = await this.pickFirstExisting([
      'unidad_medida',
      'unidad',
      'unidad_medida_catalogo',
      'unidades',
    ]);
    if (!unidadTable) return [];

    const tipoTable = await this.pickFirstExisting([
      'tipo_unidad_medida',
      'tipo_unidad',
      'tipo_unidad_catalogo',
      'tipos_unidad',
    ]);

    const uCols = await this.getTableColumns(unidadTable);
    const uPk = this.pickColumn(uCols, ['id_unidad_medida', 'id_unidad']);
    const uFkTipo = this.pickColumn(uCols, ['id_tipo_unidad_medida', 'id_tipo_unidad']);
    if (!uPk || !uFkTipo) return [];

    const codigoExpr = uCols.has('codigo') ? "COALESCE(u.codigo, '')" : "''";
    const nombreSel = this.nombreExpr('u', uCols);
    const abrevExpr = uCols.has('abreviatura') ? "COALESCE(u.abreviatura, '')" : "''";
    const estadoClause = uCols.has('estado') ? 'COALESCE(u.estado, true) = true' : 'true';

    const hasTipoJoin = tipoTable != null;
    let tuPk: string | null = null;
    let tuCols: Set<string> = new Set();
    if (hasTipoJoin) {
      tuCols = await this.getTableColumns(tipoTable);
      tuPk = this.pickColumn(tuCols, ['id_tipo_unidad_medida', 'id_tipo_unidad']);
    }

    const normalizedTipo = (tipoCodigo || '').trim().toUpperCase();
    const aliasesByTipo: Record<string, string[]> = {
      PESO: ['PESO', 'MASA', 'WEIGHT'],
      LONGITUD: ['LONGITUD', 'LARGO', 'DISTANCIA', 'LENGTH'],
      SUPERFICIE: ['SUPERFICIE', 'AREA'],
      VOLUMEN: ['VOLUMEN', 'CAPACIDAD', 'VOLUME'],
    };
    const aliases = aliasesByTipo[normalizedTipo] || (normalizedTipo ? [normalizedTipo] : []);

    const joinSql =
      hasTipoJoin && tuPk
        ? `LEFT JOIN "${tipoTable}" tu ON tu.${tuPk} = u.${uFkTipo}`
        : '';

    const tuIdExpr = hasTipoJoin && tuPk ? `tu.${tuPk}` : 'NULL';
    const tuCodigoExpr = tuCols.has('codigo') ? "COALESCE(tu.codigo, '')" : "''";
    const tuNombreSel = hasTipoJoin && tuPk ? this.nombreExpr('tu', tuCols) : "''";

    let tipoFilterSql = '';
    const params: string[] = [];
    if (hasTipoJoin && tuPk && tipoCodigo && aliases.length > 0) {
      const orParts: string[] = [];
      if (tuCols.has('codigo')) {
        orParts.push(
          ...aliases.map(
            (_, i) => `UPPER(COALESCE(tu.codigo, '')) = UPPER($${params.length + i + 1})`,
          ),
        );
        for (const a of aliases) params.push(a);
      }
      const nameColExpr = this.nombreExpr('tu', tuCols);
      if (tuCols.has('nombre') || tuCols.has('descripcion')) {
        const base = params.length;
        orParts.push(
          ...aliases.map(
            (_, i) => `UPPER(${nameColExpr}) LIKE UPPER($${base + i + 1})`,
          ),
        );
        for (const a of aliases) params.push(`%${a}%`);
      }
      if (orParts.length > 0) {
        tipoFilterSql = `AND (${orParts.join(' OR ')})`;
      }
    }

    const sql = `
      SELECT
        u.${uPk} AS id_unidad,
        u.${uFkTipo} AS id_tipo_unidad,
        ${codigoExpr} AS codigo,
        ${nombreSel} AS nombre,
        ${abrevExpr} AS abreviatura,
        ${tuIdExpr} AS tu_id_tipo_unidad,
        ${tuCodigoExpr} AS tu_codigo,
        ${tuNombreSel} AS tu_nombre
      FROM "${unidadTable}" u
      ${joinSql}
      WHERE ${estadoClause}
      ${tipoFilterSql}
      ORDER BY ${nombreSel} ASC
    `;

    const rows = await this.dataSource.query(sql, params);

    // Fallback seguro: si el filtro por tipo no encuentra nada, devolver catálogo general
    if (tipoCodigo && (!rows || rows.length === 0)) {
      return this.listarUnidades();
    }

    return (rows || []).map((r: any) => ({
      id_unidad: r.id_unidad,
      id_tipo_unidad: r.id_tipo_unidad,
      codigo: r.codigo ?? '',
      nombre: r.nombre ?? '',
      abreviatura: r.abreviatura ?? '',
      tipo_unidad:
        r.tu_id_tipo_unidad != null
          ? {
              id_tipo_unidad: r.tu_id_tipo_unidad,
              codigo: r.tu_codigo ?? '',
              nombre: r.tu_nombre ?? '',
            }
          : null,
    })) as Unidad[];
  }
}
