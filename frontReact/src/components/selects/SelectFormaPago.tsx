import React from 'react';
import SearchableSelect from '../SearchableSelect';

export interface SelectFormaPagoProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  formas: {
    id_forma_pago: string;
    etiqueta: string;
  }[];
  isLoading?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  error?: string;
}

const SelectFormaPago: React.FC<SelectFormaPagoProps> = ({
  value,
  onChange,
  formas,
  isLoading,
  isDisabled,
  placeholder,
  error,
}) => {
  const options = formas.map((f) => ({
    value: f.id_forma_pago,
    label: f.etiqueta,
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

export default SelectFormaPago;
