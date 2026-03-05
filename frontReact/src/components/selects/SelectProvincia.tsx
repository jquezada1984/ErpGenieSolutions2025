import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import SearchableSelect from '../SearchableSelect';

const GET_PROVINCIAS = gql`
  query GetProvincias {
    provincias {
      id_provincia
      nombre
    }
  }
`;

const GET_PROVINCIAS_BY_PAIS = gql`
  query ProvinciasByPais($idPais: String!) {
    provinciasByPais(idPais: $idPais) {
      id_provincia
      nombre
    }
  }
`;

export interface SelectProvinciaProps {
  value?: string | null;
  onChange: (id_provincia: string | null) => void;
  id_pais?: string | null;
  isDisabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  error?: string;
}

const SelectProvincia: React.FC<SelectProvinciaProps> = ({
  value,
  onChange,
  id_pais,
  isDisabled = false,
  isLoading: isLoadingProp = false,
  placeholder = 'Seleccionar provincia',
  error,
}) => {
  const useByPais = Boolean(id_pais && id_pais.trim() !== '');

  const { data: allData, loading: loadingAll } = useQuery<{
    provincias: { id_provincia: string; nombre: string }[];
  }>(GET_PROVINCIAS, {
    skip: useByPais,
  });

  const { data: byPaisData, loading: loadingByPais } = useQuery<{
    provinciasByPais: { id_provincia: string; nombre: string }[];
  }>(GET_PROVINCIAS_BY_PAIS, {
    variables: { idPais: id_pais ?? '' },
    skip: !useByPais,
  });

  const provincias = useByPais
    ? byPaisData?.provinciasByPais ?? []
    : allData?.provincias ?? [];

  const loading = useByPais ? loadingByPais : loadingAll;
  const isLoading = loading || isLoadingProp;

  const options = useMemo(
    () =>
      provincias.map((p) => ({
        value: p.id_provincia,
        label: p.nombre,
      })),
    [provincias]
  );

  return (
    <SearchableSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default SelectProvincia;
