import React from 'react';
import SearchableSelect from './SearchableSelect';

export type TipoComportamientoItemOption = {
  id_tipo_comportamiento: string;
  codigo: string;
  nombre: string;
};

export interface SelectTipoComportamientoItemProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  tipos: TipoComportamientoItemOption[];
  isLoading?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  error?: string;
}

/** Mismo patrón que SelectTipoItemCatalogo. Value = id_tipo_comportamiento (UUID). */
const SelectTipoComportamientoItem: React.FC<SelectTipoComportamientoItemProps> = ({
  value,
  onChange,
  tipos,
  isLoading,
  isDisabled,
  placeholder,
  error,
}) => {
  const options = tipos.map((t) => ({
    value: t.id_tipo_comportamiento,
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

export default SelectTipoComportamientoItem;
