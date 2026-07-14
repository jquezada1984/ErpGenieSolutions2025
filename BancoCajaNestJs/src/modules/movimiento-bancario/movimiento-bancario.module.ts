import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoBancario } from './entities/movimiento-bancario.entity';
import { MovimientoBancarioService } from './movimiento-bancario.service';
import { MovimientoBancarioResolver } from './movimiento-bancario.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoBancario])],
  providers: [MovimientoBancarioService, MovimientoBancarioResolver],
})
export class MovimientoBancarioModule {}
