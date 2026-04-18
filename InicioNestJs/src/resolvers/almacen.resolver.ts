import { Resolver, Query } from '@nestjs/graphql';
import { Almacen } from '../entities/almacen.entity';
import { AlmacenService } from '../services/almacen.service';

@Resolver(() => Almacen)
export class AlmacenResolver {
  constructor(private readonly almacenService: AlmacenService) {}

  @Query(() => [Almacen], { name: 'almacenes' })
  async getAlmacenes(): Promise<Almacen[]> {
    return this.almacenService.findAll();
  }
}
