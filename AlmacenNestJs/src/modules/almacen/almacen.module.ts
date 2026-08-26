import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Almacen } from './entities/almacen.entity';
import { StockItemAlmacen } from './entities/stock-item-almacen.entity';
import { AlmacenService } from './almacen.service';
import { AlmacenResolver } from './almacen.resolver';
import { MovimientoInventario } from './movimiento-inventario/entities/movimiento-inventario.entity';
import { MovimientoInventarioService } from './movimiento-inventario/movimiento-inventario.service';
import { MovimientoInventarioResolver } from './movimiento-inventario/movimiento-inventario.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Almacen,
      MovimientoInventario,
      StockItemAlmacen,
    ]),
  ],
  providers: [
    AlmacenService,
    AlmacenResolver,
    MovimientoInventarioService,
    MovimientoInventarioResolver,
  ],
  exports: [AlmacenService, TypeOrmModule],
})
export class AlmacenModule {}
