import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';

import { Contacto } from './entities/contacto.entity';
import { CreateContactoInput } from './dto/create-contacto.dto';
import { UpdateContactoInput } from './dto/update-contacto.dto';

@Injectable()
export class ContactoService {
  constructor(
    @InjectRepository(Contacto)
    private readonly contactoRepo: Repository<Contacto>,
  ) {}

  async create(input: CreateContactoInput): Promise<Contacto> {
    const payload: DeepPartial<Contacto> = {
      ...input,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const entity = this.contactoRepo.create(payload);
    return this.contactoRepo.save(entity);
  }

  async findByTercero(id_tercero: string): Promise<Contacto[]> {
    return this.contactoRepo.find({
      where: { id_tercero, estado: true },
      relations: ['tercero'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id_contacto: string): Promise<Contacto> {
    const contacto = await this.contactoRepo.findOne({
      where: { id_contacto },
      relations: ['tercero'],
    });
    if (!contacto) throw new NotFoundException('Contacto no encontrado');
    return contacto;
  }

  async update(input: UpdateContactoInput): Promise<Contacto> {
    const current = await this.findOne(input.id_contacto);
    const merged: DeepPartial<Contacto> = {
      ...current,
      ...input,
      updated_at: new Date(),
    };
    await this.contactoRepo.save(merged);
    return this.findOne(input.id_contacto);
  }

  async remove(id_contacto: string): Promise<boolean> {
    const current = await this.findOne(id_contacto);
    current.estado = false;
    current.updated_at = new Date();
    await this.contactoRepo.save(current);
    return true;
  }
}
