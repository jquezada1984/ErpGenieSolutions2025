import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { EmpresaItemRef } from './entities/empresa-item-ref.entity';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Item, EmpresaItemRef])],
  providers: [ItemsService, ItemsResolver],
  exports: [ItemsService, TypeOrmModule],
})
export class ItemsModule {}
