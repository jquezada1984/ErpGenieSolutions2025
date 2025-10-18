import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import * as dotenv from 'dotenv';

// Cargar variables de entorno al inicio
dotenv.config();

// Debug: Verificar variables de entorno en el módulo
console.log('🔍 DEBUG - Variables de entorno en AppModule:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('---');

// Entidades
import { CuentaContable } from './entities/cuenta-contable.entity';
import { AsientoContable } from './entities/asiento-contable.entity';
import { MovimientoContable } from './entities/movimiento-contable.entity';
import { BalanceGeneral } from './entities/balance-general.entity';

// Resolvers
import { CuentaContableResolver } from './resolvers/cuenta-contable.resolver';
import { AsientoContableResolver } from './resolvers/asiento-contable.resolver';

// Services
import { CuentaContableService } from './services/cuenta-contable.service';
import { AsientoContableService } from './services/asiento-contable.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_DATABASE || 'postgres'}`,
      entities: [
        CuentaContable,
        AsientoContable,
        MovimientoContable,
        BalanceGeneral,
      ],
      synchronize: false, // Deshabilitado para evitar conflictos con datos existentes
      ssl: {
        rejectUnauthorized: false
      },
    }),
    TypeOrmModule.forFeature([
      CuentaContable,
      AsientoContable,
      MovimientoContable,
      BalanceGeneral,
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
  providers: [
    AppService,
    CuentaContableResolver,
    AsientoContableResolver,
    CuentaContableService,
    AsientoContableService,
  ],
})
export class AppModule {}
