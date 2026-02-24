import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { ProductoModule } from './modules/producto/producto.module';
import { CatalogosModule } from './modules/catalogos/catalogos.module';
import { EmpresaModule } from './empresa/empresa.module';
//import { ProductoModule } from './modules/producto/producto.module';
import { Producto } from './modules/producto/entities/producto.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,

      // ✅ Clave para que entren Producto + Catalogos sin listar entidades a mano
      autoLoadEntities: true,

      synchronize: false, // ✅ tu regla: NO sync / NO migraciones
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
    }),

    // ✅ Nuevo: catálogos para combos
    CatalogosModule,

    ProductoModule,

    EmpresaModule,
  ],
})
export class AppModule {}

