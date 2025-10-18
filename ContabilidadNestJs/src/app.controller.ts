import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'ok',
      service: 'ContabilidadNestJs',
      timestamp: new Date().toISOString(),
      port: process.env.PORT || 3004
    };
  }
}
