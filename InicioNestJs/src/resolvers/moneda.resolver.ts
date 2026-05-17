import { Args, Query, Resolver } from '@nestjs/graphql';
import { Moneda } from '../entities/moneda.entity';
import { MonedaService } from '../services/moneda.service';

@Resolver(() => Moneda)
export class MonedaResolver {
  constructor(private readonly monedaService: MonedaService) {}

  @Query(() => [Moneda], { name: 'monedas' })
  async getMonedas(
    @Args('soloActivos', { type: () => Boolean, nullable: true, defaultValue: true })
    soloActivos?: boolean,
  ): Promise<Moneda[]> {
    return this.monedaService.findAll(soloActivos !== false);
  }
} 