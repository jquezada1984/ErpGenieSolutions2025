import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { TransferenciaBancaria } from './entities/transferencia-bancaria.entity';
import { TransferenciaBancariaService } from './transferencia-bancaria.service';

@Resolver(() => TransferenciaBancaria)
export class TransferenciaBancariaResolver {
  constructor(private readonly transferenciaService: TransferenciaBancariaService) {}

  @Query(() => [TransferenciaBancaria], { name: 'transferenciasBancarias' })
  transferenciasBancarias(
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
    @Args('soloActivos', { type: () => Boolean, nullable: true }) soloActivos?: boolean,
  ) {
    return this.transferenciaService.findByEmpresa(
      id_empresa ?? undefined,
      soloActivos !== false,
    );
  }

  @Query(() => TransferenciaBancaria, { name: 'transferenciaBancaria' })
  transferenciaBancaria(
    @Args('id_transferencia_bancaria', { type: () => ID }) id_transferencia_bancaria: string,
  ) {
    return this.transferenciaService.findOne(id_transferencia_bancaria);
  }
}
