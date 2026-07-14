import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { CuentaBancaria } from './entities/cuenta-bancaria.entity';
import { CuentaBancariaService } from './cuenta-bancaria.service';

@Resolver(() => CuentaBancaria)
export class CuentaBancariaResolver {
  constructor(private readonly cuentaService: CuentaBancariaService) {}

  @Query(() => [CuentaBancaria], { name: 'cuentasBancarias' })
  cuentasBancarias(
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
  ) {
    return this.cuentaService.findAll(id_empresa ?? undefined);
  }

  @Query(() => CuentaBancaria, { name: 'cuentaBancaria' })
  cuentaBancaria(
    @Args('id_cuenta_bancaria', { type: () => ID }) id_cuenta_bancaria: string,
  ) {
    return this.cuentaService.findOne(id_cuenta_bancaria);
  }
}
