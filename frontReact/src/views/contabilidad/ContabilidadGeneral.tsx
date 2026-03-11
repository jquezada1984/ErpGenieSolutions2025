import React from 'react';
import { Card, CardBody } from 'reactstrap';

/**
 * Vista principal de Contabilidad General (diario general / asientos).
 * Ruta: /contabilidad/general
 */
const ContabilidadGeneral = () => {
  return (
    <div>
      <h4 className="mb-3">Contabilidad General</h4>
      <Card>
        <CardBody>
          <p className="text-muted mb-0">
            Diario general y asientos contables. Conectar con API de ContabilidadNestJs para listar asientos, crear y publicar.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default ContabilidadGeneral;
