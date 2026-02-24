import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Impuesto } from './entities/impuesto.entity';
import { Pais } from './entities/pais.entity';
import { Provincia } from './entities/provincia.entity';
import { CuentaContable } from './entities/cuenta-contable.entity';

@Resolver(() => Pais) // ✅ evita resolver "sin tipo" (más estable)
export class CatalogosResolver {
  constructor(
    @InjectRepository(Impuesto)
    private readonly impuestoRepo: Repository<Impuesto>,

    @InjectRepository(Pais)
    private readonly paisRepo: Repository<Pais>,

    @InjectRepository(Provincia)
    private readonly provinciaRepo: Repository<Provincia>,

    @InjectRepository(CuentaContable)
    private readonly cuentaRepo: Repository<CuentaContable>,
  ) {}

  @Query(() => [Impuesto], { name: 'impuestos' })
  async impuestos(): Promise<Impuesto[]> {
    return this.impuestoRepo.find({
      order: { nombre: 'ASC' },
    });
  }

  @Query(() => [Pais], { name: 'paises' })
  async paises(): Promise<Pais[]> {
    return this.paisRepo.find({
      order: { nombre: 'ASC' },
    });
  }

  @Query(() => [Provincia], { name: 'provincias' })
  async provincias(
    @Args('id_pais', { type: () => ID, nullable: true }) id_pais?: string,
  ): Promise<Provincia[]> {
    if (!id_pais) {
      return this.provinciaRepo.find({ order: { nombre: 'ASC' } });
    }

    return this.provinciaRepo.find({
      where: { id_pais },
      order: { nombre: 'ASC' },
    });
  }

  @Query(() => [CuentaContable], { name: 'cuentasContables' })
  async cuentasContables(
    @Args('solo_movimiento', { type: () => Boolean, nullable: true })
    solo_movimiento?: boolean,

    // ✅ ahora SIN defaultValue: la lógica la controlamos aquí
    @Args('solo_activas', { type: () => Boolean, nullable: true })
    solo_activas?: boolean,
  ): Promise<CuentaContable[]> {
    const where: any = {};

    /**
     * ✅ Regla ERP:
     * - Si no mandas solo_activas → por defecto trae activas
     * - Si solo_activas=true → trae activas
     * - Si solo_activas=false → trae todas (sin filtro)
     */
    const filtrarActivas = solo_activas !== false; // undefined/null/true => filtra

    if (filtrarActivas) {
      // estado puede venir NULL en tu BD, lo consideras como "activa"
      where.estado = In([true, null]);
    }

    // opcional: solo cuentas que permiten movimiento
    if (solo_movimiento === true) {
      where.permite_movimientos = true;
    }

    return this.cuentaRepo.find({
      where,
      order: { codigo: 'ASC' },
    });
  }
}
