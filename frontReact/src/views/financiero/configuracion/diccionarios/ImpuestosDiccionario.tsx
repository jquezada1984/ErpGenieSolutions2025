import React from 'react';
import DiccionarioCrudPage from './DiccionarioCrudPage';
import { RECURSOS } from '../../../../_apis_/catalogos';

const ImpuestosDiccionario = () => (
  <DiccionarioCrudPage
    titulo="Impuestos / IVA"
    recurso={RECURSOS.impuestos}
    idField="id"
    emptyForm={{
      codigo: '',
      nombre: '',
      tasa: 0,
      activo: true,
    }}
    fields={[
      { name: 'codigo', label: 'Código', required: true },
      { name: 'nombre', label: 'Nombre', required: true },
      { name: 'tasa', label: 'Tasa %', type: 'number', required: true },
      { name: 'activo', label: 'Estado' },
    ]}
  />
);

export default ImpuestosDiccionario;
