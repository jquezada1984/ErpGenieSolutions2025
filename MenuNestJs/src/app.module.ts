import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entidades
import { Perfil } from './entities/perfil.entity';
import { MenuSeccion } from './entities/menu-seccion.entity';
import { MenuItem } from './entities/menu-item.entity';
import { PerfilMenuPermiso } from './entities/perfil-menu-permiso.entity';

// Resolvers
import { AutorizacionResolver } from './resolvers/autorizacion.resolver';

// Services
import { AutorizacionService } from './services/autorizacion.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'erp',
      entities: [Perfil, MenuSeccion, MenuItem, PerfilMenuPermiso],
      synchronize: false, // Importante: false en producción
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    TypeOrmModule.forFeature([
      Perfil,
      MenuSeccion,
      MenuItem,
      PerfilMenuPermiso,
    ]),
  ],
  controllers: [],
  providers: [
    AutorizacionService,
    AutorizacionResolver,
  ],
})
export class AppModule {}
