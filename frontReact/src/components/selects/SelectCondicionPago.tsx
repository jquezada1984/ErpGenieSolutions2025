import React from 'react';
import SearchableSelect from '../SearchableSelect';

export interface SelectCondicionPagoProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  condiciones: {
    id_condicion_pago: string;
    descripcion?: string;
    etiqueta?: string;
  }[];
  isLoading?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  error?: string;
}

const SelectCondicionPago: React.FC<SelectCondicionPagoProps> = ({
  value,
  onChange,
  condiciones,
  isLoading,
  isDisabled,
  placeholder,
  error,
}) => {
  const options = condiciones.map((c) => ({
    value: c.id_condicion_pago,
    label: c.etiqueta || c.descripcion || c.id_condicion_pago,
  }));

  return (
    <SearchableSelect
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      isDisabled={isDisabled}
      placeholder={placeholder}
      error={error}
    />
  );
};

export default SelectCondicionPago;
