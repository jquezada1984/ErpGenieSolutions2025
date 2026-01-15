import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { SaldoCuenta } from '../entities/saldo-cuenta.entity';
import { SaldoCuentaService } from '../services/saldo-cuenta.service';

@Resolver(() => SaldoCuenta)
export class SaldoCuentaResolver {
  constructor(private readonly saldoCuentaService: SaldoCuentaService) {}

  @Query(() => [SaldoCuenta])
  async saldosCuentas(): Promise<SaldoCuenta[]> {
    return this.saldoCuentaService.findAll();
  }

  @Query(() => SaldoCuenta, { nullable: true })
  async saldoCuenta(@Args('id', { type: () => Int }) id: number): Promise<SaldoCuenta> {
    return this.saldoCuentaService.findOne(id);
  }

  @Query(() => [SaldoCuenta])
  async saldosCuentasPorCuenta(
    @Args('cuentaContableId', { type: () => Int }) cuentaContableId: number,
  ): Promise<SaldoCuenta[]> {
    return this.saldoCuentaService.findByCuenta(cuentaContableId);
  }

  @Query(() => [SaldoCuenta])
  async saldosCuentasPorPeriodo(
    @Args('periodoContableId', { type: () => Int }) periodoContableId: number,
  ): Promise<SaldoCuenta[]> {
    return this.saldoCuentaService.findByPeriodo(periodoContableId);
  }

  @Query(() => SaldoCuenta, { nullable: true })
  async saldoCuentaPorCuentaYPeriodo(
    @Args('cuentaContableId', { type: () => Int }) cuentaContableId: number,
    @Args('periodoContableId', { type: () => Int }) periodoContableId: number,
  ): Promise<SaldoCuenta> {
    return this.saldoCuentaService.findByCuentaYPeriodo(cuentaContableId, periodoContableId);
  }
}
