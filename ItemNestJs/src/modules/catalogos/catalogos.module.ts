import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoVentaItem } from './entities/estado-venta-item.entity';
import { EstadoCompraItem } from './entities/estado-compra-item.entity';
import { NaturalezaItem } from './entities/naturaleza-item.entity';
import { TipoControlInventarioItem } from './entities/tipo-control-inventario-item.entity';
import { TipoControlCaducidadItem } from './entities/tipo-control-caducidad-item.entity';
import { TipoComportamientoItem } from './entities/tipo-comportamiento-item.entity';
import { CatalogosResolver } from './catalogos.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EstadoVentaItem,
      EstadoCompraItem,
      NaturalezaItem,
      TipoControlInventarioItem,
      TipoControlCaducidadItem,
      TipoComportamientoItem,
    ]),
  ],
  providers: [CatalogosResolver],
  exports: [TypeOrmModule, CatalogosResolver],
})
export class CatalogosModule {}
