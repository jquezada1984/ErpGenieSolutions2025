import { Resolver, Query, Args, Int, Float } from '@nestjs/graphql';
import { CuentaImpuesto } from '../entities/cuenta-impuesto.entity';
import { CuentaImpuestoService } from '../services/cuenta-impuesto.service';

@Resolver(() => CuentaImpuesto)
export class CuentaImpuestoResolver {
  constructor(private readonly cuentaImpuestoService: CuentaImpuestoService) {}

  @Query(() => [CuentaImpuesto])
  async cuentasImpuesto(): Promise<CuentaImpuesto[]> {
    return this.cuentaImpuestoService.findAll();
  }

  @Query(() => CuentaImpuesto, { nullable: true })
  async cuentaImpuesto(@Args('id', { type: () => Int }) id: number): Promise<CuentaImpuesto> {
    return this.cuentaImpuestoService.findOne(id);
  }

  @Query(() => [CuentaImpuesto])
  async cuentasImpuestoPorEmpresa(
    @Args('empresaId', { type: () => Int }) empresaId: number,
  ): Promise<CuentaImpuesto[]> {
    return this.cuentaImpuestoService.findByEmpresa(empresaId);
  }

  @Query(() => CuentaImpuesto, { nullable: true })
  async cuentaImpuestoPorTipo(
    @Args('empresaId', { type: () => Int }) empresaId: number,
    @Args('tipoImpuesto') tipoImpuesto: string,
    @Args('porcentaje', { type: () => Float }) porcentaje: number,
  ): Promise<CuentaImpuesto> {
    return this.cuentaImpuestoService.findByTipo(empresaId, tipoImpuesto, porcentaje);
  }
}
