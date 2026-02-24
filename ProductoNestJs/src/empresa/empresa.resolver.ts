import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { EmpresaService } from './empresa.service';
import { Empresa } from './empresa.entity';

@Resolver(() => Empresa)
export class EmpresaResolver {
  constructor(private readonly empresaService: EmpresaService) {}

  @Query(() => [Empresa], { name: 'empresas' })
  async empresas(): Promise<Empresa[]> {
    return this.empresaService.listarEmpresas();
  }

  @Query(() => Empresa, { name: 'empresaById', nullable: true })
  async empresaById(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
  ): Promise<Empresa | null> {
    return this.empresaService.empresaById(id_empresa);
  }
}
