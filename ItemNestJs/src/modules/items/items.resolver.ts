import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Item } from './entities/item.entity';
import { ItemDetalleEdicion } from './objects/item-detalle-edicion.object';
import { ItemsService } from './items.service';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Query(() => ItemDetalleEdicion, { name: 'itemDetalleEdicion', nullable: true })
  async itemDetalleEdicion(
    @Args('id_item', { type: () => ID }) id_item: string,
  ): Promise<ItemDetalleEdicion | null> {
    try {
      return await this.itemsService.findDetalleEdicion(id_item);
    } catch {
      return null;
    }
  }

  @Query(() => [Item], { name: 'itemsListado' })
  async itemsListado(
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
    @Args('producto_ref', { nullable: true }) producto_ref?: string,
    @Args('etiqueta', { nullable: true }) etiqueta?: string,
    @Args('codigo_barras', { nullable: true }) codigo_barras?: string,
    @Args('id_estado_venta', { type: () => ID, nullable: true }) id_estado_venta?: string,
    @Args('id_estado_compra', { type: () => ID, nullable: true }) id_estado_compra?: string,
    @Args('codigo_tipo_item', { nullable: true }) codigo_tipo_item?: string,
  ): Promise<Item[]> {
    return this.itemsService.listado({
      id_empresa: id_empresa ?? undefined,
      producto_ref: producto_ref ?? undefined,
      etiqueta: etiqueta ?? undefined,
      codigo_barras: codigo_barras ?? undefined,
      id_estado_venta: id_estado_venta ?? undefined,
      id_estado_compra: id_estado_compra ?? undefined,
      codigo_tipo_item: codigo_tipo_item ?? undefined,
    });
  }

  @Mutation(() => Boolean, { name: 'actualizarEstadoItem' })
  async actualizarEstadoItem(
    @Args('id_item', { type: () => ID }) id_item: string,
    @Args('estado') estado: boolean,
  ): Promise<boolean> {
    return this.itemsService.actualizarEstado(id_item, estado);
  }

  @Mutation(() => Boolean, { name: 'actualizarEstadoInventario' })
  async actualizarEstadoInventario(
    @Args('id_inventario', { type: () => ID }) id_inventario: string,
    @Args('estado', { type: () => Boolean }) estado: boolean,
  ): Promise<boolean> {
    return this.itemsService.actualizarEstadoInventario(id_inventario, estado);
  }

}
