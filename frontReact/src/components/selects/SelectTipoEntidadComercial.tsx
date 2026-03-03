import React from 'react';
import SearchableSelect from '../SearchableSelect';

export interface SelectTipoEntidadComercialProps {
  value?: number;
  onChange?: (value?: number) => void;
  tipos: { id_tipo_entidad: number; nombre: string }[];
  isLoading?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  error?: string;
}

const SelectTipoEntidadComercial: React.FC<SelectTipoEntidadComercialProps> = ({
  value,
  onChange,
  tipos,
  isLoading,
  isDisabled,
  placeholder,
  error,
}) => {
  const options = tipos.map((t) => ({
    value: String(t.id_tipo_entidad),
    label: t.nombre,
  }));

  const valueStr = value != null ? String(value) : null;

  return (
    <SearchableSelect
      value={valueStr}
      onChange={(val) => {
        if (onChange) {
          onChange(val != null && val !== '' ? Number(val) : undefined);
        }
      }}
      options={options}
      isLoading={isLoading}
      isDisabled={isDisabled}
      placeholder={placeholder}
      error={error}
    />
  );
};

export default SelectTipoEntidadComercial;
