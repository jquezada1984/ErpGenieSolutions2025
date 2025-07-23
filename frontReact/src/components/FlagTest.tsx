import React from 'react';
import CountryFlag from './CountryFlag';

const FlagTest: React.FC = () => {
  const testCountries = [
    { code: 'PE', name: 'Perú' },
    { code: 'AR', name: 'Argentina' },
    { code: 'BR', name: 'Brasil' },
    { code: 'CL', name: 'Chile' },
    { code: 'CO', name: 'Colombia' },
    { code: 'MX', name: 'México' },
    { code: 'US', name: 'Estados Unidos' },
    { code: 'ES', name: 'España' },
    { code: 'RU', name: 'Rusia' }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🧪 Prueba de Banderas</h2>
      <p>Verificando que las banderas se muestren correctamente:</p>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Tamaño Small:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {testCountries.map(country => (
            <div key={country.code} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CountryFlag countryCode={country.code} size="small" />
              <span>{country.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Tamaño Medium:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {testCountries.map(country => (
            <div key={country.code} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CountryFlag countryCode={country.code} size="medium" />
              <span>{country.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Tamaño Large:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {testCountries.map(country => (
            <div key={country.code} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CountryFlag countryCode={country.code} size="large" />
              <span>{country.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h4>🔍 Información de Debug:</h4>
        <p><strong>Ruta de imágenes:</strong> /flags/[codigo].png</p>
        <p><strong>Países de prueba:</strong> {testCountries.length}</p>
        <p><strong>Si ves emojis:</strong> Las imágenes no se están cargando</p>
        <p><strong>Si ves banderas:</strong> ¡Todo funciona correctamente!</p>
      </div>
    </div>
  );
};

export default FlagTest; 