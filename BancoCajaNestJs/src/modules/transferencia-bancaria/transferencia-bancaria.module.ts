import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferenciaBancaria } from './entities/transferencia-bancaria.entity';
import { TransferenciaBancariaService } from './transferencia-bancaria.service';
import { TransferenciaBancariaResolver } from './transferencia-bancaria.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TransferenciaBancaria])],
  providers: [TransferenciaBancariaService, TransferenciaBancariaResolver],
})
export class TransferenciaBancariaModule {}
