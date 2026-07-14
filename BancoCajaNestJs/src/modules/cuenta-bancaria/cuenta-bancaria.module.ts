import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentaBancaria } from './entities/cuenta-bancaria.entity';
import { CuentaBancariaService } from './cuenta-bancaria.service';
import { CuentaBancariaResolver } from './cuenta-bancaria.resolver';
import { BancoModule } from '../banco/banco.module';

@Module({
  imports: [TypeOrmModule.forFeature([CuentaBancaria]), BancoModule],
  providers: [CuentaBancariaService, CuentaBancariaResolver],
})
export class CuentaBancariaModule {}
