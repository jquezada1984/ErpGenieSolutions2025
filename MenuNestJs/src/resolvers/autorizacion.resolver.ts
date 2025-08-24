import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { AutorizacionService } from '../services/autorizacion.service';
import { 
  PermisoMenu, 
  SeccionConPermisos, 
  PerfilConPermisos,
  EstadisticasPermisos 
} from '../types/graphql.types';

@Resolver()
export class AutorizacionResolver {
  constructor(
    private autorizacionService: AutorizacionService,
  ) {}

  @Query(() => [PermisoMenu])
  async permisosPorPerfil(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
  ): Promise<PermisoMenu[]> {
    try {
      return await this.autorizacionService.obtenerPermisosPorPerfil(id_perfil);
    } catch (error) {
      throw new Error(`Error al obtener permisos: ${error.message}`);
    }
  }

  @Query(() => [SeccionConPermisos])
  async menuLateralPorPerfil(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
  ): Promise<SeccionConPermisos[]> {
    try {
      return await this.autorizacionService.obtenerMenuLateralPorPerfil(id_perfil);
    } catch (error) {
      throw new Error(`Error al obtener menú lateral: ${error.message}`);
    }
  }

  @Query(() => [String])
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

  @Query(() => PerfilConPermisos)
  async perfilConPermisos(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
  ): Promise<PerfilConPermisos> {
    try {
      return await this.autorizacionService.obtenerPerfilConPermisos(id_perfil);
    } catch (error) {
      throw new Error(`Error al obtener perfil con permisos: ${error.message}`);
    }
  }

  @Query(() => [String])
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

  @Query(() => EstadisticasPermisos)
  async estadisticasPermisos(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
  ): Promise<EstadisticasPermisos> {
    try {
      return await this.autorizacionService.obtenerEstadisticasPermisos(id_perfil);
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}
