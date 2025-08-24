import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Perfil } from '../entities/perfil.entity';
import { AutorizacionService } from '../services/autorizacion.service';
import { LoginResponse } from './dto/login.response';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Perfil)
    private perfilRepository: Repository<Perfil>,
    private jwtService: JwtService,
    private autorizacionService: AutorizacionService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const usuario = await this.usuarioRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.perfil', 'perfil')
        .leftJoinAndSelect('perfil.empresa', 'empresa')
        .where('usuario.email = :email', { email })
        .andWhere('usuario.estado = :estado', { estado: true })
        .andWhere('perfil.estado = :estadoPerfil', { estadoPerfil: true })
        .getOne();

      if (!usuario) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, usuario.password_hash);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Verificar que el perfil esté activo
      if (!usuario.perfil || !usuario.perfil.estado) {
        throw new UnauthorizedException('Perfil no válido o inactivo');
      }

      return usuario;
    } catch (error) {
      throw new UnauthorizedException('Error en la validación del usuario');
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const usuario = await this.validateUser(email, password);
      
      if (!usuario) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      if (!usuario.perfil) {
        throw new UnauthorizedException('Usuario sin perfil asignado');
      }

      // Generar token JWT
      const payload = {
        sub: usuario.id_usuario,
        email: usuario.email,
        id_perfil: usuario.perfil.id_perfil,
        id_empresa: usuario.perfil.id_empresa,
      };

      const access_token = this.jwtService.sign(payload);

      // Obtener permisos del perfil
      const opcionesMenuSuperior = await this.autorizacionService.obtenerOpcionesMenuSuperior(usuario.perfil.id_perfil);
      const modulosDisponibles = await this.autorizacionService.obtenerPermisosPorModulo(usuario.perfil.id_perfil);
      const totalPermisos = Object.values(modulosDisponibles).reduce((total, permisos) => total + permisos.length, 0);

      return {
        accessToken: access_token,
        user: {
          id: usuario.id_usuario,
          email: usuario.email || usuario.username,
          firstName: usuario.nombre_completo?.split(' ')[0] || usuario.username,
          lastName: usuario.nombre_completo?.split(' ').slice(1).join(' ') || '',
          estado: usuario.estado,
        },
        perfil: {
          id_perfil: usuario.perfil.id_perfil,
          nombre: usuario.perfil.nombre,
          estado: usuario.perfil.estado,
        },
        permisos: {
          opcionesMenuSuperior,
          modulosDisponibles: Object.keys(modulosDisponibles),
          totalPermisos,
        },
      };
    } catch (error) {
      throw new UnauthorizedException(`Error en el login: ${error.message}`);
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async refreshUserPermissions(id_usuario: string): Promise<any> {
    try {
      const usuario = await this.usuarioRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.perfil', 'perfil')
        .where('usuario.id_usuario = :id_usuario', { id_usuario })
        .getOne();

      if (!usuario || !usuario.perfil) {
        throw new UnauthorizedException('Usuario o perfil no encontrado');
      }

      if (!usuario.perfil.id_perfil) {
        throw new UnauthorizedException('Perfil sin ID válido');
      }

      // Obtener permisos actualizados
      const opcionesMenuSuperior = await this.autorizacionService.obtenerOpcionesMenuSuperior(usuario.perfil.id_perfil);
      const modulosDisponibles = await this.autorizacionService.obtenerPermisosPorModulo(usuario.perfil.id_perfil);
      const totalPermisos = Object.values(modulosDisponibles).reduce((total, permisos) => total + permisos.length, 0);

      return {
        opcionesMenuSuperior,
        modulosDisponibles: Object.keys(modulosDisponibles),
        totalPermisos,
      };
    } catch (error) {
      throw new UnauthorizedException(`Error al refrescar permisos: ${error.message}`);
    }
  }

  async getUserProfile(id_usuario: string): Promise<any> {
    try {
      const usuario = await this.usuarioRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.perfil', 'perfil')
        .leftJoinAndSelect('perfil.empresa', 'empresa')
        .where('usuario.id_usuario = :id_usuario', { id_usuario })
        .getOne();

      if (!usuario) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      if (!usuario.perfil) {
        throw new UnauthorizedException('Usuario sin perfil asignado');
      }

      if (!usuario.perfil.id_perfil) {
        throw new UnauthorizedException('Perfil sin ID válido');
      }

      // Obtener permisos completos
      const perfilConPermisos = await this.autorizacionService.obtenerPerfilConPermisos(usuario.perfil.id_perfil);

      return {
        usuario: {
          id: usuario.id_usuario,
          email: usuario.email || usuario.username,
          firstName: usuario.nombre_completo?.split(' ')[0] || usuario.username,
          lastName: usuario.nombre_completo?.split(' ').slice(1).join(' ') || '',
          estado: usuario.estado,
        },
        perfil: perfilConPermisos,
        empresa: usuario.perfil?.empresa || null,
      };
    } catch (error) {
      throw new UnauthorizedException(`Error al obtener perfil: ${error.message}`);
    }
  }
} 