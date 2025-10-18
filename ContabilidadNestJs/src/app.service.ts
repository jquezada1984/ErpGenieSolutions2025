import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '¡Hola! Servicio de Contabilidad NestJS funcionando correctamente';
  }
}
