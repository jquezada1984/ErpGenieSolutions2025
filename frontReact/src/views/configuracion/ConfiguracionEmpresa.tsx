import React, { useEffect } from 'react';
import { Alert, Card, CardBody, CardTitle, Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import ConfigEmpresaBar from '../../components/ConfigEmpresaBar';
import { useConfigEmpresaScope } from '../../hooks/useConfigEmpresaScope';

/**
 * Empresa del contexto: EMPRESA → JWT; GLOBAL → selector.
 * Reutiliza EditarEmpresa vía navegación a /empresas/editar/:id.
 */
const ConfiguracionEmpresa: React.FC = () => {
  const navigate = useNavigate();
  const empresaScope = useConfigEmpresaScope();
  const { idEmpresa, ready, scopeGlobal, loadingEmpresas } = empresaScope;

  useEffect(() => {
    if (!ready || !idEmpresa) return;
    navigate(`/empresas/editar/${idEmpresa}`, { replace: true });
  }, [ready, idEmpresa, navigate]);

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Empresa / Organización</CardTitle>
        <p className="text-muted">
          {scopeGlobal
            ? 'Seleccione la empresa a configurar. Se abrirá su ficha.'
            : 'Se abrirá la ficha de su empresa.'}
        </p>
        <ConfigEmpresaBar scope={empresaScope} />
        {!ready && scopeGlobal && (
          <Alert color="info" className="mt-3 mb-0">
            Seleccione una empresa para continuar.
          </Alert>
        )}
        {(loadingEmpresas || ready) && (
          <div className="d-flex align-items-center gap-2 mt-3 text-muted">
            <Spinner size="sm" /> Abriendo ficha…
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ConfiguracionEmpresa;
