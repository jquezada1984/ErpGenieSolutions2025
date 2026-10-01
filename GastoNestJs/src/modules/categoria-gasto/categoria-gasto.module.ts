import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaGasto } from './entities/categoria-gasto.entity';
import { CategoriaGastoService } from './categoria-gasto.service';
import { CategoriaGastoResolver } from './categoria-gasto.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaGasto])],
  providers: [CategoriaGastoService, CategoriaGastoResolver],
  exports: [CategoriaGastoService],
})
export class CategoriaGastoModule {}
