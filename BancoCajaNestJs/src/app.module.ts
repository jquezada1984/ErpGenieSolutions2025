import { Module } from '@nestjs/common';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BancoModule } from './modules/banco/banco.module';
import { CuentaBancariaModule } from './modules/cuenta-bancaria/cuenta-bancaria.module';
import { MovimientoBancarioModule } from './modules/movimiento-bancario/movimiento-bancario.module';
import { TransferenciaBancariaModule } from './modules/transferencia-bancaria/transferencia-bancaria.module';
import { Banco } from './modules/banco/entities/banco.entity';
import { CuentaBancaria } from './modules/cuenta-bancaria/entities/cuenta-bancaria.entity';
import { MovimientoBancario } from './modules/movimiento-bancario/entities/movimiento-bancario.entity';
import { TransferenciaBancaria } from './modules/transferencia-bancaria/entities/transferencia-bancaria.entity';

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
      url:
        process.env.DATABASE_URL ||
        `postgresql://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_DATABASE || 'postgres'}`,
      entities: [Banco, CuentaBancaria, MovimientoBancario, TransferenciaBancaria],
      synchronize: false,
      logging: ['error', 'warn'],
      ssl: { rejectUnauthorized: false },
    }),
    BancoModule,
    CuentaBancariaModule,
    MovimientoBancarioModule,
    TransferenciaBancariaModule,
  ],
})
export class AppModule {}
