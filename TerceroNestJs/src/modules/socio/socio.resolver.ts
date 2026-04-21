import { Args, Field, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { SocioService, TerceroDisponibleSocio } from './socio.service';
import { RolSocio } from './entities/rol-socio.entity';

@ObjectType()
class TerceroDisponibleSocioGql {
  @Field()
  id_tercero: string;

  @Field()
  nombre: string;
}

@Resolver()
export class SocioResolver {
  constructor(private readonly socioService: SocioService) {}

  @Query(() => [RolSocio], { name: 'rolesSocio' })
  rolesSocio(): Promise<RolSocio[]> {
    return this.socioService.findRolesSocio();
  }

  @Query(() => [TerceroDisponibleSocioGql], { name: 'tercerosDisponiblesParaSocio' })
  tercerosDisponiblesParaSocio(
    @Args('id_empresa', { type: () => String }) id_empresa: string,
    @Args('id_socio', { type: () => String, nullable: true }) id_socio?: string | null,
  ): Promise<TerceroDisponibleSocio[]> {
    return this.socioService.findTercerosDisponiblesParaSocio(id_empresa, id_socio ?? null);
  }
}
