import { useState, useEffect, useCallback } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { menuClient } from '../../config/apollo-client';

// GraphQL queries para permisos - Ahora van por el gateway
const GET_PERMISOS_POR_PERFIL = gql`
  query GetPermisosPorPerfil($id_perfil: ID!) {
    permisosPorPerfil(id_perfil: $id_perfil) {
      id_item
      etiqueta
      ruta
      icono
      permitido
      seccion {
        id_seccion
        nombre
        orden
      }
    }
  }
`;

const GET_MENU_LATERAL_POR_PERFIL = gql`
  query GetMenuLateralPorPerfil($id_perfil: ID!) {
    menuLateralPorPerfil(id_perfil: $id_perfil) {
      id_seccion
      nombre
      orden
      icono
      tienePermisos
      items {
        id_item
        etiqueta
        ruta
        icono
        permitido
        seccion {
          id_seccion
          nombre
          orden
        }
      }
    }
  }
`;

// Nueva consulta para obtener menú principal ordenado (sin parent_id)
const GET_MENU_PRINCIPAL_ORDENADO = gql`
  query GetMenuPrincipalOrdenado($id_seccion: ID!) {
    menuPrincipalOrdenado(id_seccion: $id_seccion) {
      id_item
      id_seccion
      parent_id
      etiqueta
      icono
      ruta
      es_clickable
      orden
      muestra_badge
      badge_text
      estado
      created_by
      created_at
      updated_by
      updated_at
    }
  }
`;

// Nueva consulta para obtener submenús de un item específico
const GET_SUBMENUS_ORDENADOS = gql`
  query GetSubmenusOrdenados($parent_id: ID!) {
    submenusOrdenados(parent_id: $parent_id) {
      id_item
      id_seccion
      parent_id
      etiqueta
      icono
      ruta
      es_clickable
      orden
      muestra_badge
      badge_text
      estado
      created_by
      created_at
      updated_by
      updated_at
    }
  }
`;

const GET_OPCIONES_MENU_SUPERIOR = gql`
  query GetOpcionesMenuSuperior($id_perfil: ID!) {
    opcionesMenuSuperior(id_perfil: $id_perfil)
  }
`;

const GET_PERFIL_CON_PERMISOS = gql`
  query GetPerfilConPermisos($id_perfil: ID!) {
    perfilConPermisos(id_perfil: $id_perfil) {
      id_perfil
      nombre
      estado
      totalPermisos
      permisosActivos
      secciones {
        id_seccion
        nombre
        orden
        icono
        tienePermisos
        items {
          id_item
          etiqueta
          ruta
          icono
          permitido
          seccion {
            id_seccion
            nombre
            orden
          }
        }
      }
    }
  }
`;

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
  tienePermisos: boolean;
  items: PermisoMenu[];
}

// Nueva interfaz para el menú ordenado jerárquico
export interface MenuItemOrdenado {
  id_item: string;
  id_seccion: string;
  parent_id?: string;
  etiqueta: string;
  icono?: string;
  ruta?: string;
  es_clickable: boolean;
  orden: number;
  muestra_badge: boolean;
  badge_text?: string;
  estado: boolean;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
  children?: MenuItemOrdenado[]; // Para submenús
}

// Interfaz para el menú lateral ordenado
export interface MenuLateralOrdenado {
  id_seccion: string;
  nombre: string;
  orden: number;
  icono?: string;
  items: MenuItemOrdenado[];
}

export interface PerfilConPermisos {
  id_perfil: string;
  nombre: string;
  estado: boolean;
  totalPermisos: number;
  permisosActivos: number;
  secciones: SeccionConPermisos[];
}

export interface UsePermissionsReturn {
  // Estado
  loading: boolean;
  error: string | null;
  
  // Datos
  permisos: PermisoMenu[];
  menuLateral: SeccionConPermisos[];
  menuLateralOrdenado: MenuLateralOrdenado[];
  opcionesMenuSuperior: string[];
  perfilCompleto: PerfilConPermisos | null;
  
  // Funciones
  cargarPermisos: (id_perfil: string) => Promise<void>;
  cargarMenuLateral: (id_perfil: string) => Promise<void>;
  cargarMenuLateralOrdenado: (id_seccion: string) => Promise<void>;
  cargarOpcionesMenuSuperior: (id_perfil: string) => Promise<void>;
  cargarPerfilCompleto: (id_perfil: string) => Promise<void>;
  
  // Utilidades
  tienePermiso: (ruta: string) => boolean;
  tienePermisoEnModulo: (modulo: string) => boolean;
  obtenerItemsPorSeccion: (nombreSeccion: string) => PermisoMenu[];
}

