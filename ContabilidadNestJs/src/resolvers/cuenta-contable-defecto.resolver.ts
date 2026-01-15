import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { CuentaContableDefecto } from '../entities/cuenta-contable-defecto.entity';
import { CuentaContableDefectoService } from '../services/cuenta-contable-defecto.service';

@Resolver(() => CuentaContableDefecto)
export class CuentaContableDefectoResolver {
  constructor(private readonly cuentaDefectoService: CuentaContableDefectoService) {}

  @Query(() => [CuentaContableDefecto])
  async cuentasContablesDefecto(): Promise<CuentaContableDefecto[]> {
    return this.cuentaDefectoService.findAll();
  }

  @Query(() => CuentaContableDefecto, { nullable: true })
  async cuentaContableDefecto(@Args('id', { type: () => Int }) id: number): Promise<CuentaContableDefecto> {
    return this.cuentaDefectoService.findOne(id);
  }

  @Query(() => [CuentaContableDefecto])
  async cuentasContablesDefectoPorEmpresa(
    @Args('empresaId', { type: () => Int }) empresaId: number,
  ): Promise<CuentaContableDefecto[]> {
    return this.cuentaDefectoService.findByEmpresa(empresaId);
  }

  @Query(() => CuentaContableDefecto, { nullable: true })
  async cuentaContableDefectoPorTipo(
    @Args('empresaId', { type: () => Int }) empresaId: number,
    @Args('tipoOperacion') tipoOperacion: string,
  ): Promise<CuentaContableDefecto> {
    return this.cuentaDefectoService.findByTipoOperacion(empresaId, tipoOperacion);
  }
}
