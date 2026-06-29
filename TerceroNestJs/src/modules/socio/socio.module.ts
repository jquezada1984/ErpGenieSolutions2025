import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolSocio } from './entities/rol-socio.entity';
import { Socio, SocioTercero } from './entities/socio.entity';
import { SocioService } from './socio.service';
import { SocioResolver } from './socio.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RolSocio, Socio, SocioTercero])],
  providers: [SocioService, SocioResolver],
  exports: [SocioService],
})
export class SocioModule {}
