import React from 'react';
import SearchableSelect from '../SearchableSelect';

export interface SelectTipoTerceroProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  tipos: {
    id_tipo_tercero: string;
    nombre: string;
  }[];
  isLoading?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  error?: string;
}

const SelectTipoTercero: React.FC<SelectTipoTerceroProps> = ({
  value,
  onChange,
  tipos,
  isLoading,
  isDisabled,
  placeholder,
  error,
}) => {
  const options = tipos.map((t) => ({
    value: t.id_tipo_tercero,
    label: t.nombre,
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

export default SelectTipoTercero;
