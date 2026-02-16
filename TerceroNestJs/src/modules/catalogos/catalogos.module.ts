import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoTercero } from './entities/tipo-tercero.entity';
import { CondicionPago } from './entities/condicion-pago.entity';
import { FormaPago } from './entities/forma-pago.entity';
import { Incoterm } from './entities/incoterm.entity';
import { Pais } from './entities/pais.entity';
import { Empresa } from '../empresa/entities/empresa.entity';
import { CatalogosResolver } from './catalogos.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TipoTercero, CondicionPago, FormaPago, Incoterm, Pais, Empresa])],
  providers: [CatalogosResolver],
  exports: [TypeOrmModule, CatalogosResolver],
})
export class CatalogosModule {}
