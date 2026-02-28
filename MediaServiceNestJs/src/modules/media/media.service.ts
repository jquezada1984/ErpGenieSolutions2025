import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
  private getUploadDir(): string {
    const base = process.env.UPLOAD_DIR || './uploads';
    return path.resolve(path.join(base, 'terceros'));
  }

  private getPublicBaseUrl(): string {
    const base = process.env.PUBLIC_BASE_URL;
    if (base) return base.replace(/\/$/, '');
    const port = process.env.PORT || 3010;
    return `http://localhost:${port}`;
  }

  private getExtension(mimetype: string, originalname?: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'image/bmp': 'bmp',
    };
    const ext = mimeToExt[mimetype?.toLowerCase()];
    if (ext) return ext;
    if (originalname) {
      const last = originalname.split('.').pop();
      if (last && last.length <= 5) return last;
    }
    return 'jpg';
  }

  async saveUpload(file: Express.Multer.File): Promise<{ url: string; filename: string; mimetype: string; size: number }> {
    const dir = this.getUploadDir();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const ext = this.getExtension(file.mimetype, file.originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const filepath = path.join(dir, filename);

    fs.writeFileSync(filepath, file.buffer);

    const publicBase = this.getPublicBaseUrl();
    const url = `${publicBase}/uploads/terceros/${filename}`;

    return {
      url,
      filename,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
