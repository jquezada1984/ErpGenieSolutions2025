import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banco } from './entities/banco.entity';
import { BancoService } from './banco.service';
import { BancoResolver } from './banco.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Banco])],
  providers: [BancoService, BancoResolver],
  exports: [BancoService],
})
export class BancoModule {}
