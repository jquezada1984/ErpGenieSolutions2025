import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { MovimientoInventarioService } from './movimiento-inventario.service';
import { MovimientoInventarioListado } from './objects/movimiento-inventario-listado.object';
import { StockPorFecha } from './objects/stock-por-fecha.object';

@Resolver()
export class MovimientoInventarioResolver {
  constructor(
    private readonly movimientoInventarioService: MovimientoInventarioService,
  ) {}

  @Query(() => [MovimientoInventarioListado], {
    name: 'movimientosInventarioListado',
    description: 'Historial de movimientos de inventario (solo lectura).',
  })
  async movimientosInventarioListado(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('fecha_desde', { nullable: true }) fecha_desde?: string,
    @Args('fecha_hasta', { nullable: true }) fecha_hasta?: string,
    @Args('id_item', { type: () => ID, nullable: true }) id_item?: string,
    @Args('id_almacen', { type: () => ID, nullable: true }) id_almacen?: string,
    @Args('tipo_movimiento', { nullable: true }) tipo_movimiento?: string,
    @Args('referencia', { nullable: true }) referencia?: string,
    @Args('estado', { type: () => Boolean, nullable: true }) estado?: boolean,
  ): Promise<MovimientoInventarioListado[]> {
    return this.movimientoInventarioService.movimientosInventarioListado({
      id_empresa,
      fecha_desde: fecha_desde ?? undefined,
      fecha_hasta: fecha_hasta ?? undefined,
      id_item: id_item ?? undefined,
      id_almacen: id_almacen ?? undefined,
      tipo_movimiento: tipo_movimiento ?? undefined,
      referencia: referencia ?? undefined,
      estado: typeof estado === 'boolean' ? estado : undefined,
    });
  }

  @Query(() => [StockPorFecha], {
    name: 'stockPorFecha',
    description:
      'Stock físico reconstruido a una fecha (solo lectura; sin reservado/disponible/virtual).',
  })
  async stockPorFecha(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('fecha') fecha: string,
    @Args('id_almacen', { type: () => ID }) id_almacen: string,
    @Args('id_item', { type: () => ID, nullable: true }) id_item?: string,
  ): Promise<StockPorFecha[]> {
    return this.movimientoInventarioService.stockPorFecha({
      id_empresa,
      fecha,
      id_almacen,
      id_item: id_item ?? undefined,
    });
  }
}
