import { Module } from '@nestjs/common';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogosModule } from './modules/catalogos/catalogos.module';
import { ItemsModule } from './modules/items/items.module';
import { EstadoVentaItem } from './modules/catalogos/entities/estado-venta-item.entity';
import { EstadoCompraItem } from './modules/catalogos/entities/estado-compra-item.entity';
import { NaturalezaItem } from './modules/catalogos/entities/naturaleza-item.entity';
import { TipoControlInventarioItem } from './modules/catalogos/entities/tipo-control-inventario-item.entity';
import { TipoControlCaducidadItem } from './modules/catalogos/entities/tipo-control-caducidad-item.entity';
import { TipoComportamientoItem } from './modules/catalogos/entities/tipo-comportamiento-item.entity';
import { TipoItemCatalogo } from './modules/catalogos/entities/tipo-item-catalogo.entity';
import { DuracionUnidadCatalogo } from './modules/catalogos/entities/duracion-unidad-catalogo.entity';
import { Item } from './modules/items/entities/item.entity';
import { EmpresaItemRef } from './modules/items/entities/empresa-item-ref.entity';
import { Inventario } from './modules/items/entities/inventario.entity';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        EstadoVentaItem,
        EstadoCompraItem,
        NaturalezaItem,
        TipoControlInventarioItem,
        TipoControlCaducidadItem,
        TipoComportamientoItem,
        TipoItemCatalogo,
        DuracionUnidadCatalogo,
        Item,
        EmpresaItemRef,
        Inventario,
      ],
      synchronize: false,
      logging: ['error', 'warn'],
      ssl: process.env.DATABASE_URL?.includes('supabase.com')
        ? { rejectUnauthorized: false }
        : false,
    }),

    CatalogosModule,
    ItemsModule,
  ],
})
export class AppModule {}