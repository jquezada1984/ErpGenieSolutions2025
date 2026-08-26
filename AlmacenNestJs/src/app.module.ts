import { Module } from '@nestjs/common';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlmacenModule } from './modules/almacen/almacen.module';
import { Almacen } from './modules/almacen/entities/almacen.entity';
import { MovimientoInventario } from './modules/almacen/movimiento-inventario/entities/movimiento-inventario.entity';
import { StockItemAlmacen } from './modules/almacen/entities/stock-item-almacen.entity';

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
      entities: [Almacen, MovimientoInventario, StockItemAlmacen],
      synchronize: false,
      logging: ['error', 'warn'],
      ssl: process.env.DATABASE_URL?.includes('supabase.com')
        ? { rejectUnauthorized: false }
        : false,
    }),
    AlmacenModule,
  ],
})
export class AppModule {}
