import React from 'react';
import DiccionarioCrudPage from './DiccionarioCrudPage';
import { RECURSOS } from '../../../../_apis_/catalogos';

const TipoEntidadLegalDiccionario = () => (
  <DiccionarioCrudPage
    titulo="Tipo de entidad legal para Terceros"
    recurso={RECURSOS.tipoEntidadLegal}
    idField="id_tipo_entidad"
    emptyForm={{ nombre: '', descripcion: '', activo: true }}
    fields={[
      { name: 'nombre', label: 'Etiqueta', required: true },
      { name: 'descripcion', label: 'Descripción', table: false },
      { name: 'activo', label: 'Estado' },
    ]}
  />
);

export default TipoEntidadLegalDiccionario;
