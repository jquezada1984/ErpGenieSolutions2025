import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ConfiguracionContabilidad } from '../entities/configuracion-contabilidad.entity';
import { ConfiguracionContabilidadService } from '../services/configuracion-contabilidad.service';

@Resolver(() => ConfiguracionContabilidad)
export class ConfiguracionContabilidadResolver {
  constructor(private readonly configuracionService: ConfiguracionContabilidadService) {}

  @Query(() => [ConfiguracionContabilidad])
  async configuracionesContabilidad(): Promise<ConfiguracionContabilidad[]> {
    return this.configuracionService.findAll();
  }

  @Query(() => ConfiguracionContabilidad, { nullable: true })
  async configuracionContabilidad(@Args('id', { type: () => Int }) id: number): Promise<ConfiguracionContabilidad> {
    return this.configuracionService.findOne(id);
  }

  @Query(() => ConfiguracionContabilidad, { nullable: true })
  async configuracionContabilidadPorEmpresa(
    @Args('empresaId', { type: () => Int }) empresaId: number,
  ): Promise<ConfiguracionContabilidad> {
    return this.configuracionService.findByEmpresa(empresaId);
  }
}
