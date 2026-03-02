import React, { useMemo } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import type { StylesConfig } from 'react-select';

export interface SearchableSelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  options?: SearchableSelectOption[];
  loadOptions?: (inputValue: string) => Promise<SearchableSelectOption[]>;
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  error?: string;
}

function getSelectStyles(error?: string): StylesConfig<SearchableSelectOption, false> {
  return {
    control: (base, state) => ({
      ...base,
      width: '100%',
      minHeight: '38px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: error
        ? '#dc3545'
        : state.isFocused
          ? '#86b7fe'
          : '#ced4da',
      borderRadius: '0.25rem',
      boxShadow: state.isFocused && !error ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : 'none',
      '&:hover': {
        borderColor: error ? '#dc3545' : state.isFocused ? '#86b7fe' : '#adb5bd',
      },
    }),
    container: (base) => ({
      ...base,
      width: '100%',
    }),
  };
}

function valueToOption(
  value: string | null | undefined,
  options: SearchableSelectOption[] | undefined,
  useAsync: boolean
): SearchableSelectOption | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const found = options?.find((o) => o.value === value);
  if (found) return found;
  if (useAsync) {
    return { value, label: value };
  }
  return null;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onChange,
  options = [],
  loadOptions,
  placeholder = 'Seleccione...',
  isDisabled = false,
  isLoading = false,
  error,
}) => {
  const useAsync = typeof loadOptions === 'function';
  const selectValue = useMemo(
    () => valueToOption(value ?? null, options, useAsync),
    [value, options, useAsync]
  );

  const styles = useMemo(() => getSelectStyles(error), [error]);

  const handleChange = (option: SearchableSelectOption | null) => {
    onChange(option?.value ?? null);
  };

  const commonProps = {
    value: selectValue,
    onChange: handleChange,
    placeholder,
    isDisabled,
    isLoading,
    styles,
    isClearable: true,
  };

  if (useAsync) {
    return (
      <AsyncSelect<SearchableSelectOption>
        {...commonProps}
        loadOptions={loadOptions}
        defaultOptions={options?.length ? options : true}
        cacheOptions
      />
    );
  }

  return <Select<SearchableSelectOption> {...commonProps} options={options} />;
};

export default SearchableSelect;
