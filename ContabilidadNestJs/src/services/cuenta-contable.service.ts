import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CuentaContable } from '../entities/cuenta-contable.entity';
import { CuentasContablesPaginadas } from '../dto/cuentas-contables-paginadas.dto';

@Injectable()
export class CuentaContableService {
  constructor(
    @InjectRepository(CuentaContable)
    private readonly repo: Repository<CuentaContable>,
  ) {}

  private compareCodigo(a: string, b: string): number {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  }

  /** Orden árbol: padre → hijos (p. ej. 1, 101, 10101, 102, 2, 201…). */
  private ordenarJerarquico(items: CuentaContable[]): CuentaContable[] {
    if (!items.length) return items;

    const children = new Map<string | null, CuentaContable[]>();
    for (const item of items) {
      const key = item.id_cuenta_padre ?? null;
      if (!children.has(key)) children.set(key, []);
      children.get(key)!.push(item);
    }
    for (const list of children.values()) {
      list.sort((a, b) => this.compareCodigo(a.codigo, b.codigo));
    }

    const result: CuentaContable[] = [];
    const visit = (parentId: string | null) => {
      for (const node of children.get(parentId) || []) {
        result.push(node);
        visit(node.id_cuenta_contable);
      }
    };
    visit(null);

    // Cuentas huérfanas (padre ausente del conjunto) al final, por código
    if (result.length < items.length) {
      const placed = new Set(result.map((r) => r.id_cuenta_contable));
      const rest = items
        .filter((i) => !placed.has(i.id_cuenta_contable))
        .sort((a, b) => this.compareCodigo(a.codigo, b.codigo));
      result.push(...rest);
    }
    return result;
  }

  private async attachCodigoPadre(items: CuentaContable[]): Promise<CuentaContable[]> {
    if (!items.length) return items;
    const padreIds = [...new Set(items.map((i) => i.id_cuenta_padre).filter(Boolean))] as string[];
    const padres = padreIds.length
      ? await this.repo.find({ where: { id_cuenta_contable: In(padreIds) } })
      : [];
    const padreMap = new Map(padres.map((p) => [p.id_cuenta_contable, p.codigo]));
    return items.map((item) => {
      item.codigo_padre = item.id_cuenta_padre
        ? padreMap.get(item.id_cuenta_padre) ?? null
        : null;
      item.etiqueta_corta = item.descripcion;
      return item;
    });
  }

  async findByPlanPaginado(
    id_plan_contable: string,
    page = 1,
    limit = 20,
    busqueda?: string,
  ): Promise<CuentasContablesPaginadas> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(2000, Math.max(1, limit));
    const qb = this.repo
      .createQueryBuilder('c')
      .where('c.id_plan_contable = :id_plan_contable', { id_plan_contable });

    if (busqueda?.trim()) {
      const q = `%${busqueda.trim().toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(c.codigo) LIKE :q OR LOWER(c.nombre) LIKE :q OR LOWER(COALESCE(c.descripcion, \'\')) LIKE :q)',
        { q },
      );
    }

    const total = await qb.getCount();
    const allItems = await qb.getMany();
    const sorted = busqueda?.trim()
      ? [...allItems].sort((a, b) => this.compareCodigo(a.codigo, b.codigo))
      : this.ordenarJerarquico(allItems);
    const items = sorted.slice((safePage - 1) * safeLimit, safePage * safeLimit);

    const enriched = await this.attachCodigoPadre(items);
    return {
      items: enriched,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    };
  }

  async findOne(id: string): Promise<CuentaContable | null> {
    const row = await this.repo.findOne({ where: { id_cuenta_contable: id } });
    if (!row) return null;
    const [enriched] = await this.attachCodigoPadre([row]);
    return enriched;
  }
}
