import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entidades
import { Perfil } from './entities/perfil.entity';
import { MenuSeccion } from './entities/menu-seccion.entity';
import { MenuItem } from './entities/menu-item.entity';
import { PerfilMenuPermiso } from './entities/perfil-menu-permiso.entity';

// Resolvers
import { AutorizacionResolver } from './resolvers/autorizacion.resolver';

// Services
import { AutorizacionService } from './services/autorizacion.service';

const menuEntities = [Perfil, MenuSeccion, MenuItem, PerfilMenuPermiso];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
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
      url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_DATABASE || 'postgres'}`,
      entities: [Perfil, MenuSeccion, MenuItem, PerfilMenuPermiso],
      synchronize: false, // Importante: false en producción
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
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
