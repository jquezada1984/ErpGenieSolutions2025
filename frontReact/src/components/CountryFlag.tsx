import React, { useState, useEffect } from 'react';
import './CountryFlag.css';

interface CountryFlagProps {
  countryCode: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ 
  countryCode, 
  size = 'medium',
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Mapeo de códigos ISO a emojis de banderas como fallback
  const flagEmojis: { [key: string]: string } = {
    'PE': '🇵🇪', 'AR': '🇦🇷', 'BR': '🇧🇷', 'CL': '🇨🇱', 'CO': '🇨🇴',
    'MX': '🇲🇽', 'EC': '🇪🇨', 'BO': '🇧🇴', 'PY': '🇵🇾', 'UY': '🇺🇾',
    'VE': '🇻🇪', 'GT': '🇬🇹', 'HN': '🇭🇳', 'SV': '🇸🇻', 'NI': '🇳🇮',
    'CR': '🇨🇷', 'PA': '🇵🇦', 'CU': '🇨🇺', 'DO': '🇩🇴', 'PR': '🇵🇷',
    'US': '🇺🇸', 'CA': '🇨🇦', 'ES': '🇪🇸', 'FR': '🇫🇷', 'DE': '🇩🇪',
    'IT': '🇮🇹', 'GB': '🇬🇧', 'JP': '🇯🇵', 'CN': '🇨🇳', 'IN': '🇮🇳',
    'AU': '🇦🇺', 'NZ': '🇳🇿', 'RU': '🇷🇺'
  };

  // Resetear estados cuando cambia el countryCode
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [countryCode]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  // Usar imagen local desde public/flags/
  const imageUrl = `/flags/${countryCode.toLowerCase()}.png`;

  // Si hay error con la imagen, mostrar emoji
  if (imageError) {
    const emoji = flagEmojis[countryCode.toUpperCase()] || '🏳️';
    return (
      <span 
        className={`country-flag-emoji country-flag-${size} ${className}`}
        title={countryCode}
      >
        {emoji}
      </span>
    );
  }

  return (
    <>
      {/* Imagen de bandera */}
      <img
        src={imageUrl}
        alt={`Bandera de ${countryCode}`}
        className={`country-flag-image country-flag-${size} ${className} ${imageLoaded ? 'loaded' : 'loading'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        title={countryCode}
        style={{ display: imageLoaded ? 'inline-block' : 'none' }}
      />
      
      {/* Emoji como fallback mientras carga o si falla */}
      {!imageLoaded && (
        <span 
          className={`country-flag-emoji country-flag-${size} ${className}`}
          title={countryCode}
          style={{ display: imageLoaded ? 'none' : 'inline-block' }}
        >
          {flagEmojis[countryCode.toUpperCase()] || '🏳️'}
        </span>
      )}
    </>
  );
};

export default CountryFlag; 