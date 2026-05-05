import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import * as dotenv from 'dotenv';

dotenv.config();

import { Moneda } from './entities/moneda.entity';
import { CondicionPagoCatalogo } from './entities/condicion-pago-catalogo.entity';
import { FormaPagoCatalogo } from './entities/forma-pago-catalogo.entity';
import { CuentaBancaria } from './entities/cuenta-bancaria.entity';
import { Factura } from './entities/factura.entity';
import { FinancieroResolver } from './resolvers/financiero.resolver';
import { FinancieroLecturaService } from './services/financiero-lectura.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        `postgresql://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_DATABASE || 'postgres'}`,
      entities: [
        Moneda,
        CondicionPagoCatalogo,
        FormaPagoCatalogo,
        CuentaBancaria,
        Factura,
      ],
      synchronize: false,
      ssl: { rejectUnauthorized: false },
    }),
    TypeOrmModule.forFeature([
      Moneda,
      CondicionPagoCatalogo,
      FormaPagoCatalogo,
      CuentaBancaria,
      Factura,
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      introspection: true,
      sortSchema: true,
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, FinancieroResolver, FinancieroLecturaService],
})
export class AppModule {}