export const usePermissions = (): UsePermissionsReturn => {
  const [permisos, setPermisos] = useState<PermisoMenu[]>([]);
  const [menuLateral, setMenuLateral] = useState<SeccionConPermisos[]>([]);
  const [menuLateralOrdenado, setMenuLateralOrdenado] = useState<MenuLateralOrdenado[]>([]);
  const [opcionesMenuSuperior, setOpcionesMenuSuperior] = useState<string[]>([]);
  const [perfilCompleto, setPerfilCompleto] = useState<PerfilConPermisos | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('🔍 DEBUG - usePermissions - Hook inicializado');
  console.log('🔍 DEBUG - usePermissions - Usando cliente específico para permisos (MenuNestJs)');


  // Queries GraphQL usando el cliente específico para permisos (MenuNestJs)
  const [getPermisosPorPerfil, { loading: loadingPermisos }] = useLazyQuery(GET_PERMISOS_POR_PERFIL, { client: menuClient });
  const [getMenuLateralPorPerfil, { loading: loadingMenuLateral }] = useLazyQuery(GET_MENU_LATERAL_POR_PERFIL, { client: menuClient });
  const [getMenuPrincipalOrdenado, { loading: loadingMenuPrincipal }] = useLazyQuery(GET_MENU_PRINCIPAL_ORDENADO, { client: menuClient });
  const [getSubmenusOrdenados, { loading: loadingSubmenus }] = useLazyQuery(GET_SUBMENUS_ORDENADOS, { client: menuClient });
  const [getOpcionesMenuSuperior, { loading: loadingOpciones }] = useLazyQuery(GET_OPCIONES_MENU_SUPERIOR, { client: menuClient });
  const [getPerfilConPermisos, { loading: loadingPerfil }] = useLazyQuery(GET_PERFIL_CON_PERMISOS, { client: menuClient });

  // Actualizar loading general
  useEffect(() => {
    setLoading(loadingPermisos || loadingMenuLateral || loadingMenuPrincipal || loadingSubmenus || loadingOpciones || loadingPerfil);
  }, [loadingPermisos, loadingMenuLateral, loadingMenuPrincipal, loadingSubmenus, loadingOpciones, loadingPerfil]);

  // Cargar permisos por perfil
  const cargarPermisos = useCallback(async (id_perfil: string) => {
    try {
      setError(null);
      const { data } = await getPermisosPorPerfil({ variables: { id_perfil } });
      
      if (data?.permisosPorPerfil) {
        setPermisos(data.permisosPorPerfil);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar permisos');
      console.error('❌ ERROR en cargarPermisos:', err);
    }
  }, [getPermisosPorPerfil]);

  // Cargar menú lateral por perfil
  const cargarMenuLateral = useCallback(async (id_perfil: string) => {
    try {
      setError(null);
      console.log('🔍 DEBUG - usePermissions - Cargando menú lateral para perfil:', id_perfil);
      const { data, error } = await getMenuLateralPorPerfil({ variables: { id_perfil } });
      
      console.log('🔍 DEBUG - usePermissions - Respuesta menú lateral:', { data, error });
      
      if (data?.menuLateralPorPerfil) {
        console.log('🔍 DEBUG - usePermissions - Menú lateral cargado:', data.menuLateralPorPerfil);
        setMenuLateral(data.menuLateralPorPerfil);
      } else {
        console.log('🔍 DEBUG - usePermissions - No hay datos de menú lateral');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar menú lateral');
      console.error('❌ ERROR en cargarMenuLateral:', err);
    }
  }, [getMenuLateralPorPerfil]);

  // Cargar menú lateral ordenado jerárquicamente
  const cargarMenuLateralOrdenado = useCallback(async (id_seccion: string) => {
    try {
      setError(null);
      console.log('🔍 DEBUG - usePermissions - Cargando menú lateral ordenado para sección:', id_seccion);
      
      // Obtener menú principal (items sin parent_id)
      const { data: menuPrincipal, error: errorPrincipal } = await getMenuPrincipalOrdenado({ 
        variables: { id_seccion } 
      });
      
      console.log('🔍 DEBUG - usePermissions - Menú principal:', { menuPrincipal, errorPrincipal });
      
      if (errorPrincipal) {
        throw new Error(`Error al cargar menú principal: ${errorPrincipal.message}`);
      }
      
      if (!menuPrincipal?.menuPrincipalOrdenado) {
        console.log('🔍 DEBUG - usePermissions - No hay menú principal disponible');
        return;
      }
      
      const itemsPrincipales = menuPrincipal.menuPrincipalOrdenado;
      console.log('🔍 DEBUG - usePermissions - Items principales encontrados:', itemsPrincipales.length);
      
      // Para cada item principal, obtener sus submenús
      const menuCompleto: MenuItemOrdenado[] = [];
      
      for (const item of itemsPrincipales) {
        console.log('🔍 DEBUG - usePermissions - Procesando item principal:', item.etiqueta);
        
        // Obtener submenús de este item
        const { data: submenus, error: errorSubmenus } = await getSubmenusOrdenados({ 
          variables: { parent_id: item.id_item } 
        });
        
        if (errorSubmenus) {
          console.error('❌ ERROR al cargar submenús para', item.etiqueta, ':', errorSubmenus);
        }
        
        const itemConSubmenus: MenuItemOrdenado = {
          ...item,
          children: submenus?.submenusOrdenados || []
        };
        
        console.log('🔍 DEBUG - usePermissions - Item con submenús:', {
          etiqueta: item.etiqueta,
          submenus: itemConSubmenus.children?.length || 0
        });
        
        menuCompleto.push(itemConSubmenus);
      }
      
      // Crear estructura del menú lateral ordenado
      const menuLateralOrdenado: MenuLateralOrdenado = {
        id_seccion,
        nombre: 'Administración', // Nombre de la sección
        orden: 1,
        icono: 'bi bi-gear',
        items: menuCompleto
      };
      
      console.log('🔍 DEBUG - usePermissions - Menú lateral ordenado creado:', menuLateralOrdenado);
      setMenuLateralOrdenado([menuLateralOrdenado]);
      
    } catch (err: any) {
      setError(err.message || 'Error al cargar menú lateral ordenado');
      console.error('❌ ERROR en cargarMenuLateralOrdenado:', err);
    }
  }, [getMenuPrincipalOrdenado, getSubmenusOrdenados]);

  // Cargar opciones del menú superior
  const cargarOpcionesMenuSuperior = useCallback(async (id_perfil: string) => {
    try {
      setError(null);
      console.log('🔍 DEBUG - usePermissions - Cargando opciones menú superior para perfil:', id_perfil);
      const { data, error } = await getOpcionesMenuSuperior({ variables: { id_perfil } });
      
      console.log('🔍 DEBUG - usePermissions - Respuesta opciones menú superior:', { data, error });
      
      if (data?.opcionesMenuSuperior) {
        console.log('🔍 DEBUG - usePermissions - Opciones menú superior cargadas:', data.opcionesMenuSuperior);
        setOpcionesMenuSuperior(data.opcionesMenuSuperior);
      } else {
        console.log('🔍 DEBUG - usePermissions - No hay datos de opciones menú superior');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar opciones del menú superior');
      console.error('❌ ERROR en cargarOpcionesMenuSuperior:', err);
    }
  }, [getOpcionesMenuSuperior]);

  // Cargar perfil completo con permisos
  const cargarPerfilCompleto = useCallback(async (id_perfil: string) => {
    try {
      setError(null);
      const { data } = await getPerfilConPermisos({ variables: { id_perfil } });
      
      if (data?.perfilConPermisos) {
        setPerfilCompleto(data.perfilConPermisos);
        // También actualizar los otros estados
        setPermisos(data.perfilConPermisos.secciones.flatMap((s: any) => s.items));
        setMenuLateral(data.perfilConPermisos.secciones);
        
        // Mapear secciones a opciones del menú superior
        const opciones = data.perfilConPermisos.secciones
          .map((s: any) => s.nombre) // Usar el nombre real de la sección
          .filter(Boolean);
        setOpcionesMenuSuperior(opciones);
        
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar perfil completo');
      console.error('❌ ERROR en cargarPerfilCompleto:', err);
    }
  }, [getPerfilConPermisos]);

  // Verificar si tiene permiso para una ruta específica
  const tienePermiso = useCallback((ruta: string): boolean => {
    return permisos.some(permiso => 
      permiso.permitido && permiso.ruta === ruta
    );
  }, [permisos]);

  // Verificar si tiene permisos en un módulo específico
  const tienePermisoEnModulo = useCallback((modulo: string): boolean => {
    return opcionesMenuSuperior.includes(modulo);
  }, [opcionesMenuSuperior]);

  // Obtener items por sección
  const obtenerItemsPorSeccion = useCallback((nombreSeccion: string): PermisoMenu[] => {
    return permisos.filter(permiso => 
      permiso.permitido && permiso.seccion.nombre === nombreSeccion
    );
  }, [permisos]);

  // Log del estado actual
  useEffect(() => {
    console.log('🔍 DEBUG - usePermissions - Estado actual:', {
      permisos: permisos.length,
      menuLateral: menuLateral.length,
      menuLateralOrdenado: menuLateralOrdenado.length,
      opcionesMenuSuperior: opcionesMenuSuperior.length,
      perfilCompleto: !!perfilCompleto,
      loading,
      error
    });
  }, [permisos, menuLateral, menuLateralOrdenado, opcionesMenuSuperior, perfilCompleto, loading, error]);

  return {
    // Estado
    loading,
    error,
    
    // Datos
    permisos,
    menuLateral,
    menuLateralOrdenado,
    opcionesMenuSuperior,
    perfilCompleto,
    
    // Funciones
    cargarPermisos,
    cargarMenuLateral,
    cargarMenuLateralOrdenado,
    cargarOpcionesMenuSuperior,
    cargarPerfilCompleto,
    
    // Utilidades
    tienePermiso,
    tienePermisoEnModulo,
    obtenerItemsPorSeccion,
  };
};
