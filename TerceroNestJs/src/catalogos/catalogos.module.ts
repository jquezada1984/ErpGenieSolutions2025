import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoTercero } from './entities/tipo-tercero.entity';
import { CondicionPago } from './entities/condicion-pago.entity';
import { FormaPago } from './entities/forma-pago.entity';
import { Incoterm } from './incoterm.entity';
import { Pais } from './entities/pais.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoTercero, CondicionPago, FormaPago, Incoterm, Pais])],
  exports: [TypeOrmModule],
})
export class CatalogosModule {}
