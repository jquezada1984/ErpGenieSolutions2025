
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tercero } from './entities/tercero.entity';
import { TerceroService } from './tercero.service';
import { TerceroController } from './tercero.controller';
import { TerceroResolver } from './tercero.resolver';
import { ContactoModule } from './contacto/contacto.module';
import { MediaService } from '../media/media.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tercero]), ContactoModule],
  controllers: [TerceroController],
  providers: [TerceroService, TerceroResolver, MediaService],
  exports: [TerceroService],
})
export class TerceroModule {}
