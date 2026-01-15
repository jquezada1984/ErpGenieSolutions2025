import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { LibroMayor } from '../entities/libro-mayor.entity';
import { LibroMayorService } from '../services/libro-mayor.service';

@Resolver(() => LibroMayor)
export class LibroMayorResolver {
  constructor(private readonly libroMayorService: LibroMayorService) {}

  @Query(() => [LibroMayor])
  async librosMayores(): Promise<LibroMayor[]> {
    return this.libroMayorService.findAll();
  }

  @Query(() => LibroMayor, { nullable: true })
  async libroMayor(@Args('id', { type: () => Int }) id: number): Promise<LibroMayor> {
    return this.libroMayorService.findOne(id);
  }

  @Query(() => [LibroMayor])
  async librosMayoresPorCuenta(
    @Args('cuentaContableId', { type: () => Int }) cuentaContableId: number,
  ): Promise<LibroMayor[]> {
    return this.libroMayorService.findByCuenta(cuentaContableId);
  }

  @Query(() => [LibroMayor])
  async librosMayoresPorPeriodo(
    @Args('periodoContableId', { type: () => Int }) periodoContableId: number,
  ): Promise<LibroMayor[]> {
    return this.libroMayorService.findByPeriodo(periodoContableId);
  }

  @Query(() => LibroMayor, { nullable: true })
  async libroMayorPorCuentaYPeriodo(
    @Args('cuentaContableId', { type: () => Int }) cuentaContableId: number,
    @Args('periodoContableId', { type: () => Int }) periodoContableId: number,
  ): Promise<LibroMayor> {
    return this.libroMayorService.findByCuentaYPeriodo(cuentaContableId, periodoContableId);
  }
}
