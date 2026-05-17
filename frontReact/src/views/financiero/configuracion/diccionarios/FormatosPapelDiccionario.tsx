import React from 'react';
import DiccionarioCrudPage from './DiccionarioCrudPage';
import { RECURSOS } from '../../../../_apis_/catalogos';

const FormatosPapelDiccionario = () => (
  <DiccionarioCrudPage
    titulo="Formatos de papel"
    recurso={RECURSOS.formatosPapel}
    idField="id_formato_papel"
    emptyForm={{
      codigo: '',
      etiqueta: '',
      largo: 210,
      alto: 297,
      unidad_medida: 'mm',
      orden: 0,
      activo: true,
    }}
    fields={[
      { name: 'codigo', label: 'Código', required: true },
      { name: 'etiqueta', label: 'Etiqueta', required: true },
      { name: 'largo', label: 'Largo', type: 'number', required: true },
      { name: 'alto', label: 'Alto', type: 'number', required: true },
      { name: 'unidad_medida', label: 'Unidad de medida', required: true },
      { name: 'activo', label: 'Estado' },
    ]}
  />
);

export default FormatosPapelDiccionario;
