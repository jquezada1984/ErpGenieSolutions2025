import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
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
import { AuthModule } from './auth/auth.module';
// Resolvers
import { UsuarioResolver } from './resolvers/usuario.resolver';
import { EmpresaResolver } from './resolvers/empresa.resolver';
import { SucursalResolver } from './resolvers/sucursal.resolver';
import { PerfilResolver } from './resolvers/perfil.resolver';
import { MenuSeccionResolver, MenuItemResolver } from './resolvers/menu.resolver';
import { PaisResolver } from './resolvers/pais.resolver';
import { MonedaResolver } from './resolvers/moneda.resolver';
import { ProvinciaResolver } from './resolvers/provincia.resolver';
// Services
import { PaisService } from './services/pais.service';
import { MonedaService } from './services/moneda.service';
import { ProvinciaService } from './services/provincia.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db.xfeycgctysoumclptgoh.supabase.co',
      port: 5432,
      username: 'postgres',
      password: 'XeCWl8Dam9CNUS1m',
      database: 'postgres',
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
        MenuItem
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
      MenuItem
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
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
    PaisResolver,
    MonedaResolver,
    ProvinciaResolver,
    PaisService,
    MonedaService,
    ProvinciaService,
  ],
})
export class AppModule {}
