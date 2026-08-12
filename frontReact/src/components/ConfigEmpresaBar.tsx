import React from 'react';
import { Alert, FormGroup, Label } from 'reactstrap';
import SelectEmpresa from '../components/SelectEmpresa';
import { useConfigEmpresaScope } from '../hooks/useConfigEmpresaScope';

type Props = {
  /** Si true, muestra alerta cuando GLOBAL aún no eligió empresa. */
  requireEmpresa?: boolean;
  className?: string;
  /** Hook externo (si la página ya lo usa). */
  scope?: ReturnType<typeof useConfigEmpresaScope>;
  /** Texto del aviso cuando falta empresa (GLOBAL). */
  emptyMessage?: string;
  /**
   * Si true y el usuario es EMPRESA, no renderiza nada
   * (solo su empresa vía JWT; sin combo).
   */
  hideWhenEmpresa?: boolean;
};

/**
 * Barra de empresa multiempresa.
 * GLOBAL → SelectEmpresa; EMPRESA → oculta combo (opcionalmente muestra empresa JWT).
 */
const ConfigEmpresaBar: React.FC<Props> = ({
  requireEmpresa = true,
  className = 'mb-3',
  scope: scopeProp,
  emptyMessage = 'Seleccione una empresa para continuar.',
  hideWhenEmpresa = false,
}) => {
  const internal = useConfigEmpresaScope();
  const scope = scopeProp || internal;
  const {
    scopeGlobal,
    idEmpresa,
    setSelectedIdEmpresa,
    empresas,
    loadingEmpresas,
    ready,
  } = scope;

  if (!scopeGlobal) {
    if (hideWhenEmpresa) return null;
    return (
      <Alert color="light" className={`${className} border py-2`} fade={false} timeout={0}>
        Empresa de la sesión: <strong>{idEmpresa || '—'}</strong>
      </Alert>
    );
  }

  return (
    <div className={className}>
      <FormGroup className="mb-2" style={{ maxWidth: 420 }}>
        <Label className="fw-semibold">Empresa</Label>
        <SelectEmpresa
          value={idEmpresa || null}
          onChange={setSelectedIdEmpresa}
          empresas={empresas}
          isLoading={loadingEmpresas}
          placeholder="Seleccione empresa…"
        />
      </FormGroup>
      {requireEmpresa && !ready && (
        <Alert color="warning" className="py-2 mb-0" fade={false} timeout={0}>
          {emptyMessage}
        </Alert>
      )}
    </div>
  );
};

export default ConfigEmpresaBar;
