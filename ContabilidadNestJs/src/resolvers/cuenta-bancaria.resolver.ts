import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { CuentaBancaria } from '../entities/cuenta-bancaria.entity';
import { CuentaBancariaService } from '../services/cuenta-bancaria.service';

@Resolver(() => CuentaBancaria)
export class CuentaBancariaResolver {
  constructor(private readonly cuentaBancariaService: CuentaBancariaService) {}

  @Query(() => [CuentaBancaria])
  async cuentasBancarias(): Promise<CuentaBancaria[]> {
    return this.cuentaBancariaService.findAll();
  }

  @Query(() => CuentaBancaria, { nullable: true })
  async cuentaBancaria(@Args('id', { type: () => Int }) id: number): Promise<CuentaBancaria> {
    return this.cuentaBancariaService.findOne(id);
  }

  @Query(() => [CuentaBancaria])
  async cuentasBancariasPorEmpresa(
    @Args('empresaId', { type: () => Int }) empresaId: number,
  ): Promise<CuentaBancaria[]> {
    return this.cuentaBancariaService.findByEmpresa(empresaId);
  }
}
