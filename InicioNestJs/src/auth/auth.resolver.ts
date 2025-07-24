import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login.response';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(@Args('email') email: string, @Args('password') password: string) {
    const user = await this.authService.validateUser(email, password);
    const result = await this.authService.login(user);
    
    return {
      accessToken: result.access_token,
      user: {
        id: user.id_usuario.toString(),
        email: user.email || '',
        firstName: user.nombre_completo?.split(' ')[0] || '',
        lastName: user.nombre_completo?.split(' ').slice(1).join(' ') || '',
      },
    };
  }

  @Query(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  async me(@Context() context: any): Promise<LoginResponse> {
    const userFromToken = context.req.user;
    if (!userFromToken) throw new Error('Usuario no autenticado');

    // Buscar el usuario completo en la base de datos
    const user = await this.authService.usuarioRepository.findOne({
      where: { id_usuario: userFromToken.sub },
    });
    if (!user) throw new Error('Usuario no encontrado');

    const result = await this.authService.login(user);
    return {
      accessToken: result.access_token,
      user: {
        id: user.id_usuario.toString(),
        email: user.email || '',
        firstName: user.nombre_completo?.split(' ')[0] || '',
        lastName: user.nombre_completo?.split(' ').slice(1).join(' ') || '',
      },
    };
  }
} 