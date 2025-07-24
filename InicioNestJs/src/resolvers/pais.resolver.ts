import { Resolver, Query } from '@nestjs/graphql';
import { Pais } from '../entities/pais.entity';
import { PaisService } from '../services/pais.service';

@Resolver(() => Pais)
export class PaisResolver {
  constructor(private readonly paisService: PaisService) {}

  @Query(() => [Pais], { name: 'paises' })
  async getPaises(): Promise<Pais[]> {
    return this.paisService.findAll();
  }
} 