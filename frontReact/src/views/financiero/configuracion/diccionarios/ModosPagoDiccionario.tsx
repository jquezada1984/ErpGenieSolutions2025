import React from 'react';
import DiccionarioCrudPage, { TIPO_USO_OPTS } from './DiccionarioCrudPage';
import { RECURSOS } from '../../../../_apis_/catalogos';

const ModosPagoDiccionario = () => (
  <DiccionarioCrudPage
    titulo="Modos de pago"
    recurso={RECURSOS.modosPago}
    idField="id_forma_pago"
    emptyForm={{
      codigo: '',
      etiqueta: '',
      tipo_uso: 'cliente_proveedor',
      orden: 0,
      activo: true,
    }}
    fields={[
      { name: 'codigo', label: 'Código', required: true },
      { name: 'etiqueta', label: 'Etiqueta', required: true },
      { name: 'tipo_uso', label: 'Tipo', type: 'select', options: TIPO_USO_OPTS, required: true },
      { name: 'activo', label: 'Estado', table: true },
    ]}
  />
);

export default ModosPagoDiccionario;
