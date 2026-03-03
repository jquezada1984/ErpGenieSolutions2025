import { Resolver, Query } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoTercero } from './entities/tipo-tercero.entity';
import { Incoterm } from './entities/incoterm.entity';

@Resolver()
export class CatalogosResolver {
  constructor(
    @InjectRepository(TipoTercero)
    private readonly tipoTerceroRepo: Repository<TipoTercero>,
    @InjectRepository(Incoterm)
    private readonly incotermRepo: Repository<Incoterm>,
  ) {}

  @Query(() => [TipoTercero], { name: 'tiposTercero' })
  async findAllTiposTercero(): Promise<TipoTercero[]> {
    return this.tipoTerceroRepo.find({
      order: { nombre: 'ASC' },
    });
  }

  @Query(() => [Incoterm], { name: 'incoterms' })
  async findAllIncoterms(): Promise<Incoterm[]> {
    try {
      console.log('🔍 CatalogosResolver.findAllIncoterms - Iniciando consulta...');
      const incoterms = await this.incotermRepo.find({
        order: { codigo: 'ASC' },
      });
      console.log('✅ CatalogosResolver.findAllIncoterms - Incoterms encontrados:', incoterms.length);
      return incoterms;
    } catch (error) {
      console.error('❌ CatalogosResolver.findAllIncoterms - Error:', error);
      throw error;
    }
  }
}

