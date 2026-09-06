import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InventarioListado } from './objects/inventario-listado.object';
import { InventarioDetalle } from './objects/inventario-detalle.object';
import {
  AlmacenListado,
  StockListado,
  MovimientoListado,
  TransferenciaListado,
  CambioMasivoListado,
  InventarioLineaListado,
  LoteSerieListado,
  StockAFechaListado,
  StockReposicionListado,
  StockValoracionListado,
} from './objects/stock-kardex.object';
import { InventarioService } from './inventario.service';

@Resolver()
export class InventarioResolver {
  constructor(private readonly inventarioService: InventarioService) {}

  @Mutation(() => Boolean, { name: 'actualizarEstadoInventario' })
  async actualizarEstadoInventario(
    @Args('id_inventario', { type: () => ID }) id_inventario: string,
    @Args('estado', { type: () => Boolean }) estado: boolean,
  ): Promise<boolean> {
    return this.inventarioService.actualizarEstadoInventario(id_inventario, estado);
  }

  @Query(() => [InventarioListado], { name: 'inventariosListado' })
  async inventariosListado(
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
    @Args('id_inventario', { type: () => ID, nullable: true }) id_inventario?: string,
    @Args('inventario_ref', { nullable: true }) inventario_ref?: string,
    @Args('etiqueta', { nullable: true }) etiqueta?: string,
    @Args('warehouse', { nullable: true }) warehouse?: string,
    @Args('id_almacen', { type: () => ID, nullable: true }) id_almacen?: string,
    @Args('product', { nullable: true }) product?: string,
    @Args('estado_inventario', { nullable: true }) estado_inventario?: string,
  ): Promise<InventarioListado[]> {
    return this.inventarioService.inventariosListado({
      id_empresa: id_empresa ?? undefined,
      id_inventario: id_inventario ?? undefined,
      inventario_ref: inventario_ref ?? undefined,
      etiqueta: etiqueta ?? undefined,
      warehouse: warehouse ?? undefined,
      id_almacen: id_almacen ?? undefined,
      product: product ?? undefined,
      estado_inventario: estado_inventario ?? undefined,
    });
  }

  @Query(() => InventarioDetalle, {
    name: 'inventarioPorId',
    nullable: true,
  })
  async inventarioPorId(
    @Args('id_inventario', { type: () => ID }) id_inventario: string,
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
  ): Promise<InventarioDetalle | null> {
    return this.inventarioService.inventarioPorId(id_inventario, id_empresa);
  }

  @Query(() => [InventarioLineaListado], { name: 'inventarioLineas' })
  async inventarioLineas(
    @Args('id_inventario', { type: () => ID }) id_inventario: string,
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
  ): Promise<InventarioLineaListado[]> {
    return this.inventarioService.inventarioLineas(id_inventario, id_empresa);
  }

  @Query(() => [AlmacenListado], { name: 'almacenesPorEmpresa' })
  async almacenesPorEmpresa(
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
    @Args('solo_activos', { nullable: true, defaultValue: true }) solo_activos?: boolean,
  ): Promise<AlmacenListado[]> {
    return this.inventarioService.almacenesPorEmpresa(id_empresa, solo_activos !== false);
  }

  @Query(() => [StockListado], { name: 'stockPorEmpresa' })
  async stockPorEmpresa(
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
    @Args('id_almacen', { type: () => ID, nullable: true }) id_almacen?: string,
    @Args('id_item', { type: () => ID, nullable: true }) id_item?: string,
    @Args('referencia', { nullable: true }) referencia?: string,
    @Args('etiqueta', { nullable: true }) etiqueta?: string,
  ): Promise<StockListado[]> {
    return this.inventarioService.stockPorEmpresa({
      id_empresa,
      id_almacen,
      id_item,
      referencia,
      etiqueta,
    });
  }

  @Query(() => [MovimientoListado], { name: 'movimientosInventario' })
  async movimientosInventario(
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
    @Args('id_almacen', { type: () => ID, nullable: true }) id_almacen?: string,
    @Args('id_item', { type: () => ID, nullable: true }) id_item?: string,
    @Args('tipo_movimiento', { nullable: true }) tipo_movimiento?: string,
    @Args('modulo_origen', { nullable: true }) modulo_origen?: string,
    @Args('fecha_desde', { nullable: true }) fecha_desde?: string,
    @Args('fecha_hasta', { nullable: true }) fecha_hasta?: string,
  ): Promise<MovimientoListado[]> {
    return this.inventarioService.movimientosInventario({
      id_empresa,
      id_almacen,
      id_item,
      tipo_movimiento,
      modulo_origen,
      fecha_desde,
      fecha_hasta,
    });
  }

  @Query(() => [TransferenciaListado], { name: 'transferenciasStock' })
  async transferenciasStock(
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
  ): Promise<TransferenciaListado[]> {
    return this.inventarioService.transferenciasStock(id_empresa);
  }

  @Query(() => [CambioMasivoListado], { name: 'cambiosMasivosStock' })
  async cambiosMasivosStock(
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
  ): Promise<CambioMasivoListado[]> {
    return this.inventarioService.cambiosMasivosStock(id_empresa);
  }

  @Query(() => [LoteSerieListado], { name: 'lotesSerie' })
  async lotesSerie(
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
    @Args('id_almacen', { type: () => ID, nullable: true }) id_almacen?: string,
    @Args('id_item', { type: () => ID, nullable: true }) id_item?: string,
  ): Promise<LoteSerieListado[]> {
    return this.inventarioService.lotesSerie({ id_empresa, id_almacen, id_item });
  }

  @Query(() => [StockAFechaListado], { name: 'stockAFecha' })
  async stockAFecha(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('fecha') fecha: string,
    @Args('id_almacen', { type: () => ID, nullable: true }) id_almacen?: string,
    @Args('id_item', { type: () => ID, nullable: true }) id_item?: string,
  ): Promise<StockAFechaListado[]> {
    return this.inventarioService.stockAFecha(id_empresa, fecha, id_almacen, id_item);
  }

  @Query(() => [StockReposicionListado], { name: 'stockReposicion' })
  async stockReposicion(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('id_almacen', { type: () => ID, nullable: true }) id_almacen?: string,
  ): Promise<StockReposicionListado[]> {
    return this.inventarioService.stockReposicion(id_empresa, id_almacen);
  }

  @Query(() => [StockValoracionListado], { name: 'stockValoracionPmp' })
  async stockValoracionPmp(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('id_almacen', { type: () => ID, nullable: true }) id_almacen?: string,
  ): Promise<StockValoracionListado[]> {
    return this.inventarioService.stockValoracionPmp(id_empresa, id_almacen);
  }
}
