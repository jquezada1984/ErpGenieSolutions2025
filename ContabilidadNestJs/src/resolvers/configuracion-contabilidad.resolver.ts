import { Resolver, Query, Args } from '@nestjs/graphql';
import { ConfiguracionContabilidad } from '../entities/configuracion-contabilidad.entity';
import { ConfiguracionContabilidadService } from '../services/configuracion-contabilidad.service';

@Resolver(() => ConfiguracionContabilidad)
export class ConfiguracionContabilidadResolver {
  constructor(private readonly configuracionService: ConfiguracionContabilidadService) {}

  @Query(() => ConfiguracionContabilidad)
  async configuracionContabilidad(
    @Args('id_empresa') id_empresa: string,
  ): Promise<ConfiguracionContabilidad> {
    return this.configuracionService.obtenerPorEmpresa(id_empresa);
  }
}
