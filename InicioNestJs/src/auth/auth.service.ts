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

  async validateUser(email: string, password: string): Promise<Usuario> {
    console.log('🔐 Validando usuario:', { email });
    
    const user = await this.usuarioRepository.findOne({ 
      where: { email: email.toLowerCase() } 
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado para email:', email);
      throw new UnauthorizedException('Usuario no encontrado');
    }
    
    console.log('✅ Usuario encontrado:', { id: user.id_usuario, email: user.email });
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      console.log('❌ Contraseña incorrecta para usuario:', email);
      throw new UnauthorizedException('Contraseña incorrecta');
    }
    
    console.log('✅ Usuario validado exitosamente:', email);
    return user;
  }

  async login(user: Usuario) {
    const payload = { 
      sub: user.id_usuario, 
      username: user.username, 
      id_empresa: user.id_empresa, 
      id_perfil: user.id_perfil 
    };
    
    const access_token = this.jwtService.sign(payload, { expiresIn: '10m' });
    
    console.log('🎉 Login exitoso para usuario:', user.email);
    console.log('🔑 Token generado:', access_token ? 'SÍ' : 'NO');
    
    return {
      access_token,
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