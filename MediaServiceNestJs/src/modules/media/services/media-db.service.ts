import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

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
  id_empresa?: string | null;
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
      id_empresa: data.id_empresa ?? null,

      // Estados controlados por la capa de persistencia
      estado: true,
      created_at: new Date(),
      updated_at: null,
    });

    let saved = await this.mediaRepository.save(media);

    try {
      const module = saved.module;
      const module_id = saved.module_id;
      const url = saved.url;

      const filename = url.split('/').pop();
      if (!filename) {
        return saved;
      }

      const base = path.resolve(process.env.UPLOAD_DIR || './uploads');
      const companyFolder =
        saved.id_empresa || data.id_empresa || 'default';
      const oldPath = path.join(base, companyFolder, 'general', 'global', filename);
      const newDir = path.join(base, companyFolder, module, module_id);
      const newPath = path.join(newDir, filename);

      if (!fs.existsSync(oldPath)) {
        return saved;
      }

      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
      }

      fs.renameSync(oldPath, newPath);

      const publicBase = process.env.PUBLIC_BASE_URL
        ? process.env.PUBLIC_BASE_URL.replace(/\/$/, '')
        : `http://localhost:${process.env.PORT || 3010}`;

      const newUrl = `${publicBase}/uploads/${companyFolder}/${module}/${module_id}/${filename}`;

      saved.url = newUrl;
      saved = await this.mediaRepository.save(saved);
    } catch {
      // Si falla el movimiento o la actualización de URL, no romper el flujo de metadata
    }

    return saved;
  }

  async obtenerMediaPorModulo(
    module: string,
    module_id: string,
    directorio_id?: string,
    companyId?: string,
  ): Promise<Media[]> {
    const where: any = {
      module,
      module_id,
      estado: true,
    };

    if (directorio_id) {
      where.id_directorio_documento = directorio_id;
    }

    if (companyId) {
      where.id_empresa = companyId;
    }

    return this.mediaRepository.find({
      where,
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

