import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Empresa } from './empresa.entity';
import { EmpresaResolver } from './empresa.resolver';
import { EmpresaService } from './empresa.service';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa])],
  providers: [EmpresaService, EmpresaResolver],
  exports: [EmpresaService],
})
export class EmpresaModule {}
