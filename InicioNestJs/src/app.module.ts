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
import { Almacen } from './entities/almacen.entity';
import { TipoUnidad } from './entities/tipo-unidad.entity';
import { Unidad } from './entities/unidad.entity';
import { TipoEntidadComercial } from './entities/tipo-entidad-comercial.entity';
import { SocialNetwork } from './entities/social-network.entity';
import { EmpresaIdentificacion } from './entities/empresa-identificacion.entity';
import { EmpresaRedSocial } from './entities/empresa-red-social.entity';
import { EmpresaHorarioApertura } from './entities/empresa-horario-apertura.entity';
import { Sucursal } from './entities/sucursal.entity';
import { Perfil } from './entities/perfil.entity';
import { MenuSeccion, MenuItem } from './entities/menu.entity';
import { PerfilMenuPermiso } from './entities/perfil-menu-permiso.entity';
import { CondicionPago } from './entities/condicion-pago.entity';
import { FormaPago } from './entities/forma-pago.entity';
import { Impuesto } from './entities/impuesto.entity';
import { CuentaContable } from './entities/cuenta-contable.entity';
import { TipoItemCatalogo } from './entities/tipo-item-catalogo.entity';
import { DuracionUnidadCatalogo } from './entities/duracion-unidad-catalogo.entity';
import { FormatoPapel } from './entities/formato-papel.entity';
import { AuthModule } from './auth/auth.module';
import { sanitizeGraphQLError } from './common/graphql-format-error';
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
import { AlmacenResolver } from './resolvers/almacen.resolver';
import { UnidadResolver } from './resolvers/unidad.resolver';
import { CatalogosPagoResolver } from './resolvers/catalogos-pago.resolver';
import { TipoEntidadComercialResolver } from './resolvers/tipo-entidad-comercial.resolver';
import { ImpuestoResolver } from './resolvers/impuesto.resolver';
import { CuentaContableResolver } from './resolvers/cuenta-contable.resolver';
import { TipoItemCatalogoResolver } from './resolvers/tipo-item-catalogo.resolver';
import { DuracionUnidadCatalogoResolver } from './resolvers/duracion-unidad-catalogo.resolver';
import { FormatoPapelResolver } from './resolvers/formato-papel.resolver';
import { AuthResolver } from './auth/auth.resolver';
// Services
import { PaisService } from './services/pais.service';
import { MonedaService } from './services/moneda.service';
import { ProvinciaService } from './services/provincia.service';
import { AlmacenService } from './services/almacen.service';
import { UnidadService } from './services/unidad.service';
import { ImpuestoService } from './services/impuesto.service';
import { CuentaContableService } from './services/cuenta-contable.service';
import { TipoItemCatalogoService } from './services/tipo-item-catalogo.service';
import { DuracionUnidadCatalogoService } from './services/duracion-unidad-catalogo.service';
import { AutorizacionService } from './services/autorizacion.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_DATABASE || 'postgres'}`,
      entities: [
        Usuario, 
        Empresa, 
        Pais, 
        Moneda, 
        Provincia, 
        Almacen,
        TipoUnidad,
        Unidad,
        TipoEntidadComercial, 
        SocialNetwork, 
        EmpresaIdentificacion, 
        EmpresaRedSocial, 
        EmpresaHorarioApertura,
        Sucursal, 
        Perfil, 
        MenuSeccion, 
        MenuItem,
        PerfilMenuPermiso,
        CondicionPago,
        FormaPago,
        FormatoPapel,
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
      Almacen,
      TipoUnidad,
      Unidad,
      TipoEntidadComercial, 
      SocialNetwork, 
      EmpresaIdentificacion, 
      EmpresaRedSocial, 
      EmpresaHorarioApertura,
      Sucursal, 
      Perfil, 
      MenuSeccion, 
      MenuItem,
      PerfilMenuPermiso,
      CondicionPago,
      FormaPago,
        Impuesto,
        CuentaContable,
        TipoItemCatalogo,
        DuracionUnidadCatalogo,
        FormatoPapel,
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
      sortSchema: true,
      formatError: (formattedError, error) => sanitizeGraphQLError(formattedError, error),
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
      AlmacenResolver,
      UnidadResolver,
      CatalogosPagoResolver,
      TipoEntidadComercialResolver,
      ImpuestoResolver,
      CuentaContableResolver,
      TipoItemCatalogoResolver,
      DuracionUnidadCatalogoResolver,
      FormatoPapelResolver,
      AuthResolver,
      PaisService,
      MonedaService,
      ProvinciaService,
      AlmacenService,
      UnidadService,
      ImpuestoService,
      CuentaContableService,
      TipoItemCatalogoService,
      DuracionUnidadCatalogoService,
      AutorizacionService,
    ],
})
export class AppModule {}
