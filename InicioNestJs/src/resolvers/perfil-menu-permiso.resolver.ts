import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PerfilMenuPermiso } from '../entities/perfil-menu-permiso.entity';
import { PerfilMenuPermisoDto, PerfilMenuPermisoListDto, PermisosPorPerfilDto, PermisosPorMenuItemDto } from '../dto/perfil-menu-permiso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => PerfilMenuPermiso)
export class PerfilMenuPermisoResolver {
  constructor(
    @InjectRepository(PerfilMenuPermiso)
    private perfilMenuPermisoRepository: Repository<PerfilMenuPermiso>,
  ) {}

  // ===== CONSULTAS =====

  @Query(() => [PerfilMenuPermisoDto])
  async permisosMenu(): Promise<PerfilMenuPermisoDto[]> {
    try {
      const permisos = await this.perfilMenuPermisoRepository
        .createQueryBuilder('pmp')
        .leftJoinAndSelect('pmp.perfil', 'perfil')
        .leftJoinAndSelect('pmp.menuItem', 'menuItem')
        .leftJoinAndSelect('menuItem.seccion', 'seccion')
        .orderBy('perfil.nombre', 'ASC')
        .addOrderBy('seccion.orden', 'ASC')
        .addOrderBy('menuItem.orden', 'ASC')
        .getMany();
      
      return permisos;
    } catch (error) {
      throw error;
    }
  }

  @Query(() => [PerfilMenuPermisoListDto])
  async permisosMenuLista(): Promise<PerfilMenuPermisoListDto[]> {
    try {
      const permisos = await this.perfilMenuPermisoRepository
        .createQueryBuilder('pmp')
        .leftJoin('pmp.perfil', 'perfil')
        .leftJoin('pmp.menuItem', 'menuItem')
        .leftJoin('menuItem.seccion', 'seccion')
        .select([
          'pmp.id_perfil',
          'pmp.id_item',
          'pmp.permitido',
          'perfil.nombre',
          'menuItem.etiqueta',
          'seccion.nombre'
        ])
        .orderBy('perfil.nombre', 'ASC')
        .addOrderBy('seccion.orden', 'ASC')
        .addOrderBy('menuItem.orden', 'ASC')
        .getRawMany();
      
      return permisos.map(p => ({
        id_perfil: p.pmp_id_perfil,
        id_item: p.pmp_id_item,
        permitido: p.pmp_permitido,
        nombrePerfil: p.perfil_nombre,
        etiquetaMenuItem: p.menuItem_etiqueta,
        nombreSeccion: p.seccion_nombre
      }));
    } catch (error) {
      throw error;
    }
  }

  @Query(() => PerfilMenuPermisoDto, { nullable: true })
  async permisoMenu(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
    @Args('id_item', { type: () => ID }) id_item: string,
  ): Promise<PerfilMenuPermisoDto | null> {
    try {
      const permiso = await this.perfilMenuPermisoRepository
        .createQueryBuilder('pmp')
        .leftJoinAndSelect('pmp.perfil', 'perfil')
        .leftJoinAndSelect('pmp.menuItem', 'menuItem')
        .where('pmp.id_perfil = :id_perfil', { id_perfil })
        .andWhere('pmp.id_item = :id_item', { id_item })
        .getOne();
      
      return permiso;
    } catch (error) {
      throw error;
    }
  }

  @Query(() => [PerfilMenuPermisoDto])
  async permisosPorPerfil(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
  ): Promise<PerfilMenuPermisoDto[]> {
    try {
      const permisos = await this.perfilMenuPermisoRepository
        .createQueryBuilder('pmp')
        .leftJoinAndSelect('pmp.perfil', 'perfil')
        .leftJoinAndSelect('pmp.menuItem', 'menuItem')
        .leftJoinAndSelect('menuItem.seccion', 'seccion')
        .where('pmp.id_perfil = :id_perfil', { id_perfil })
        .orderBy('seccion.orden', 'ASC')
        .addOrderBy('menuItem.orden', 'ASC')
        .getMany();
      
      return permisos;
    } catch (error) {
      throw error;
    }
  }

  @Query(() => [PerfilMenuPermisoDto])
  async permisosPorMenuItem(
    @Args('id_item', { type: () => ID }) id_item: string,
  ): Promise<PerfilMenuPermisoDto[]> {
    try {
      const permisos = await this.perfilMenuPermisoRepository
        .createQueryBuilder('pmp')
        .leftJoinAndSelect('pmp.perfil', 'perfil')
        .leftJoinAndSelect('pmp.menuItem', 'menuItem')
        .where('pmp.id_item = :id_item', { id_item })
        .orderBy('perfil.nombre', 'ASC')
        .getMany();
      
      return permisos;
    } catch (error) {
      throw error;
    }
  }

  @Query(() => PermisosPorPerfilDto)
  async resumenPermisosPorPerfil(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
  ): Promise<PermisosPorPerfilDto> {
    try {
      const permisos = await this.perfilMenuPermisoRepository
        .createQueryBuilder('pmp')
        .leftJoinAndSelect('pmp.perfil', 'perfil')
        .leftJoinAndSelect('pmp.menuItem', 'menuItem')
        .where('pmp.id_perfil = :id_perfil', { id_perfil })
        .getMany();
      
      const totalPermisos = permisos.length;
      const permisosActivos = permisos.filter(p => p.permitido).length;
      
      return {
        id_perfil,
        nombrePerfil: permisos[0]?.perfil?.nombre || '',
        permisos,
        totalPermisos,
        permisosActivos
      };
    } catch (error) {
      throw error;
    }
  }

