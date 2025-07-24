import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    public readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Contraseña incorrecta');
    return user;
  }

  async login(user: Usuario) {
    const payload = { sub: user.id_usuario, username: user.username, id_empresa: user.id_empresa, id_perfil: user.id_perfil };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '10m' }),
      user: {
        id_usuario: user.id_usuario,
        username: user.username,
        id_empresa: user.id_empresa,
        id_perfil: user.id_perfil,
        nombre_completo: user.nombre_completo,
        email: user.email,
        estado: user.estado,
      },
    };
  }
} 