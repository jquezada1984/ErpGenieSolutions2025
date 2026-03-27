import React, { useEffect, useState } from 'react';
import SearchableSelect from '../SearchableSelect';
import { getDirectorios } from '../../_apis_/directorio';

interface Props {
  module: string;
  value?: string;
  onChange: (value: string | null) => void;
  isDisabled?: boolean;
}

const SelectDirectorioDocumento: React.FC<Props> = ({
  module,
  value,
  onChange,
  isDisabled = false,
}) => {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!module) return;

      setLoading(true);
      try {
        const data = await getDirectorios(module);

        const mapped = (data || []).map((d: any) => ({
          value: d.id_directorio_documento,
          label: d.nombre,
        }));

        setOptions(mapped);
      } catch (e) {
        console.error('Error cargando directorios:', e);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [module]);

  return (
    <SearchableSelect
      options={options}
      value={value}
      onChange={onChange}
      isLoading={loading}
      isDisabled={isDisabled || loading}
      placeholder="Seleccionar carpeta (opcional)"
    />
  );
};

export default SelectDirectorioDocumento;

