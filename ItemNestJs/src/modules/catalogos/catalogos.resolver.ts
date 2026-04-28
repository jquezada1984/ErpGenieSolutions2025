import { Resolver, Query } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoVentaItem } from './entities/estado-venta-item.entity';
import { EstadoCompraItem } from './entities/estado-compra-item.entity';
import { NaturalezaItem } from './entities/naturaleza-item.entity';
import { TipoControlInventarioItem } from './entities/tipo-control-inventario-item.entity';
import { TipoControlCaducidadItem } from './entities/tipo-control-caducidad-item.entity';
import { TipoComportamientoItem } from './entities/tipo-comportamiento-item.entity';

@Resolver()
export class CatalogosResolver {
  constructor(
    @InjectRepository(EstadoVentaItem)
    private readonly estadoVentaItemRepo: Repository<EstadoVentaItem>,
    @InjectRepository(EstadoCompraItem)
    private readonly estadoCompraItemRepo: Repository<EstadoCompraItem>,
    @InjectRepository(NaturalezaItem)
    private readonly naturalezaItemRepo: Repository<NaturalezaItem>,
    @InjectRepository(TipoControlInventarioItem)
    private readonly tipoControlInventarioItemRepo: Repository<TipoControlInventarioItem>,
    @InjectRepository(TipoControlCaducidadItem)
    private readonly tipoControlCaducidadItemRepo: Repository<TipoControlCaducidadItem>,
    @InjectRepository(TipoComportamientoItem)
    private readonly tipoComportamientoItemRepo: Repository<TipoComportamientoItem>,
  ) {}

  @Query(() => [EstadoVentaItem], { name: 'estadosVentaItem' })
  async findAllEstadosVentaItem(): Promise<EstadoVentaItem[]> {
    return this.estadoVentaItemRepo.find({
      where: { estado: true },
      order: { orden: 'ASC' },
    });
  }

  @Query(() => [EstadoCompraItem], { name: 'estadosCompraItem' })
  async findAllEstadosCompraItem(): Promise<EstadoCompraItem[]> {
    return this.estadoCompraItemRepo.find({
      where: { estado: true },
      order: { orden: 'ASC' },
    });
  }

  @Query(() => [NaturalezaItem], { name: 'naturalezasItem' })
  async findAllNaturalezasItem(): Promise<NaturalezaItem[]> {
    return this.naturalezaItemRepo.find({
      where: { estado: true },
      order: { orden: 'ASC' },
    });
  }

  @Query(() => [TipoControlInventarioItem], { name: 'tiposControlInventarioItem' })
  async findAllTiposControlInventarioItem(): Promise<TipoControlInventarioItem[]> {
    return this.tipoControlInventarioItemRepo.find({
      where: { estado: true },
      order: { orden: 'ASC' },
    });
  }

  @Query(() => [TipoControlCaducidadItem], { name: 'tiposControlCaducidadItem' })
  async findAllTiposControlCaducidadItem(): Promise<TipoControlCaducidadItem[]> {
    return this.tipoControlCaducidadItemRepo.find({
      where: { estado: true },
      order: { orden: 'ASC' },
    });
  }

  @Query(() => [TipoComportamientoItem], { name: 'tiposComportamientoItem' })
  async findAllTiposComportamientoItem(): Promise<TipoComportamientoItem[]> {
    return this.tipoComportamientoItemRepo.find({
      where: { estado: true },
      // Alineado con InicioNestJs TipoItemCatalogoService.findActivosOrdenados (orden + nombre).
      order: { orden: 'ASC', nombre: 'ASC' },
    });
  }
}
