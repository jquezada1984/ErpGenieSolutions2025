import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import CountryFlag from './CountryFlag';
import './CountrySelect.css';

interface Country {
  id_pais: string;
  nombre: string;
  codigo_iso: string;
  icono: string;
}

interface CountrySelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  countries: Country[];
  label: ReactNode;
}

// Mapeo de códigos ISO a emojis de banderas
const COUNTRY_FLAGS: { [key: string]: string } = {
  'AR': '🇦🇷', 'BO': '🇧🇴', 'BR': '🇧🇷', 'CL': '🇨🇱', 'CO': '🇨🇴',
  'CR': '🇨🇷', 'CU': '🇨🇺', 'EC': '🇪🇨', 'SV': '🇸🇻', 'ES': '🇪🇸',
  'US': '🇺🇸', 'GT': '🇬🇹', 'HN': '🇭🇳', 'MX': '🇲🇽', 'NI': '🇳🇮',
  'PA': '🇵🇦', 'PY': '🇵🇾', 'PE': '🇵🇪', 'UY': '🇺🇾', 'VE': '🇻🇪',
  'DO': '🇩🇴'
};

const CountrySelect: React.FC<CountrySelectProps> = ({
  id,
  name,
  value,
  onChange,
  disabled = false,
  loading = false,
  countries,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find(country => country.id_pais === value);

  // Debug: Log para verificar el valor y países disponibles
  useEffect(() => {
    console.log('🌍 CountrySelect - Valor recibido:', value);
    console.log('🌍 CountrySelect - Países disponibles:', countries.length);
    console.log('🌍 CountrySelect - País seleccionado:', selectedCountry);
    
    if (countries.length > 0 && value) {
      const found = countries.find(country => country.id_pais === value);
      if (!found) {
        console.warn('🌍 CountrySelect - País no encontrado:', value, 'en países:', countries);
      }
    }
  }, [countries, value, selectedCountry]);

  const filteredCountries = countries.filter(country =>
    country.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.codigo_iso.toLowerCase().includes(searchTerm.toLowerCase())
  );



  // Función para obtener la bandera del país
  const getCountryFlagEmoji = (isoCode: string) => {
    return COUNTRY_FLAGS[isoCode] || '🏳️'; // Fallback si no encuentra la bandera
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (country: Country) => {
    const syntheticEvent = {
      target: {
        name,
        value: country.id_pais
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputClick = () => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <FormGroup>
      <Label for={id}>{label}</Label>
      <div className="country-select-container" ref={dropdownRef}>
        <div className="position-relative">
          <Input
            id={id}
            name={name}
            type="text"
            value={selectedCountry ? `${selectedCountry.nombre}` : ''}
            onClick={handleInputClick}
            onChange={() => {}} // Read-only
            disabled={disabled}
            placeholder={loading ? 'Cargando países...' : 'Seleccionar país'}
            readOnly
            className="country-select-input"
          />
          {selectedCountry && (
            <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
              <CountryFlag countryCode={selectedCountry.codigo_iso} size="medium" />
            </div>
          )}
          <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
            <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} text-muted country-select-chevron ${isOpen ? 'up' : ''}`}></i>
          </div>
        </div>
        
        {isOpen && (
          <div className="country-select-dropdown">
            <div className="country-select-search">
              <Input
                type="text"
                placeholder="Buscar país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0"
              />
            </div>
            
            <div className="country-select-options">
              {filteredCountries.map((country) => (
                <div
                  key={country.id_pais}
                  className="country-select-option"
                  onClick={() => handleSelect(country)}
                >
                  <span className="country-select-flag">
                    <CountryFlag countryCode={country.codigo_iso} size="medium" />
                  </span>
                  <span className="country-select-code">
                    {country.codigo_iso}
                  </span>
                  <span className="country-select-name">
                    {country.nombre}
                  </span>
                </div>
              ))}
              
              {filteredCountries.length === 0 && (
                <div className="country-select-option text-muted">
                  No se encontraron países
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {loading && <small className="country-select-loading">Cargando países...</small>}
      {countries.length > 0 && <small className="country-select-count">{countries.length} países cargados</small>}
    </FormGroup>
  );
};

export default CountrySelect; 