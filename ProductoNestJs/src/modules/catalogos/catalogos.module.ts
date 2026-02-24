import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CatalogosResolver } from './catalogos.resolver';

import { Impuesto } from './entities/impuesto.entity';
import { Pais } from './entities/pais.entity';
import { Provincia } from './entities/provincia.entity';
import { CuentaContable } from './entities/cuenta-contable.entity';

import { SelectsController } from '../catalogos/selects.controller';
import { SelectsService } from '../catalogos/selects.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Impuesto,
      Pais,
      Provincia,
      CuentaContable,
    ]),
  ],
  controllers: [SelectsController],
  providers: [CatalogosResolver, SelectsService],
  exports: [TypeOrmModule],
})
export class CatalogosModule {}
