import { useCallback, useEffect, useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import useJwtPayload from '../hooks/useJwtPayload';
import { isScopeGlobal } from '../utils/scopeAcceso';

/** Clave compartida: Configuración, Contabilidad, Terceros, Facturación, etc. */
const STORAGE_KEY = 'erp.id_empresa';
const LEGACY_STORAGE_KEY = 'configuracion.id_empresa';

const GET_EMPRESAS = gql`
  query GetEmpresasConfigScope {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

export type EmpresaOption = {
  id_empresa: string;
  nombre: string;
  ruc: string;
  estado: boolean;
};

function readStoredEmpresa(): string {
  if (typeof sessionStorage === 'undefined') return '';
  try {
    const current = sessionStorage.getItem(STORAGE_KEY);
    if (current) return current;
    const legacy = sessionStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      sessionStorage.setItem(STORAGE_KEY, legacy);
      return legacy;
    }
  } catch {
    /* ignore */
  }
  return '';
}

/**
 * Scope de empresa (GLOBAL vs EMPRESA) para pantallas multiempresa.
 * GLOBAL: el usuario elige empresa (persistido en sessionStorage).
 * EMPRESA: fija id_empresa del JWT.
 */
export function useConfigEmpresaScope() {
  const payload = useJwtPayload();
  const scopeGlobal = isScopeGlobal(payload);
  const idEmpresaJwt = payload?.id_empresa || '';

  const [selectedIdEmpresa, setSelectedIdEmpresaState] = useState(readStoredEmpresa);

  const { data: empresasData, loading: loadingEmpresas } = useQuery(GET_EMPRESAS, {
    skip: !scopeGlobal,
  });

  const empresas: EmpresaOption[] = useMemo(
    () => (empresasData?.empresas || []).filter((e: EmpresaOption) => e.estado !== false),
    [empresasData],
  );

  useEffect(() => {
    if (!scopeGlobal && idEmpresaJwt) {
      setSelectedIdEmpresaState(idEmpresaJwt);
      try {
        sessionStorage.setItem(STORAGE_KEY, idEmpresaJwt);
      } catch {
        /* ignore */
      }
    }
  }, [scopeGlobal, idEmpresaJwt]);

  const setSelectedIdEmpresa = useCallback((id: string | null) => {
    const next = id || '';
    setSelectedIdEmpresaState(next);
    try {
      if (next) {
        sessionStorage.setItem(STORAGE_KEY, next);
        sessionStorage.setItem(LEGACY_STORAGE_KEY, next);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const idEmpresa = scopeGlobal ? selectedIdEmpresa : idEmpresaJwt;
  const ready = Boolean(idEmpresa);

  return {
    scopeGlobal,
    idEmpresa,
    selectedIdEmpresa,
    setSelectedIdEmpresa,
    empresas,
    loadingEmpresas,
    ready,
  };
}

/** Alias semántico para pantallas fuera de Configuración. */
export const useEmpresaScope = useConfigEmpresaScope;
