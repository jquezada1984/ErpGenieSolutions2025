import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { AutorizacionService } from '../services/autorizacion.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Resolver()
export class AutorizacionResolver {
  constructor(
    private autorizacionService: AutorizacionService,
  ) {}

  @Query(() => [String])
  @UseGuards(AuthGuard)
  async permisosPorPerfil(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
  ): Promise<string[]> {
    try {
      const permisos = await this.autorizacionService.obtenerPermisosPorPerfil(id_perfil);
      return permisos.map(p => p.etiqueta);
    } catch (error) {
      throw new Error(`Error al obtener permisos: ${error.message}`);
    }
  }

  @Query(() => [String])
  @UseGuards(AuthGuard)
  async menuLateralPorPerfil(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
  ): Promise<string[]> {
    try {
      const menu = await this.autorizacionService.obtenerMenuLateralPorPerfil(id_perfil);
      return menu.map(s => s.nombre);
    } catch (error) {
      throw new Error(`Error al obtener menú lateral: ${error.message}`);
    }
  }

  @Query(() => [String])
  @UseGuards(AuthGuard)
  async opcionesMenuSuperior(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
  ): Promise<string[]> {
    try {
      return await this.autorizacionService.obtenerOpcionesMenuSuperior(id_perfil);
    } catch (error) {
      throw new Error(`Error al obtener opciones del menú superior: ${error.message}`);
    }
  }

  @Query(() => Boolean)
  @UseGuards(AuthGuard)
  async validarAccesoRuta(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
    @Args('ruta') ruta: string,
  ): Promise<boolean> {
    try {
      return await this.autorizacionService.validarAccesoRuta(id_perfil, ruta);
    } catch (error) {
      return false;
    }
  }

  @Query(() => String)
  @UseGuards(AuthGuard)
  async perfilConPermisos(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
  ): Promise<string> {
    try {
      const perfil = await this.autorizacionService.obtenerPerfilConPermisos(id_perfil);
      return perfil.nombre;
    } catch (error) {
      throw new Error(`Error al obtener perfil con permisos: ${error.message}`);
    }
  }

  @Query(() => [String])
  @UseGuards(AuthGuard)
  async modulosDisponibles(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
  ): Promise<string[]> {
    try {
      const permisosPorModulo = await this.autorizacionService.obtenerPermisosPorModulo(id_perfil);
      return Object.keys(permisosPorModulo);
    } catch (error) {
      throw new Error(`Error al obtener módulos disponibles: ${error.message}`);
    }
  }
}
