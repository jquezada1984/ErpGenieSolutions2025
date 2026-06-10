import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { CuentasIndividualesPaginadas } from '../dto/cuenta-individual.dto';
import { CuentaIndividualService } from '../services/cuenta-individual.service';

@Resolver()
export class CuentaIndividualResolver {
  constructor(private readonly service: CuentaIndividualService) {}

  @Query(() => CuentasIndividualesPaginadas, { name: 'cuentasIndividualesLibroAuxiliar' })
  async cuentasIndividualesLibroAuxiliar(
    @Args('id_empresa', { type: () => String }) id_empresa: string,
    @Args('tipo', { type: () => String, nullable: true }) tipo?: string,
    @Args('busqueda', { type: () => String, nullable: true }) busqueda?: string,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 }) limit?: number,
  ): Promise<CuentasIndividualesPaginadas> {
    return this.service.listar(id_empresa, tipo, busqueda, page, limit);
  }
}
