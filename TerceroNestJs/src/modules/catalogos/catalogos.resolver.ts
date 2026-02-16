import { Resolver, Query } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoTercero } from './entities/tipo-tercero.entity';
import { CondicionPago } from './entities/condicion-pago.entity';
import { FormaPago } from './entities/forma-pago.entity';
import { Incoterm } from './entities/incoterm.entity';
import { Pais } from './entities/pais.entity';
import { Empresa } from '../empresa/entities/empresa.entity';

@Resolver()
export class CatalogosResolver {
  constructor(
    @InjectRepository(TipoTercero)
    private readonly tipoTerceroRepo: Repository<TipoTercero>,
    @InjectRepository(CondicionPago)
    private readonly condicionPagoRepo: Repository<CondicionPago>,
    @InjectRepository(FormaPago)
    private readonly formaPagoRepo: Repository<FormaPago>,
    @InjectRepository(Incoterm)
    private readonly incotermRepo: Repository<Incoterm>,
    @InjectRepository(Pais)
    private readonly paisRepo: Repository<Pais>,
    @InjectRepository(Empresa)
    private readonly empresaRepo: Repository<Empresa>,
  ) {}

  @Query(() => [TipoTercero], { name: 'tiposTercero' })
  async findAllTiposTercero(): Promise<TipoTercero[]> {
    return this.tipoTerceroRepo.find({
      order: { nombre: 'ASC' },
    });
  }

  @Query(() => [CondicionPago], { name: 'condicionesPago' })
  async findAllCondicionesPago(): Promise<CondicionPago[]> {
    try {
      console.log('🔍 CatalogosResolver.findAllCondicionesPago - Iniciando consulta...');
      const condiciones = await this.condicionPagoRepo.find({
        order: { descripcion: 'ASC' },
      });
      console.log('✅ CatalogosResolver.findAllCondicionesPago - Condiciones encontradas:', condiciones.length);
      return condiciones;
    } catch (error) {
      console.error('❌ CatalogosResolver.findAllCondicionesPago - Error:', error);
      throw error;
    }
  }

  @Query(() => [FormaPago], { name: 'formasPago' })
  async findAllFormasPago(): Promise<FormaPago[]> {
    try {
      console.log('🔍 CatalogosResolver.findAllFormasPago - Iniciando consulta...');
      const formas = await this.formaPagoRepo.find({
        order: { descripcion: 'ASC' },
      });
      console.log('✅ CatalogosResolver.findAllFormasPago - Formas encontradas:', formas.length);
      return formas;
    } catch (error) {
      console.error('❌ CatalogosResolver.findAllFormasPago - Error:', error);
      throw error;
    }
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

  @Query(() => [Pais], { name: 'paises' })
  async findAllPaises(): Promise<Pais[]> {
    try {
      console.log('🔍 CatalogosResolver.findAllPaises - Iniciando consulta...');
      const paises = await this.paisRepo.find({
        order: { nombre: 'ASC' },
      });
      console.log('✅ CatalogosResolver.findAllPaises - Países encontrados:', paises.length);
      return paises;
    } catch (error) {
      console.error('❌ CatalogosResolver.findAllPaises - Error:', error);
      throw error;
    }
  }

  @Query(() => [Empresa], { name: 'empresas' })
  async findAllEmpresas(): Promise<Empresa[]> {
    try {
      console.log('🔍 CatalogosResolver.findAllEmpresas - Iniciando consulta...');
      const empresas = await this.empresaRepo.find({
        where: { estado: true },
        order: { nombre: 'ASC' },
      });
      console.log('✅ CatalogosResolver.findAllEmpresas - Empresas encontradas:', empresas.length);
      return empresas;
    } catch (error) {
      console.error('❌ CatalogosResolver.findAllEmpresas - Error:', error);
      throw error;
    }
  }
}

