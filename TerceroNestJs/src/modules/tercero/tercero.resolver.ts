import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Tercero } from './entities/tercero.entity';
import { TerceroService } from './tercero.service';
import { CreateTerceroInput } from './dto/create-tercero.dto';
import { UpdateTerceroInput } from './dto/update-tercero.dto';

@Resolver(() => Tercero)
export class TerceroResolver {
  constructor(private readonly terceroService: TerceroService) {}

  @Query(() => [Tercero], { name: 'terceros' })
  findAll(): Promise<Tercero[]> {
    return this.terceroService.findAll();
  }

  @Query(() => [Tercero], { name: 'clientes' })
  findClientes(): Promise<Tercero[]> {
    return this.terceroService.findClientes();
  }

  @Query(() => Tercero, { name: 'tercero' })
  findOne(@Args('id_tercero') id_tercero: string): Promise<Tercero> {
    return this.terceroService.findOne(id_tercero);
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
