import { Module } from '@nestjs/common';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HealthController } from './health.controller';
import { CategoriaGastoModule } from './modules/categoria-gasto/categoria-gasto.module';
import { GastoModule } from './modules/gasto/gasto.module';
import { CategoriaGasto } from './modules/categoria-gasto/entities/categoria-gasto.entity';
import { Gasto } from './modules/gasto/entities/gasto.entity';
import { GastoDetalle } from './modules/gasto/entities/gasto-detalle.entity';

function resolveSsl(): boolean | { rejectUnauthorized: boolean } {
  const mode = (process.env.DB_SSLMODE || '').toLowerCase();
  if (mode === 'disable' || mode === 'false') return false;
  // Default: compatible con Supabase / cloud (mismo espíritu BancoCaja/Item)
  return { rejectUnauthorized: false };
}

function requirePostgresUrl(): string {
  const url = (process.env.DATABASE_URL || '').trim();
  if (!url) {
    throw new Error('GastoNestJs requiere DATABASE_URL (PostgreSQL).');
  }
  if (url.toLowerCase().startsWith('sqlite')) {
    throw new Error(
      'GastoNestJs no soporta SQLite. Configure DATABASE_URL PostgreSQL.',
    );
  }
  return url;
}

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
      url: requirePostgresUrl(),
      entities: [CategoriaGasto, Gasto, GastoDetalle],
      synchronize: false,
      logging: ['error', 'warn'],
      ssl: resolveSsl(),
    }),
    CategoriaGastoModule,
    GastoModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
