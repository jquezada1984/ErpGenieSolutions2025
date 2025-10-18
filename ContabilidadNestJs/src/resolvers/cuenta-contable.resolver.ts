import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CuentaContable } from '../entities/cuenta-contable.entity';
import { CuentaContableService } from '../services/cuenta-contable.service';

@Resolver(() => CuentaContable)
export class CuentaContableResolver {
  constructor(private readonly cuentaContableService: CuentaContableService) {}

  @Query(() => [CuentaContable])
  async cuentasContables(): Promise<CuentaContable[]> {
    return this.cuentaContableService.findAll();
  }

  @Query(() => CuentaContable, { nullable: true })
  async cuentaContable(@Args('id', { type: () => Int }) id: number): Promise<CuentaContable> {
    return this.cuentaContableService.findOne(id);
  }

  @Query(() => [CuentaContable])
  async cuentasContablesPorTipo(@Args('tipo') tipo: string): Promise<CuentaContable[]> {
    return this.cuentaContableService.findByTipo(tipo);
  }

  @Mutation(() => CuentaContable)
  async crearCuentaContable(
    @Args('codigo') codigo: string,
    @Args('nombre') nombre: string,
    @Args('tipo') tipo: string,
    @Args('naturaleza') naturaleza: string,
    @Args('descripcion', { nullable: true }) descripcion?: string,
    @Args('cuentaPadreId', { type: () => Int, nullable: true }) cuentaPadreId?: number,
  ): Promise<CuentaContable> {
    return this.cuentaContableService.create({
      codigo,
      nombre,
      descripcion,
      tipo,
      naturaleza,
      cuenta_padre_id: cuentaPadreId,
    });
  }
}