  @Query(() => PermisosPorMenuItemDto)
  async resumenPermisosPorMenuItem(
    @Args('id_item', { type: () => ID }) id_item: string,
  ): Promise<PermisosPorMenuItemDto> {
    try {
      const permisos = await this.perfilMenuPermisoRepository
        .createQueryBuilder('pmp')
        .leftJoinAndSelect('pmp.perfil', 'perfil')
        .leftJoinAndSelect('pmp.menuItem', 'menuItem')
        .where('pmp.id_item = :id_item', { id_item })
        .getMany();
      
      const totalPerfiles = permisos.length;
      const perfilesConPermiso = permisos.filter(p => p.permitido).length;
      
      return {
        id_item,
        etiquetaMenuItem: permisos[0]?.menuItem?.etiqueta || '',
        permisos,
        totalPerfiles,
        perfilesConPermiso
      };
    } catch (error) {
      throw error;
    }
  }

  @Query(() => [PerfilMenuPermisoDto])
  async permisosActivos(): Promise<PerfilMenuPermisoDto[]> {
    try {
      const permisos = await this.perfilMenuPermisoRepository
        .createQueryBuilder('pmp')
        .leftJoinAndSelect('pmp.perfil', 'perfil')
        .leftJoinAndSelect('pmp.menuItem', 'menuItem')
        .where('pmp.permitido = :permitido', { permitido: true })
        .andWhere('perfil.estado = :estado', { estado: true })
        .andWhere('menuItem.estado = :estadoItem', { estadoItem: true })
        .orderBy('perfil.nombre', 'ASC')
        .addOrderBy('menuItem.orden', 'ASC')
        .getMany();
      
      return permisos;
    } catch (error) {
      throw error;
    }
  }

  // ===== MUTACIONES =====

  @Mutation(() => PerfilMenuPermiso)
  async crearPermisoMenu(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
    @Args('id_item', { type: () => ID }) id_item: string,
    @Args('permitido', { defaultValue: true }) permitido: boolean,
  ): Promise<PerfilMenuPermiso> {
    try {
      // Verificar si ya existe el permiso
      const permisoExistente = await this.perfilMenuPermisoRepository.findOne({
        where: { id_perfil, id_item }
      });

      if (permisoExistente) {
        throw new Error('El permiso ya existe para este perfil y item de menú');
      }

      const permiso = this.perfilMenuPermisoRepository.create({
        id_perfil,
        id_item,
        permitido
      });
      
      const permisoGuardado = await this.perfilMenuPermisoRepository.save(permiso);
      return permisoGuardado;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => PerfilMenuPermiso)
  async actualizarPermisoMenu(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
    @Args('id_item', { type: () => ID }) id_item: string,
    @Args('permitido') permitido: boolean,
  ): Promise<PerfilMenuPermiso> {
    try {
      const permiso = await this.perfilMenuPermisoRepository.findOne({
        where: { id_perfil, id_item }
      });

      if (!permiso) {
        throw new NotFoundException('Permiso no encontrado');
      }

      permiso.permitido = permitido;
      const permisoActualizado = await this.perfilMenuPermisoRepository.save(permiso);
      return permisoActualizado;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async eliminarPermisoMenu(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
    @Args('id_item', { type: () => ID }) id_item: string,
  ): Promise<boolean> {
    try {
      const result = await this.perfilMenuPermisoRepository.delete({
        id_perfil,
        id_item
      });
      
      const eliminado = (result.affected || 0) > 0;
      return eliminado;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => [PerfilMenuPermiso])
  async crearPermisosMasivos(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
    @Args('ids_items', { type: () => [ID] }) ids_items: string[],
    @Args('permitido', { defaultValue: true }) permitido: boolean,
  ): Promise<PerfilMenuPermiso[]> {
    try {
      const permisos = ids_items.map(id_item => 
        this.perfilMenuPermisoRepository.create({
          id_perfil,
          id_item,
          permitido
        })
      );
      
      const permisosGuardados = await this.perfilMenuPermisoRepository.save(permisos);
      return permisosGuardados;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async cambiarEstadoPermisosPerfil(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
    @Args('permitido') permitido: boolean,
  ): Promise<boolean> {
    try {
      const result = await this.perfilMenuPermisoRepository
        .createQueryBuilder()
        .update(PerfilMenuPermiso)
        .set({ permitido })
        .where('id_perfil = :id_perfil', { id_perfil })
        .execute();
      
      const actualizado = (result.affected || 0) > 0;
      return actualizado;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async cambiarEstadoPermisosMenuItem(
    @Args('id_item', { type: () => ID }) id_item: string,
    @Args('permitido') permitido: boolean,
  ): Promise<boolean> {
    try {
      const result = await this.perfilMenuPermisoRepository
        .createQueryBuilder()
        .update(PerfilMenuPermiso)
        .set({ permitido })
        .where('id_item = :id_item', { id_item })
        .execute();
      
      const actualizado = (result.affected || 0) > 0;
      return actualizado;
    } catch (error) {
      throw error;
    }
  }
}
