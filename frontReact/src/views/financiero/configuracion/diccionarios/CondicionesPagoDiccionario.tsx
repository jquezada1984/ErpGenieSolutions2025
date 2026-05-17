import React from 'react';
import DiccionarioCrudPage from './DiccionarioCrudPage';
import { RECURSOS } from '../../../../_apis_/catalogos';

const FIN_MES = [
  { value: 'ninguno', label: 'Nada' },
  { value: 'fin_mes', label: 'A fin de mes' },
];

const CondicionesPagoDiccionario = () => (
  <DiccionarioCrudPage
    titulo="Condiciones de pago"
    recurso={RECURSOS.condicionesPago}
    idField="id_condicion_pago"
    emptyForm={{
      codigo: '',
      etiqueta: '',
      etiqueta_documento: '',
      porcentaje_deposito: 0,
      numero_dias: 0,
      tipo_fin_mes: 'ninguno',
      decalaje_dias: null,
      orden: 0,
      activo: true,
    }}
    fields={[
      { name: 'codigo', label: 'Código', required: true },
      { name: 'etiqueta', label: 'Etiqueta', required: true },
      { name: 'etiqueta_documento', label: 'Etiqueta sobre documentos', table: false },
      { name: 'porcentaje_deposito', label: 'Depósito %', type: 'number' },
      { name: 'numero_dias', label: 'Nº de días', type: 'number' },
      { name: 'tipo_fin_mes', label: 'A fin de mes', type: 'select', options: FIN_MES },
      { name: 'decalaje_dias', label: 'Decálogo', type: 'number', table: false },
      { name: 'orden', label: 'Ordenación', type: 'number', table: false },
      { name: 'activo', label: 'Estado' },
    ]}
  />
);

export default CondicionesPagoDiccionario;
