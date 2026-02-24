import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Producto } from './entities/producto.entity';
import { ProductoResolver } from './producto.resolver';
import { ProductoService } from './producto.service';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],
  providers: [ProductoResolver, ProductoService],
  exports: [TypeOrmModule],
})
export class ProductoModule {}
