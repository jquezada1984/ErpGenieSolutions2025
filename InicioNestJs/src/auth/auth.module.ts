import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Perfil } from '../entities/perfil.entity';
import { PerfilMenuPermiso } from '../entities/perfil-menu-permiso.entity';
import { MenuSeccion } from '../entities/menu.entity';
import { AutorizacionService } from '../services/autorizacion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Perfil, PerfilMenuPermiso, MenuSeccion]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, AutorizacionService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {} 