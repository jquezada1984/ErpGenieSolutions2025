import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Contacto } from './entities/contacto.entity';
import { ContactoService } from './contacto.service';
import { ContactoResolver } from './contacto.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Contacto])],
  providers: [ContactoService, ContactoResolver],
  exports: [ContactoService],
})
export class ContactoModule {}
