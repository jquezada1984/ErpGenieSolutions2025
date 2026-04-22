import { Args, Field, ID, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { SocioService, TerceroDisponibleSocio } from './socio.service';
import { RolSocio } from './entities/rol-socio.entity';
import { Socio } from './entities/socio.entity';
import { Context } from '@nestjs/graphql';

@ObjectType()
class TerceroDisponibleSocioGql {
  @Field()
  id_tercero: string;

  @Field()
  nombre: string;
}

@Resolver(() => Socio)
export class SocioResolver {
  constructor(private readonly socioService: SocioService) {}

  @Query(() => [RolSocio], { name: 'rolesSocio' })
  rolesSocio(): Promise<RolSocio[]> {
    return this.socioService.findRolesSocio();
  }

  @Query(() => [Socio], { name: 'socios' })
  socios(@Context() context): Promise<Socio[]> {
    const id_empresa =
      context?.req?.headers?.['x-company-id'] ||
      context?.req?.headers?.['X-Company-Id'];
  
    if (!id_empresa) {
      throw new Error('Se requiere X-Company-Id en el header');
    }
  
    return this.socioService.findAllSocios(id_empresa);
  }

  @Query(() => Socio, { name: 'socio' })
  socio(
    @Args('id_socio', { type: () => ID }) id_socio: string,
  ): Promise<Socio | null> {
    return this.socioService.findOneSocio(id_socio);
  }

  @Query(() => [TerceroDisponibleSocioGql], { name: 'tercerosDisponiblesParaSocio' })
  tercerosDisponiblesParaSocio(
    @Args('id_empresa', { type: () => String }) id_empresa: string,
    @Args('id_socio', { type: () => String, nullable: true }) id_socio?: string | null,
  ): Promise<TerceroDisponibleSocio[]> {
    return this.socioService.findTercerosDisponiblesParaSocio(id_empresa, id_socio ?? null);
  }
}
