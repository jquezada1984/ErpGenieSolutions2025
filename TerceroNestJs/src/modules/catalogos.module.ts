import { Module } from '@nestjs/common';
import { EmpresaModule } from './empresa.module';

@Module({
  imports: [EmpresaModule]
})
export class CatalogosModule {}
