import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gasto } from './entities/gasto.entity';
import { GastoDetalle } from './entities/gasto-detalle.entity';
import { GastoService } from './gasto.service';
import { GastoResolver } from './gasto.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Gasto, GastoDetalle])],
  providers: [GastoService, GastoResolver],
  exports: [GastoService],
})
export class GastoModule {}
