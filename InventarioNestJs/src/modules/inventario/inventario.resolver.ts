import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InventarioListado } from './objects/inventario-listado.object';
import { InventarioService } from './inventario.service';

@Resolver(() => InventarioListado)
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
    @Args('inventario_ref', { nullable: true }) inventario_ref?: string,
    @Args('etiqueta', { nullable: true }) etiqueta?: string,
    @Args('warehouse', { nullable: true }) warehouse?: string,
    @Args('id_almacen', { type: () => ID, nullable: true }) id_almacen?: string,
    @Args('product', { nullable: true }) product?: string,
    @Args('estado_inventario', { nullable: true }) estado_inventario?: string,
  ): Promise<InventarioListado[]> {
    return this.inventarioService.inventariosListado({
      id_empresa: id_empresa ?? undefined,
      inventario_ref: inventario_ref ?? undefined,
      etiqueta: etiqueta ?? undefined,
      warehouse: warehouse ?? undefined,
      id_almacen: id_almacen ?? undefined,
      product: product ?? undefined,
      estado_inventario: estado_inventario ?? undefined,
    });
  }
}
