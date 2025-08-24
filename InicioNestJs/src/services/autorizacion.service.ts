import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfilMenuPermiso } from '../entities/perfil-menu-permiso.entity';
import { MenuSeccion } from '../entities/menu.entity';
import { Perfil } from '../entities/perfil.entity';

export interface PermisoMenu {
  id_item: string;
  etiqueta: string;
  ruta?: string;
  icono?: string;
  permitido: boolean;
  seccion: {
    id_seccion: string;
    nombre: string;
    orden: number;
  };
}

export interface SeccionConPermisos {
  id_seccion: string;
  nombre: string;
  orden: number;
  icono?: string;
  items: PermisoMenu[];
  tienePermisos: boolean;
}

export interface PerfilConPermisos {
  id_perfil: string;
  nombre: string;
  estado: boolean;
  secciones: SeccionConPermisos[];
  totalPermisos: number;
  permisosActivos: number;
}

@Injectable()
export class AutorizacionService {
  constructor(
    @InjectRepository(PerfilMenuPermiso)
    private perfilMenuPermisoRepository: Repository<PerfilMenuPermiso>,
    @InjectRepository(MenuSeccion)
    private menuSeccionRepository: Repository<MenuSeccion>,
    @InjectRepository(Perfil)
    private perfilRepository: Repository<Perfil>,
  ) {}

  /**
   * Obtiene todos los permisos de menú para un perfil específico
   */
  async obtenerPermisosPorPerfil(id_perfil: string): Promise<PermisoMenu[]> {
    try {
      const permisos = await this.perfilMenuPermisoRepository
        .createQueryBuilder('pmp')
        .leftJoinAndSelect('pmp.menuItem', 'menuItem')
        .leftJoinAndSelect('menuItem.seccion', 'seccion')
        .where('pmp.id_perfil = :id_perfil', { id_perfil })
        .andWhere('pmp.permitido = :permitido', { permitido: true })
        .andWhere('menuItem.estado = :estadoItem', { estadoItem: true })
        .andWhere('seccion.estado = :estadoSeccion', { estadoSeccion: true })
        .orderBy('seccion.orden', 'ASC')
        .addOrderBy('menuItem.orden', 'ASC')
        .getMany();

      return permisos
        .filter(permiso => permiso.menuItem && permiso.menuItem.seccion)
        .map(permiso => ({
          id_item: permiso.id_item,
          etiqueta: permiso.menuItem!.etiqueta,
          ruta: permiso.menuItem!.ruta,
          icono: permiso.menuItem!.icono,
          permitido: permiso.permitido,
          seccion: {
            id_seccion: permiso.menuItem!.seccion!.id_seccion,
            nombre: permiso.menuItem!.seccion!.nombre,
            orden: permiso.menuItem!.seccion!.orden,
          }
        }));
    } catch (error) {
      throw new Error(`Error al obtener permisos del perfil: ${error.message}`);
    }
  }

  /**
   * Obtiene el menú lateral filtrado por permisos para un perfil
   */
  async obtenerMenuLateralPorPerfil(id_perfil: string): Promise<SeccionConPermisos[]> {
    try {
      // Obtener todas las secciones activas
      const secciones = await this.menuSeccionRepository
        .createQueryBuilder('seccion')
        .leftJoinAndSelect('seccion.items', 'items')
        .where('seccion.estado = :estado', { estado: true })
        .andWhere('items.estado = :estadoItem', { estadoItem: true })
        .orderBy('seccion.orden', 'ASC')
        .addOrderBy('items.orden', 'ASC')
        .getMany();

      // Obtener permisos del perfil
      const permisos = await this.obtenerPermisosPorPerfil(id_perfil);
      
      // Crear mapa de permisos por item para búsqueda rápida
      const permisosMap = new Map<string, boolean>();
      permisos.forEach(permiso => {
        permisosMap.set(permiso.id_item, permiso.permitido);
      });

      // Filtrar secciones y items según permisos
      const seccionesConPermisos: SeccionConPermisos[] = secciones.map(seccion => {
        const itemsConPermisos = (seccion.items || [])
          .filter(item => permisosMap.has(item.id_item) && permisosMap.get(item.id_item))
          .map(item => {
            const permiso = permisos.find(p => p.id_item === item.id_item);
            return {
              id_item: item.id_item,
              etiqueta: item.etiqueta,
              ruta: item.ruta,
              icono: item.icono,
              permitido: true,
              seccion: {
                id_seccion: seccion.id_seccion,
                nombre: seccion.nombre,
                orden: seccion.orden,
              }
            };
          });

        const tienePermisos = itemsConPermisos.length > 0;

        return {
          id_seccion: seccion.id_seccion,
          nombre: seccion.nombre,
          orden: seccion.orden,
          icono: seccion.icono,
          items: itemsConPermisos,
          tienePermisos
        };
      });

      // Solo retornar secciones que tengan al menos un item con permisos
      return seccionesConPermisos.filter(seccion => seccion.tienePermisos);
    } catch (error) {
      throw new Error(`Error al obtener menú lateral: ${error.message}`);
    }
  }

