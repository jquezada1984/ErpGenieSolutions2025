import React, { useEffect, useState } from 'react';
import SearchableSelect from '../SearchableSelect';
import { getDirectorios } from '../../_apis_/directorio';

interface Props {
  module: string;
  value?: string;
  onChange: (value: string | null) => void;
  isDisabled?: boolean;
  empresaId?: string;
}

const SelectDirectorioDocumento: React.FC<Props> = ({
  module,
  value,
  onChange,
  isDisabled = false,
  empresaId,
}) => {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!module || !empresaId) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const data = await getDirectorios(module, empresaId);

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
  }, [module, empresaId]);

  return (
    <SearchableSelect
      options={options}
      value={value}
      onChange={onChange}
      isLoading={loading}
      isDisabled={isDisabled || loading || !empresaId}
      placeholder={
        !empresaId
          ? 'Seleccione empresa primero'
          : 'Seleccionar carpeta (opcional)'
      }
    />
  );
};

export default SelectDirectorioDocumento;

