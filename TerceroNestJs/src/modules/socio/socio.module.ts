import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolSocio } from './entities/rol-socio.entity';
import { SocioService } from './socio.service';
import { SocioResolver } from './socio.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RolSocio])],
  providers: [SocioService, SocioResolver],
  exports: [SocioService],
})
export class SocioModule {}
