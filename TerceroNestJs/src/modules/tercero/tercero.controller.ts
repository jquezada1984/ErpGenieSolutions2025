import { Controller, Get } from '@nestjs/common';
import { TerceroService } from './tercero.service';

@Controller('tercero')
export class TerceroController {
  constructor(private readonly terceroService: TerceroService) {}

  @Get('health')
  health() {
    return { status: 'ok', module: 'tercero' };
  }

  @Get()
  list() {
    return this.terceroService.findAll();
  }
}