  /**
   * Determina qué opciones del menú superior debe ver un perfil
   * basándose en si tiene permisos en las secciones correspondientes
   */
  async obtenerOpcionesMenuSuperior(id_perfil: string): Promise<string[]> {
    try {
      const menuLateral = await this.obtenerMenuLateralPorPerfil(id_perfil);
      
      // Mapear secciones a opciones del menú superior
      const opcionesPermitidas = new Set<string>();
      
      menuLateral.forEach(seccion => {
        // Mapeo de secciones a opciones del menú superior
        const mapeoSeccionOpcion = this.mapearSeccionAOpcionMenu(seccion.nombre);
        if (mapeoSeccionOpcion) {
          opcionesPermitidas.add(mapeoSeccionOpcion);
        }
      });

      return Array.from(opcionesPermitidas);
    } catch (error) {
      throw new Error(`Error al obtener opciones del menú superior: ${error.message}`);
    }
  }

  /**
   * Mapea el nombre de una sección a la opción correspondiente del menú superior
   */
  private mapearSeccionAOpcionMenu(nombreSeccion: string): string | null {
    const mapeo: { [key: string]: string } = {
      'Administración': 'inicio',
      'Empresa': 'inicio',
      'Sucursal': 'inicio',
      'Menú': 'inicio',
      'Perfil': 'inicio',
      'Usuario': 'inicio',
      'Terceros': 'terceros',
      'Servicios': 'servicios',
      'Proyectos': 'proyectos',
      'Comercial': 'comercial',
      'Financiera': 'financiera',
      'Bancos': 'bancos',
      'Contabilidad': 'contabilidad',
      'RRHH': 'rrhh',
      'Documentos': 'documentos',
      'Agenda': 'agenda',
      'Tickets': 'tickets',
      'Utilidades': 'utilidades'
    };

    return mapeo[nombreSeccion] || null;
  }

  /**
   * Valida si un perfil tiene acceso a una ruta específica
   */
  async validarAccesoRuta(id_perfil: string, ruta: string): Promise<boolean> {
    try {
      const permiso = await this.perfilMenuPermisoRepository
        .createQueryBuilder('pmp')
        .leftJoinAndSelect('pmp.menuItem', 'menuItem')
        .where('pmp.id_perfil = :id_perfil', { id_perfil })
        .andWhere('pmp.permitido = :permitido', { permitido: true })
        .andWhere('menuItem.ruta = :ruta', { ruta })
        .andWhere('menuItem.estado = :estado', { estado: true })
        .getOne();

      return !!permiso;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene información completa del perfil con sus permisos
   */
  async obtenerPerfilConPermisos(id_perfil: string): Promise<PerfilConPermisos> {
    try {
      const perfil = await this.perfilRepository.findOne({
        where: { id_perfil }
      });

      if (!perfil) {
        throw new Error('Perfil no encontrado');
      }

      const menuLateral = await this.obtenerMenuLateralPorPerfil(id_perfil);
      const totalPermisos = menuLateral.reduce((total, seccion) => total + seccion.items.length, 0);
      const permisosActivos = totalPermisos; // Todos los permisos retornados están activos

      return {
        id_perfil: perfil.id_perfil,
        nombre: perfil.nombre,
        estado: perfil.estado,
        secciones: menuLateral,
        totalPermisos,
        permisosActivos
      };
    } catch (error) {
      throw new Error(`Error al obtener perfil con permisos: ${error.message}`);
    }
  }

  /**
   * Obtiene permisos agrupados por módulo del menú superior
   */
  async obtenerPermisosPorModulo(id_perfil: string): Promise<{ [modulo: string]: PermisoMenu[] }> {
    try {
      const permisos = await this.obtenerPermisosPorPerfil(id_perfil);
      const permisosPorModulo: { [modulo: string]: PermisoMenu[] } = {};

      permisos.forEach(permiso => {
        const modulo = this.mapearSeccionAOpcionMenu(permiso.seccion.nombre);
        if (modulo) {
          if (!permisosPorModulo[modulo]) {
            permisosPorModulo[modulo] = [];
          }
          permisosPorModulo[modulo].push(permiso);
        }
      });

      return permisosPorModulo;
    } catch (error) {
      throw new Error(`Error al obtener permisos por módulo: ${error.message}`);
    }
  }
}
