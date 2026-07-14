import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { MovimientoBancario } from './entities/movimiento-bancario.entity';
import { MovimientoBancarioService } from './movimiento-bancario.service';

@Resolver(() => MovimientoBancario)
export class MovimientoBancarioResolver {
  constructor(private readonly movimientoService: MovimientoBancarioService) {}

  @Query(() => [MovimientoBancario], { name: 'movimientosBancarios' })
  movimientosBancarios(
    @Args('id_cuenta_bancaria', { type: () => ID }) id_cuenta_bancaria: string,
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
    @Args('soloActivos', { type: () => Boolean, nullable: true }) soloActivos?: boolean,
  ) {
    return this.movimientoService.findByCuenta(
      id_cuenta_bancaria,
      id_empresa ?? undefined,
      soloActivos !== false,
    );
  }

  @Query(() => MovimientoBancario, { name: 'movimientoBancario' })
  movimientoBancario(
    @Args('id_movimiento_bancario', { type: () => ID }) id_movimiento_bancario: string,
  ) {
    return this.movimientoService.findOne(id_movimiento_bancario);
  }
}
