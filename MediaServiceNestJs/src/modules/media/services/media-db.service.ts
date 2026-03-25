import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Media } from '../entities/media.entity';
import { DirectorioDocumento } from '../../directorio/entities/directorio-documento.entity';

export type GuardarMediaInput = {
  module: string;
  module_id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  tipo: string;
  es_principal?: boolean;
  estado_archivo?: string;
  id_directorio_documento?: string | null;
};

@Injectable()
export class MediaDbService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(DirectorioDocumento)
    private readonly directorioDocumentoRepository: Repository<DirectorioDocumento>,
  ) {}

  async guardarMedia(data: GuardarMediaInput): Promise<Media> {
    // Nota: MediaService ya maneja filesystem. Este servicio solo persiste en BD.
    const media = this.mediaRepository.create({
      module: data.module,
      module_id: data.module_id,
      url: data.url,
      filename: data.filename,
      mimetype: data.mimetype,
      size: data.size,
      tipo: data.tipo,
      es_principal: data.es_principal ?? false,
      estado_archivo: data.estado_archivo ?? 'ACTIVO',
      id_directorio_documento: data.id_directorio_documento ?? null,

      // Estados controlados por la capa de persistencia
      estado: true,
      created_at: new Date(),
      updated_at: null,
    });

    return this.mediaRepository.save(media);
  }

  async obtenerMediaPorModulo(module: string, module_id: string): Promise<Media[]> {
    return this.mediaRepository.find({
      where: { module, module_id, estado: true },
      order: { es_principal: 'DESC', created_at: 'DESC' },
    });
  }

  async obtenerPrincipal(module: string, module_id: string): Promise<Media | null> {
    return this.mediaRepository.findOne({
      where: { module, module_id, es_principal: true, estado: true },
    });
  }

  async eliminarLogico(id_media: string): Promise<void> {
    const media = await this.mediaRepository.findOne({ where: { id_media } });
    if (!media) return;

    media.estado = false;
    media.updated_at = new Date();
    await this.mediaRepository.save(media);
  }
}

