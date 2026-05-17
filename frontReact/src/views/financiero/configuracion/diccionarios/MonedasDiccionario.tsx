import React from 'react';
import DiccionarioCrudPage from './DiccionarioCrudPage';
import { RECURSOS } from '../../../../_apis_/catalogos';

const MonedasDiccionario = () => (
  <DiccionarioCrudPage
    titulo="Monedas"
    recurso={RECURSOS.monedas}
    idField="id_moneda"
    emptyForm={{ codigo: '', nombre: '', simbolo_unicode: '', activo: true }}
    fields={[
      { name: 'codigo', label: 'Código', required: true },
      { name: 'nombre', label: 'Etiqueta', required: true },
      { name: 'simbolo_unicode', label: 'Unicode' },
      { name: 'activo', label: 'Estado' },
    ]}
  />
);

export default MonedasDiccionario;
