import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { MediaDbService } from './services/media-db.service';

const IMAGE_MIMETYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
];

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly mediaDbService: MediaDbService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() request: Request) {
    if (!file) {
      throw new BadRequestException('Campo "file" obligatorio');
    }
    const mimetype = (file.mimetype || '').toLowerCase();
    const isImage =
      mimetype.startsWith('image/') || IMAGE_MIMETYPES.includes(mimetype);
    const isPDF = mimetype === 'application/pdf';

    if (!isImage && !isPDF) {
      throw new BadRequestException(
        'Solo se aceptan archivos de tipo imagen o PDF (image/*, application/pdf)',
      );
    }
    const raw =
      request.headers['x-company-id'] ?? request.headers['X-Company-Id'];
    const fromHeader = Array.isArray(raw) ? raw[0] : raw;
    const companyId =
      typeof fromHeader === 'string' && fromHeader.trim()
        ? fromHeader.trim()
        : 'default';

    return this.mediaService.saveUpload(file, {
      company_id: companyId,
    });
  }

  @Post('metadata')
  async guardarMetadata(@Body() body: any) {
    return this.mediaDbService.guardarMedia(body);
  }

  @Get()
  async listarPorModulo(
    @Query('module') module: string,
    @Query('module_id') module_id: string,
    @Req() request: Request,
    @Query('directorio_id') directorio_id?: string,
  ) {
    const m = typeof module === 'string' ? module.trim() : '';
    const mid = typeof module_id === 'string' ? module_id.trim() : '';
    const did = typeof directorio_id === 'string' ? directorio_id.trim() : undefined;
    if (!m || !mid) {
      throw new BadRequestException('module y module_id son obligatorios');
    }
    const raw =
      request.headers['x-company-id'] ?? request.headers['X-Company-Id'];
    const fromHeader = Array.isArray(raw) ? raw[0] : raw;
    const companyId =
      typeof fromHeader === 'string' && fromHeader.trim()
        ? fromHeader.trim()
        : undefined;

    return this.mediaDbService.obtenerMediaPorModulo(m, mid, did, companyId);
  }

  @Get('principal/:module/:module_id')
  async obtenerPrincipal(
    @Param('module') module: string,
    @Param('module_id') module_id: string,
  ) {
    const media = await this.mediaDbService.obtenerPrincipal(module, module_id);

    if (!media) return null;

    return {
      url: media.url,
      filename: media.filename,
      mimetype: media.mimetype,
      size: media.size,
    };
  }

  @Delete(':id_media')
  async eliminarLogico(@Param('id_media') id_media: string) {
    const id = typeof id_media === 'string' ? id_media.trim() : '';
    if (!id) {
      throw new BadRequestException('id_media es obligatorio');
    }
    await this.mediaDbService.eliminarLogico(id);
    return { success: true };
  }

  @Patch(':id_media')
  async actualizar(
    @Param('id_media') id_media: string,
    @Body() body: { estado_archivo?: string; es_principal?: boolean },
  ) {
    const id = typeof id_media === 'string' ? id_media.trim() : '';
    if (!id) {
      throw new BadRequestException('id_media es obligatorio');
    }
    return this.mediaDbService.actualizarMedia(id, body);
  }
}
