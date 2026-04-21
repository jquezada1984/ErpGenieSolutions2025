import React, { useMemo } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import type { StylesConfig } from 'react-select';

export interface SearchableSelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  value?: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  options?: SearchableSelectOption[];
  loadOptions?: (inputValue: string) => Promise<SearchableSelectOption[]>;
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  error?: string;
  isMulti?: boolean;
}

function getSelectStyles(error?: string): StylesConfig<SearchableSelectOption, boolean> {
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
  value: string | string[] | null | undefined,
  options: SearchableSelectOption[] | undefined,
  useAsync: boolean,
  isMulti: boolean
): SearchableSelectOption | SearchableSelectOption[] | null {
  if (isMulti) {
    const values = Array.isArray(value) ? value.filter((v) => v !== '') : [];
    if (values.length === 0) return [];
    const mapped = values.map((v) => options?.find((o) => o.value === v) || (useAsync ? { value: v, label: v } : null));
    return mapped.filter(Boolean) as SearchableSelectOption[];
  }

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
  isMulti = false,
}) => {
  const useAsync = typeof loadOptions === 'function';
  const selectValue = useMemo(
    () => valueToOption(value ?? null, options, useAsync, isMulti),
    [value, options, useAsync, isMulti]
  );

  const styles = useMemo(() => getSelectStyles(error), [error]);

  const handleChange = (option: SearchableSelectOption | SearchableSelectOption[] | null) => {
    if (isMulti) {
      const values = Array.isArray(option) ? option.map((o) => o.value) : [];
      onChange(values);
      return;
    }
    onChange((option as SearchableSelectOption | null)?.value ?? null);
  };

  const commonProps = {
    value: selectValue,
    onChange: handleChange,
    placeholder,
    isDisabled,
    isLoading,
    styles,
    isClearable: true,
    isMulti,
  };

  if (useAsync) {
    return (
      <AsyncSelect<SearchableSelectOption, boolean>
        {...commonProps}
        loadOptions={loadOptions}
        defaultOptions={options?.length ? options : true}
        cacheOptions
      />
    );
  }

  return <Select<SearchableSelectOption, boolean> {...commonProps} options={options} />;
};

export default SearchableSelect;
