import { Args, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormatoPapel } from '../entities/formato-papel.entity';

@Resolver(() => FormatoPapel)
export class FormatoPapelResolver {
  constructor(
    @InjectRepository(FormatoPapel)
    private readonly repo: Repository<FormatoPapel>,
  ) {}

  @Query(() => [FormatoPapel], { name: 'formatosPapel' })
  formatosPapel(
    @Args('soloActivos', { type: () => Boolean, nullable: true, defaultValue: true })
    soloActivos?: boolean,
  ): Promise<FormatoPapel[]> {
    const where = soloActivos === false ? {} : { activo: true };
    return this.repo.find({
      where,
      order: { orden: 'ASC', codigo: 'ASC' },
    });
  }
}
