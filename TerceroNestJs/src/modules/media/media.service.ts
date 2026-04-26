import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  async obtenerLogoPrincipal(module: string, module_id: string): Promise<string | null> {
    const url = `http://media-service:3010/media/principal/${module}/${module_id}`;

    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const data = await response.json();
      return data?.url ?? null;
    } catch (error) {
      console.error('Error obteniendo media:', error);
      return null;
    }
  }
}

