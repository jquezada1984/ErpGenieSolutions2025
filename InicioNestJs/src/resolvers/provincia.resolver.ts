import { Resolver, Query, Args } from '@nestjs/graphql';
import { Provincia } from '../entities/provincia.entity';
import { ProvinciaService } from '../services/provincia.service';

@Resolver(() => Provincia)
export class ProvinciaResolver {
  constructor(private readonly provinciaService: ProvinciaService) {}

  @Query(() => [Provincia], { name: 'provincias' })
  async getProvincias(): Promise<Provincia[]> {
    return this.provinciaService.findAll();
  }

  @Query(() => [Provincia], { name: 'provinciasByPais' })
  async getProvinciasByPais(@Args('idPais') idPais: string): Promise<Provincia[]> {
    return this.provinciaService.findByPais(idPais);
  }
} 