import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguracionContabilidad } from '../entities/configuracion-contabilidad.entity';

@Injectable()
export class ConfiguracionContabilidadService {
  constructor(
    @InjectRepository(ConfiguracionContabilidad)
    private configuracionRepository: Repository<ConfiguracionContabilidad>,
  ) {}

  async findAll(): Promise<ConfiguracionContabilidad[]> {
    return this.configuracionRepository.find();
  }

  async findOne(id: number): Promise<ConfiguracionContabilidad> {
    return this.configuracionRepository.findOne({ where: { id } });
  }

  async findByEmpresa(empresaId: number): Promise<ConfiguracionContabilidad | null> {
    return this.configuracionRepository.findOne({ where: { empresa_id: empresaId } });
  }
}
