import { Module } from '@nestjs/common';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioModule } from './modules/inventario/inventario.module';
import { Inventario } from './modules/inventario/entities/inventario.entity';
import { AlmacenEntity } from './modules/inventario/entities/almacen.entity';
import { StockItemAlmacen } from './modules/inventario/entities/stock-item-almacen.entity';
import { MovimientoInventario } from './modules/inventario/entities/movimiento-inventario.entity';
import { TransferenciaStock } from './modules/inventario/entities/transferencia-stock.entity';
import { CambioMasivoStock } from './modules/inventario/entities/cambio-masivo-stock.entity';

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
        Inventario,
        AlmacenEntity,
        StockItemAlmacen,
        MovimientoInventario,
        TransferenciaStock,
        CambioMasivoStock,
      ],
      synchronize: false,
      logging: ['error', 'warn'],
      ssl: process.env.DATABASE_URL?.includes('supabase.com')
        ? { rejectUnauthorized: false }
        : false,
    }),
    InventarioModule,
  ],
})
export class AppModule {}
