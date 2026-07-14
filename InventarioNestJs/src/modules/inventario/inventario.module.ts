import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from './entities/inventario.entity';
import { InventarioService } from './inventario.service';
import { InventarioResolver } from './inventario.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Inventario])],
  providers: [InventarioService, InventarioResolver],
  exports: [InventarioService, TypeOrmModule],
})
export class InventarioModule {}
