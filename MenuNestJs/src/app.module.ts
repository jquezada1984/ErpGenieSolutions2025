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
    // forRootAsync: lee .env vía ConfigService (antes process.env se evaluaba antes de cargar .env → localhost:5432)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = (
          config.get<string>('DATABASE_URL') ||
          process.env.DATABASE_URL ||
          ''
        ).trim();
        const isDev = config.get('NODE_ENV') === 'development';

        if (databaseUrl && /^sqlite:/i.test(databaseUrl)) {
          throw new Error(
            'MenuNestJs usa PostgreSQL; DATABASE_URL no puede ser SQLite. Suele pasar si el contenedor se creó con otra imagen/compose: ejecuta `docker compose -f docker-compose.dev.yml up -d --force-recreate menu-service`.',
          );
        }

        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            entities: menuEntities,
            synchronize: false,
            logging: isDev,
            ssl: { rejectUnauthorized: false },
          };
        }

        const dbHost = (config.get<string>('DB_HOST') || '').trim();
        if (dbHost) {
          return {
            type: 'postgres' as const,
            host: dbHost,
            port: parseInt(config.get<string>('DB_PORT', '5432'), 10) || 5432,
            username: config.get<string>('DB_USERNAME', 'postgres'),
            password: config.get<string>('DB_PASSWORD', 'postgres'),
            database: config.get<string>('DB_DATABASE', 'erp'),
            entities: menuEntities,
            synchronize: false,
            logging: isDev,
            ssl: isDev ? false : { rejectUnauthorized: false },
          };
        }

        throw new Error(
          'MenuNestJs: DATABASE_URL (o DB_HOST) no está definida. Si usas Docker: revisa MenuNestJs/.env y que no tengas DATABASE_URL= vacío en el .env de la raíz del repo (Compose lo propaga como cadena vacía y anula el valor por defecto).',
        );
      },
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
