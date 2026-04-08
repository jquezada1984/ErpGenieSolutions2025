import React from 'react';
import SearchableSelect from './SearchableSelect';

export type TipoItemCatalogoOption = {
  id_tipo_item: string;
  codigo: string;
  nombre: string;
};

export interface SelectTipoItemCatalogoProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  tipos: TipoItemCatalogoOption[];
  isLoading?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  error?: string;
}

/** Mismo patrón visual que SelectEmpresa (SearchableSelect). Value = id_tipo_item (UUID). */
const SelectTipoItemCatalogo: React.FC<SelectTipoItemCatalogoProps> = ({
  value,
  onChange,
  tipos,
  isLoading,
  isDisabled,
  placeholder,
  error,
}) => {
  const options = tipos.map((t) => ({
    value: t.id_tipo_item,
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

export default SelectTipoItemCatalogo;
