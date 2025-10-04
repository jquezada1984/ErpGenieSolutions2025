import { useState, useEffect, useCallback } from 'react';
import { useLazyQuery, gql } from '@apollo/client';

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
  opcionesMenuSuperior: string[];
  perfilCompleto: PerfilConPermisos | null;
  
  // Funciones
  cargarPermisos: (id_perfil: string) => Promise<void>;
  cargarMenuLateral: (id_perfil: string) => Promise<void>;
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
  const [opcionesMenuSuperior, setOpcionesMenuSuperior] = useState<string[]>([]);
  const [perfilCompleto, setPerfilCompleto] = useState<PerfilConPermisos | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('🔍 DEBUG - usePermissions - Hook inicializado');
  console.log('🔍 DEBUG - usePermissions - Usando gateway para todas las consultas');

  // Queries GraphQL usando el cliente por defecto (gateway)
  const [getPermisosPorPerfil, { loading: loadingPermisos }] = useLazyQuery(GET_PERMISOS_POR_PERFIL);
  const [getMenuLateralPorPerfil, { loading: loadingMenuLateral }] = useLazyQuery(GET_MENU_LATERAL_POR_PERFIL);
  const [getOpcionesMenuSuperior, { loading: loadingOpciones }] = useLazyQuery(GET_OPCIONES_MENU_SUPERIOR);
  const [getPerfilConPermisos, { loading: loadingPerfil }] = useLazyQuery(GET_PERFIL_CON_PERMISOS);

  // Actualizar loading general
  useEffect(() => {
    setLoading(loadingPermisos || loadingMenuLateral || loadingOpciones || loadingPerfil);
  }, [loadingPermisos, loadingMenuLateral, loadingOpciones, loadingPerfil]);

  // Cargar permisos por perfil
  const cargarPermisos = useCallback(async (id_perfil: string) => {
    try {
      console.log('🔍 DEBUG - cargarPermisos - Iniciando con id_perfil:', id_perfil);
      setError(null);
      const { data } = await getPermisosPorPerfil({ variables: { id_perfil } });
      
      console.log('🔍 DEBUG - cargarPermisos - Respuesta:', data);
      
      if (data?.permisosPorPerfil) {
        setPermisos(data.permisosPorPerfil);
        console.log('🔍 DEBUG - cargarPermisos - Permisos establecidos:', data.permisosPorPerfil);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar permisos');
      console.error('❌ ERROR en cargarPermisos:', err);
    }
  }, [getPermisosPorPerfil]);

  // Cargar menú lateral por perfil
  const cargarMenuLateral = useCallback(async (id_perfil: string) => {
    try {
      console.log('🔍 DEBUG - cargarMenuLateral - Iniciando con id_perfil:', id_perfil);
      setError(null);
      const { data } = await getMenuLateralPorPerfil({ variables: { id_perfil } });
      
      console.log('🔍 DEBUG - cargarMenuLateral - Respuesta:', data);
      
      if (data?.menuLateralPorPerfil) {
        setMenuLateral(data.menuLateralPorPerfil);
        console.log('🔍 DEBUG - cargarMenuLateral - Menú lateral establecido:', data.menuLateralPorPerfil);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar menú lateral');
      console.error('❌ ERROR en cargarMenuLateral:', err);
    }
  }, [getMenuLateralPorPerfil]);

  // Cargar opciones del menú superior
  const cargarOpcionesMenuSuperior = useCallback(async (id_perfil: string) => {
    try {
      console.log('🔍 DEBUG - cargarOpcionesMenuSuperior - Iniciando con id_perfil:', id_perfil);
      setError(null);
      const { data } = await getOpcionesMenuSuperior({ variables: { id_perfil } });
      
      console.log('🔍 DEBUG - cargarOpcionesMenuSuperior - Respuesta:', data);
      
      if (data?.opcionesMenuSuperior) {
        setOpcionesMenuSuperior(data.opcionesMenuSuperior);
        console.log('🔍 DEBUG - cargarOpcionesMenuSuperior - Opciones establecidas:', data.opcionesMenuSuperior);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar opciones del menú superior');
      console.error('❌ ERROR en cargarOpcionesMenuSuperior:', err);
    }
  }, [getOpcionesMenuSuperior]);

  // Cargar perfil completo con permisos
  const cargarPerfilCompleto = useCallback(async (id_perfil: string) => {
    try {
      console.log('🔍 DEBUG - cargarPerfilCompleto - Iniciando con id_perfil:', id_perfil);
      setError(null);
      const { data } = await getPerfilConPermisos({ variables: { id_perfil } });
      
      console.log('🔍 DEBUG - cargarPerfilCompleto - Respuesta:', data);
      
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
        
        console.log('🔍 DEBUG - cargarPerfilCompleto - Perfil completo establecido:', data.perfilConPermisos);
        console.log('🔍 DEBUG - cargarPerfilCompleto - Opciones del menú superior:', opciones);
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
      opcionesMenuSuperior,
      perfilCompleto: !!perfilCompleto,
      loading,
      error
    });
  }, [permisos, menuLateral, opcionesMenuSuperior, perfilCompleto, loading, error]);

  return {
    // Estado
    loading,
    error,
    
    // Datos
    permisos,
    menuLateral,
    opcionesMenuSuperior,
    perfilCompleto,
    
    // Funciones
    cargarPermisos,
    cargarMenuLateral,
    cargarOpcionesMenuSuperior,
    cargarPerfilCompleto,
    
    // Utilidades
    tienePermiso,
    tienePermisoEnModulo,
    obtenerItemsPorSeccion,
  };
};
