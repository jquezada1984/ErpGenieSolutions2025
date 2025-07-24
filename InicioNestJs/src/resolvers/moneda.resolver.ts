import { Resolver, Query } from '@nestjs/graphql';
import { Moneda } from '../entities/moneda.entity';
import { MonedaService } from '../services/moneda.service';

@Resolver(() => Moneda)
export class MonedaResolver {
  constructor(private readonly monedaService: MonedaService) {}

  @Query(() => [Moneda], { name: 'monedas' })
  async getMonedas(): Promise<Moneda[]> {
    return this.monedaService.findAll();
  }
} 