import { Resolver, Query } from '@nestjs/graphql';
import { CuentaContable } from '../entities/cuenta-contable.entity';
import { CuentaContableService } from '../services/cuenta-contable.service';

/** Mismo patrón que `CatalogosPagoResolver`: catálogo solo-lectura en raíz `Query`. */
@Resolver()
export class CuentaContableResolver {
  constructor(private readonly cuentaContableService: CuentaContableService) {}

  @Query(() => [CuentaContable], { name: 'cuentasContables' })
  async cuentasContables(): Promise<CuentaContable[]> {
    return this.cuentaContableService.findCatalogo();
  }
}
