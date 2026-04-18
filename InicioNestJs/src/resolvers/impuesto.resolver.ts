import { Resolver, Query } from '@nestjs/graphql';
import { Impuesto } from '../entities/impuesto.entity';
import { ImpuestoService } from '../services/impuesto.service';

@Resolver(() => Impuesto)
export class ImpuestoResolver {
  constructor(private readonly impuestoService: ImpuestoService) {}

  @Query(() => [Impuesto], { name: 'impuestos' })
  async getImpuestos(): Promise<Impuesto[]> {
    return this.impuestoService.findAll();
  }
}
