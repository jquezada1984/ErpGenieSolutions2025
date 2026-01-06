import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@erp/shared-logging-nestjs';
import * as dotenv from 'dotenv';

// Cargar variables de entorno al inicio
dotenv.config();

// Debug: Verificar variables de entorno en el módulo
console.log('🔍 DEBUG - Variables de entorno en AppModule (Financiero):');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada');
console.log('---');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      serviceName: 'financiero-nestjs',
      logDir: process.env.LOG_DIR || './logs',
      logLevel: process.env.LOG_LEVEL || 'info',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_DATABASE || 'postgres'}`,
      entities: [],
      synchronize: false, // Deshabilitado para evitar conflictos con datos existentes
      ssl: process.env.DATABASE_URL?.includes('supabase') || process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
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
    AppResolver,
  ],
})
export class AppModule {
  constructor() {
    console.log('✅ AppModule inicializado con AppResolver registrado');
  }
}


