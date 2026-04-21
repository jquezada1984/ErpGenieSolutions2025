import { Module } from '@nestjs/common';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TerceroModule } from './modules/tercero/tercero.module';
import { SocioModule } from './modules/socio/socio.module';
import { RolSocio } from './modules/socio/entities/rol-socio.entity';
import { CatalogosModule } from './modules/catalogos/catalogos.module';
import { EmpresaModule } from './modules/empresa/empresa.module';

import { Tercero } from './modules/tercero/entities/tercero.entity';
import { Contacto } from './modules/tercero/contacto/entities/contacto.entity';
import { Empresa } from './modules/empresa/entities/empresa.entity';
import { TipoTercero } from './modules/catalogos/entities/tipo-tercero.entity';
import { CondicionPago } from './modules/catalogos/entities/condicion-pago.entity';
import { FormaPago } from './modules/catalogos/entities/forma-pago.entity';
import { Incoterm } from './modules/catalogos/entities/incoterm.entity';
import { Pais } from './modules/catalogos/entities/pais.entity';
import { TipoEntidadComercial } from './modules/catalogos/entities/tipo-entidad-comercial.entity';

@Module({
  imports: [
    // GraphQL code-first
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),

    // TypeORM - usa DATABASE_URL como InicioNestJs
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_DATABASE || 'postgres'}`,
      entities: [Tercero, Contacto, Empresa, TipoTercero, CondicionPago, FormaPago, Incoterm, Pais, TipoEntidadComercial, RolSocio,],
      synchronize: false, // TRUE solo en dev si no usas migraciones
      logging: ['error', 'warn'],
      ssl: {
        rejectUnauthorized: false
      },
    }),

    // Módulos
    CatalogosModule,
    EmpresaModule,
    TerceroModule,
    SocioModule,
  ],
})
export class AppModule {}
