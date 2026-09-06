import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from './entities/inventario.entity';
import { AlmacenEntity } from './entities/almacen.entity';
import { StockItemAlmacen } from './entities/stock-item-almacen.entity';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { TransferenciaStock } from './entities/transferencia-stock.entity';
import { CambioMasivoStock } from './entities/cambio-masivo-stock.entity';
import { InventarioDetalleLinea } from './entities/inventario-detalle-linea.entity';
import { ItemLoteSerie } from './entities/item-lote-serie.entity';
import { InventarioService } from './inventario.service';
import { InventarioResolver } from './inventario.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventario,
      AlmacenEntity,
      StockItemAlmacen,
      MovimientoInventario,
      TransferenciaStock,
      CambioMasivoStock,
      InventarioDetalleLinea,
      ItemLoteSerie,
    ]),
  ],
  providers: [InventarioService, InventarioResolver],
  exports: [InventarioService, TypeOrmModule],
})
export class InventarioModule {}
