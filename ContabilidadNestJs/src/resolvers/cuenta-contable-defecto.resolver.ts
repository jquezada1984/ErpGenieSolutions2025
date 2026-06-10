import { Resolver, Query, Args } from '@nestjs/graphql';
import { CuentaDefectoConfigItem } from '../dto/cuenta-defecto-config.dto';
import { CuentaContableDefectoService } from '../services/cuenta-contable-defecto.service';

@Resolver()
export class CuentaContableDefectoResolver {
  constructor(private readonly service: CuentaContableDefectoService) {}

  @Query(() => [CuentaDefectoConfigItem], { name: 'cuentasContablesDefecto' })
  async cuentasContablesDefecto(
    @Args('id_empresa', { type: () => String }) id_empresa: string,
  ): Promise<CuentaDefectoConfigItem[]> {
    return this.service.findCatalogoConValores(id_empresa);
  }
}
