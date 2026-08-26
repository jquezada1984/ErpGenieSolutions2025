import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AlmacenListado } from './objects/almacen-listado.object';
import { AlmacenDetalle } from './objects/almacen-detalle.object';
import { StockItemAlmacenDetalle } from './objects/stock-item-almacen.object';
import { StockItemAlmacenListado } from './objects/stock-item-almacen-listado.object';
import { AlmacenService } from './almacen.service';

/**
 * NO exponer query `almacenes` (reservada en InicioNestJs / Gateway).
 * Lectura: almacenesListado, almacenPorId · Mutación: actualizarEstadoAlmacen.
 */
@Resolver()
export class AlmacenResolver {
  constructor(private readonly almacenService: AlmacenService) {}

  @Mutation(() => Boolean, { name: 'actualizarEstadoAlmacen' })
  async actualizarEstadoAlmacen(
    @Args('id_almacen', { type: () => ID }) id_almacen: string,
    @Args('estado', { type: () => Boolean }) estado: boolean,
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
  ): Promise<boolean> {
    return this.almacenService.actualizarEstadoAlmacen(
      id_almacen,
      estado,
      id_empresa,
    );
  }

  @Query(() => [AlmacenListado], {
    name: 'almacenesListado',
    description: 'Listado de almacenes por empresa (lectura AlmacenNestJs).',
  })
  async almacenesListado(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('id_pais', { type: () => ID, nullable: true }) id_pais?: string,
    @Args('id_provincia', { type: () => ID, nullable: true }) id_provincia?: string,
    @Args('poblacion', { nullable: true }) poblacion?: string,
    @Args('almacen_ref', { nullable: true }) almacen_ref?: string,
    @Args('nombre', { nullable: true }) nombre?: string,
    @Args('estado', { type: () => Boolean, nullable: true }) estado?: boolean,
  ): Promise<AlmacenListado[]> {
    return this.almacenService.almacenesListado({
      id_empresa,
      id_pais: id_pais ?? undefined,
      id_provincia: id_provincia ?? undefined,
      poblacion: poblacion ?? undefined,
      almacen_ref: almacen_ref ?? undefined,
      nombre: nombre ?? undefined,
      estado: typeof estado === 'boolean' ? estado : undefined,
    });
  }

  @Query(() => AlmacenDetalle, {
    name: 'almacenPorId',
    nullable: true,
    description: 'Detalle de almacén por id_almacen e id_empresa (multi-tenant).',
  })
  async almacenPorId(
    @Args('id_almacen', { type: () => ID }) id_almacen: string,
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
  ): Promise<AlmacenDetalle | null> {
    return this.almacenService.almacenPorId(id_almacen, id_empresa);
  }

  @Query(() => StockItemAlmacenDetalle, {
    name: 'stockItemAlmacen',
    nullable: true,
    description:
      'Saldo puntual por empresa, item y almacén. Solo lectura; null si no existe o no pertenece a la empresa.',
  })
  async stockItemAlmacen(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('id_item', { type: () => ID }) id_item: string,
    @Args('id_almacen', { type: () => ID }) id_almacen: string,
  ): Promise<StockItemAlmacenDetalle | null> {
    return this.almacenService.stockItemAlmacen(
      id_empresa,
      id_item,
      id_almacen,
    );
  }

  @Query(() => [StockItemAlmacenListado], {
    name: 'stockItemsAlmacenListado',
    description:
      'Listado read-only de filas de stock existentes, filtrado obligatoriamente por empresa.',
  })
  async stockItemsAlmacenListado(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('id_almacen', { type: () => ID, nullable: true })
    id_almacen?: string,
    @Args('id_item', { type: () => ID, nullable: true }) id_item?: string,
    @Args('estado', { type: () => Boolean, nullable: true }) estado?: boolean,
  ): Promise<StockItemAlmacenListado[]> {
    return this.almacenService.stockItemsAlmacenListado({
      id_empresa,
      id_almacen: id_almacen ?? undefined,
      id_item: id_item ?? undefined,
      estado: typeof estado === 'boolean' ? estado : undefined,
    });
  }
}
