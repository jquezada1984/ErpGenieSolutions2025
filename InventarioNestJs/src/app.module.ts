import { Module } from '@nestjs/common';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioModule } from './modules/inventario/inventario.module';
import { Inventario } from './modules/inventario/entities/inventario.entity';

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
      entities: [Inventario],
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
