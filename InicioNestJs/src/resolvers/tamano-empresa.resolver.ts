import { Resolver, Query } from '@nestjs/graphql';
import { TamanoEmpresa } from '../entities/tamano-empresa.entity';
import { TamanoEmpresaService } from '../services/tamano-empresa.service';

@Resolver(() => TamanoEmpresa)
export class TamanoEmpresaResolver {
  constructor(private readonly tamanoEmpresaService: TamanoEmpresaService) {}

  @Query(() => [TamanoEmpresa], { name: 'tamanosEmpresa' })
  async getTamanosEmpresa(): Promise<TamanoEmpresa[]> {
    return this.tamanoEmpresaService.findAll();
  }
}
