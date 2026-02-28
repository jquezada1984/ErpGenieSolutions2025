import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

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
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Campo "file" obligatorio');
    }
    const mimetype = (file.mimetype || '').toLowerCase();
    const isImage = mimetype.startsWith('image/') || IMAGE_MIMETYPES.includes(mimetype);
    if (!isImage) {
      throw new BadRequestException('Solo se aceptan archivos de tipo imagen (image/*)');
    }
    return this.mediaService.saveUpload(file);
  }
}
