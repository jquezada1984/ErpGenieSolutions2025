import { Controller, Get, Query } from '@nestjs/common';
import { SelectsService } from '../catalogos/selects.service';

@Controller('selects')
export class SelectsController {
  constructor(private readonly selectsService: SelectsService) {}

  @Get('paises')
  paises() {
    return this.selectsService.paises();
  }

  @Get('provincias')
  provincias(@Query('id_pais') idPais: string) {
    return this.selectsService.provincias(idPais);
  }

  @Get('impuestos')
  impuestos() {
    return this.selectsService.impuestos();
  }

  @Get('cuentas-contables')
  cuentasContables() {
    return this.selectsService.cuentasContables();
  }
}
