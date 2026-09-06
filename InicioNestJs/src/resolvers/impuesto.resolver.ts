import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Impuesto } from '../entities/impuesto.entity';
import { ImpuestoService } from '../services/impuesto.service';

@Resolver(() => Impuesto)
export class ImpuestoResolver {
  constructor(private readonly impuestoService: ImpuestoService) {}

  @Query(() => [Impuesto], { name: 'impuestos' })
  async getImpuestos(
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
    @Args('solo_activos', { type: () => Boolean, nullable: true }) solo_activos?: boolean,
  ): Promise<Impuesto[]> {
    if (!id_empresa) {
      return [];
    }
    return this.impuestoService.findAll({
      id_empresa,
      solo_activos: solo_activos !== false,
    });
  }
}
