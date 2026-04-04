import { Controller, Get, Post, Query, Body, BadRequestException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Request } from 'express';
import { DirectorioDocumento } from './entities/directorio-documento.entity';

function companyIdFromRequest(request: Request): string | null {
  const raw =
    request.headers['x-company-id'] ?? request.headers['X-Company-Id'];
  const fromHeader = Array.isArray(raw) ? raw[0] : raw;
  return typeof fromHeader === 'string' && fromHeader.trim()
    ? fromHeader.trim()
    : null;
}

@Controller('directorio')
export class DirectorioController {
  constructor(
    @InjectRepository(DirectorioDocumento)
    private readonly repo: Repository<DirectorioDocumento>,
  ) {}

  @Get()
  async listar(@Query('module') module: string, @Req() request: Request) {
    const companyId = companyIdFromRequest(request);
    return this.repo.find({
      where: {
        modulo: module,
        estado: true,
        ...(companyId ? { id_empresa: companyId } : {}),
      },
      order: {
        orden: 'ASC',
      },
    });
  }

  @Post()
  async crear(@Body() body: any, @Req() request: Request) {
    const { nombre, modulo, id_directorio_padre = null } = body;

    if (!nombre || !modulo) {
      throw new BadRequestException('nombre y modulo son requeridos');
    }

    const companyId = companyIdFromRequest(request);

    const nuevo = this.repo.create({
      nombre: String(nombre).trim(),
      modulo: String(modulo).trim(),
      id_empresa: companyId || null,
      orden: 1,
      estado: true,
      created_at: new Date(),
      ...(id_directorio_padre
        ? {
            padre: {
              id_directorio_documento: id_directorio_padre,
            } as DirectorioDocumento,
          }
        : {}),
    });

    return this.repo.save(nuevo);
  }
}
