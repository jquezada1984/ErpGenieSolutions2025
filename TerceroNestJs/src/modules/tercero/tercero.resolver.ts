import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Tercero } from './entities/tercero.entity';
import { TerceroService } from './tercero.service';
import { CreateTerceroInput } from './dto/create-tercero.dto';
import { UpdateTerceroInput } from './dto/update-tercero.dto';

const TIPO_TERCERO_REPRESENTANTE_ID = 'ab5f5dac-d03c-42b1-92bb-97131765f213';

@Resolver(() => Tercero)
export class TerceroResolver {
  constructor(private readonly terceroService: TerceroService) {}

  @Query(() => [Tercero], { name: 'terceros' })
  findAll(
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string | null,
  ): Promise<Tercero[]> {
    return this.terceroService.findAll(id_empresa ?? undefined);
  }

  @Query(() => [Tercero], { name: 'clientes' })
  findClientes(
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string | null,
  ): Promise<Tercero[]> {
    return this.terceroService.findClientes(id_empresa ?? undefined);
  }

  @Query(() => Tercero, { name: 'tercero' })
  findOne(@Args('id_tercero') id_tercero: string): Promise<Tercero> {
    return this.terceroService.findOne(id_tercero);
  }

  @Query(() => [Tercero], { name: 'representantesPorEmpresa' })
  representantesPorEmpresa(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
  ): Promise<Tercero[]> {
    return this.terceroService.findRepresentantesPorEmpresa(id_empresa);
  }

  @Mutation(() => Tercero, { name: 'createTercero' })
  create(@Args('input') input: CreateTerceroInput): Promise<Tercero> {
    return this.terceroService.create(input);
  }

  @Mutation(() => Tercero, { name: 'updateTercero' })
  update(@Args('input') input: UpdateTerceroInput): Promise<Tercero> {
    return this.terceroService.update(input);
  }

  @Mutation(() => Boolean, { name: 'removeTercero' })
  remove(@Args('id_tercero') id_tercero: string): Promise<boolean> {
    return this.terceroService.remove(id_tercero);
  }
}
