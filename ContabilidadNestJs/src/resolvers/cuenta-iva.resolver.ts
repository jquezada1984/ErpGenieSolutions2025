import { Resolver, Query, Args, Int, Float } from '@nestjs/graphql';
import { CuentaIva } from '../entities/cuenta-iva.entity';
import { CuentaIvaService } from '../services/cuenta-iva.service';

@Resolver(() => CuentaIva)
export class CuentaIvaResolver {
  constructor(private readonly cuentaIvaService: CuentaIvaService) {}

  @Query(() => [CuentaIva])
  async cuentasIva(): Promise<CuentaIva[]> {
    return this.cuentaIvaService.findAll();
  }

  @Query(() => CuentaIva, { nullable: true })
  async cuentaIva(@Args('id', { type: () => Int }) id: number): Promise<CuentaIva> {
    return this.cuentaIvaService.findOne(id);
  }

  @Query(() => [CuentaIva])
  async cuentasIvaPorEmpresa(
    @Args('empresaId', { type: () => Int }) empresaId: number,
  ): Promise<CuentaIva[]> {
    return this.cuentaIvaService.findByEmpresa(empresaId);
  }

  @Query(() => CuentaIva, { nullable: true })
  async cuentaIvaPorTipo(
    @Args('empresaId', { type: () => Int }) empresaId: number,
    @Args('tipoIva') tipoIva: string,
    @Args('porcentaje', { type: () => Float }) porcentaje: number,
  ): Promise<CuentaIva> {
    return this.cuentaIvaService.findByTipo(empresaId, tipoIva, porcentaje);
  }
}
