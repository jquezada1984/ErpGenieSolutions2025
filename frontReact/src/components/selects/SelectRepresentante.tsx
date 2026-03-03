import React from 'react';
import SearchableSelect from '../SearchableSelect';

export interface SelectRepresentanteProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  representantes: {
    id_tercero: string;
    nombre: string;
  }[];
  isLoading?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  error?: string;
}

const SelectRepresentante: React.FC<SelectRepresentanteProps> = ({
  value,
  onChange,
  representantes,
  isLoading,
  isDisabled,
  placeholder,
  error,
}) => {

  const options = representantes.map((rep) => ({
    value: rep.id_tercero,
    label: rep.nombre,
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

export default SelectRepresentante;
