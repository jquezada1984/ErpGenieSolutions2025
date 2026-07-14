import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Banco } from './entities/banco.entity';
import { BancoService } from './banco.service';

@Resolver(() => Banco)
export class BancoResolver {
  constructor(private readonly bancoService: BancoService) {}

  @Query(() => [Banco], { name: 'bancos' })
  bancos(
    @Args('soloActivos', { type: () => Boolean, nullable: true, defaultValue: true })
    soloActivos: boolean,
  ) {
    return this.bancoService.findAll(soloActivos);
  }

  @Query(() => Banco, { name: 'banco' })
  banco(@Args('id_banco', { type: () => ID }) id_banco: string) {
    return this.bancoService.findOne(id_banco);
  }
}
