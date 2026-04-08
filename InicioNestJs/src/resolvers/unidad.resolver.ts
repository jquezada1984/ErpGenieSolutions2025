import { Resolver, Query, Args } from '@nestjs/graphql';
import { Unidad } from '../entities/unidad.entity';
import { TipoUnidad } from '../entities/tipo-unidad.entity';
import { UnidadService } from '../services/unidad.service';

@Resolver()
export class UnidadResolver {
  constructor(private readonly unidadService: UnidadService) {}

  @Query(() => [TipoUnidad], { name: 'tiposUnidad' })
  async getTiposUnidad(): Promise<TipoUnidad[]> {
    return this.unidadService.listarTiposUnidad();
  }

  @Query(() => [Unidad], { name: 'unidades' })
  async getUnidades(
    @Args('tipoCodigo', { type: () => String, nullable: true }) tipoCodigo?: string,
  ): Promise<Unidad[]> {
    return this.unidadService.listarUnidades(tipoCodigo);
  }
}
