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
import { Usuario } from './entities/usuario.entity';
import { Empresa } from './entities/empresa.entity';
import { Pais } from './entities/pais.entity';
import { Moneda } from './entities/moneda.entity';
import { Provincia } from './entities/provincia.entity';
import { TipoEntidadComercial } from './entities/tipo-entidad-comercial.entity';
import { SocialNetwork } from './entities/social-network.entity';
import { EmpresaIdentificacion } from './entities/empresa-identificacion.entity';
import { EmpresaRedSocial } from './entities/empresa-red-social.entity';
import { EmpresaHorarioApertura } from './entities/empresa-horario-apertura.entity';
import { Sucursal } from './entities/sucursal.entity';
import { Perfil } from './entities/perfil.entity';
import { MenuSeccion, MenuItem } from './entities/menu.entity';
import { PerfilMenuPermiso } from './entities/perfil-menu-permiso.entity';
import { AuthModule } from './auth/auth.module';
// Resolvers
import { UsuarioResolver } from './resolvers/usuario.resolver';
import { EmpresaResolver } from './resolvers/empresa.resolver';
import { SucursalResolver } from './resolvers/sucursal.resolver';
import { PerfilResolver } from './resolvers/perfil.resolver';
import { MenuSeccionResolver, MenuItemResolver } from './resolvers/menu.resolver';
import { PerfilMenuPermisoResolver } from './resolvers/perfil-menu-permiso.resolver';
import { AutorizacionResolver } from './resolvers/autorizacion.resolver';
import { PaisResolver } from './resolvers/pais.resolver';
import { MonedaResolver } from './resolvers/moneda.resolver';
import { ProvinciaResolver } from './resolvers/provincia.resolver';
// Services
import { PaisService } from './services/pais.service';
import { MonedaService } from './services/moneda.service';
import { ProvinciaService } from './services/provincia.service';
import { AutorizacionService } from './services/autorizacion.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'postgres',
      entities: [
        Usuario, 
        Empresa, 
        Pais, 
        Moneda, 
        Provincia, 
        TipoEntidadComercial, 
        SocialNetwork, 
        EmpresaIdentificacion, 
        EmpresaRedSocial, 
        EmpresaHorarioApertura,
        Sucursal, 
        Perfil, 
        MenuSeccion, 
        MenuItem,
        PerfilMenuPermiso
      ],
      synchronize: false, // Deshabilitado para evitar conflictos con datos existentes
      ssl: {
        rejectUnauthorized: false
      },
    }),
    TypeOrmModule.forFeature([
      Usuario, 
      Empresa, 
      Pais, 
      Moneda, 
      Provincia, 
      TipoEntidadComercial, 
      SocialNetwork, 
      EmpresaIdentificacion, 
      EmpresaRedSocial, 
      EmpresaHorarioApertura,
      Sucursal, 
      Perfil, 
      MenuSeccion, 
      MenuItem,
      PerfilMenuPermiso
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      introspection: true,
      sortSchema: true,
    }),
    AuthModule,
    HttpModule,
  ],
  controllers: [AppController],
      providers: [
      AppService,
      UsuarioResolver,
      EmpresaResolver,
      SucursalResolver,
      PerfilResolver,
      MenuSeccionResolver,
      MenuItemResolver,
      PerfilMenuPermisoResolver,
      // AutorizacionResolver,
      PaisResolver,
      MonedaResolver,
      ProvinciaResolver,
      PaisService,
      MonedaService,
      ProvinciaService,
      AutorizacionService,
    ],
})
export class AppModule {}
