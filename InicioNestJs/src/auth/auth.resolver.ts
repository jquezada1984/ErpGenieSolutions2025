import { Resolver, Mutation, Args, Query, ID } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login.response';
import { LoginInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    try {
      return await this.authService.login(email, password);
    } catch (error) {
      throw new Error(`Error en el login: ${error.message}`);
    }
  }

  @Query(() => LoginResponse, { nullable: true })
  @UseGuards(AuthGuard)
  async refreshUserPermissions(
    @CurrentUser() user: any,
  ): Promise<any> {
    try {
      return await this.authService.refreshUserPermissions(user.sub);
    } catch (error) {
      throw new Error(`Error al refrescar permisos: ${error.message}`);
    }
  }

  @Query(() => LoginResponse, { nullable: true })
  @UseGuards(AuthGuard)
  async getUserProfile(
    @CurrentUser() user: any,
  ): Promise<any> {
    try {
      return await this.authService.getUserProfile(user.sub);
    } catch (error) {
      throw new Error(`Error al obtener perfil: ${error.message}`);
    }
  }

  @Query(() => Boolean)
  @UseGuards(AuthGuard)
  async validateToken(
    @CurrentUser() user: any,
  ): Promise<boolean> {
    try {
      // Si llegamos aquí, el token es válido
      return true;
    } catch (error) {
      return false;
    }
  }
} 