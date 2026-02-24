import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { ProductoService } from './producto.service';

import { PaginatedProductosDTO } from './dto/paginated-productos.dto';
import { ProductoDetalleDTO } from './dto/producto-detalle.dto';
import { ProductoFilterInput } from './dto/producto-filter.input';

@Resolver()
export class ProductoResolver {
  constructor(private readonly productoService: ProductoService) {}

  // Lista para la grilla (paginada)
  @Query(() => PaginatedProductosDTO, { name: 'productos' })
  async productos(
    @Args('filter', { type: () => ProductoFilterInput }) filter: ProductoFilterInput,
  ): Promise<PaginatedProductosDTO> {
    return this.productoService.listar(filter);
  }

  // Detalle por id (validando id_empresa)
  @Query(() => ProductoDetalleDTO, { name: 'productoById' })
  async productoById(
    @Args('id_producto', { type: () => ID }) id_producto: string,
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
  ): Promise<ProductoDetalleDTO> {
    return this.productoService.obtenerPorId(id_producto, id_empresa);
  }
}
