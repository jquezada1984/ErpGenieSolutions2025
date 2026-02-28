import React, { useState, useEffect } from 'react';
import { uploadMedia } from '../../_apis_/media';

export interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label }) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const displayUrl = previewUrl ?? value;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    try {
      const response = await uploadMedia(file);
      const url = typeof response === 'object' && response !== null && 'url' in response
        ? (response as { url: string }).url
        : String(response);
      onChange(url);
      setPreviewUrl(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir la imagen';
      setError(message);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="image-upload">
      {label && <label className="form-label">{label}</label>}
      <div className="d-flex flex-wrap align-items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          className="form-control form-control-sm"
        />
        {loading && <span className="text-muted small">Subiendo...</span>}
        {error && <span className="text-danger small">{error}</span>}
      </div>
      {displayUrl && (
        <div className="mt-2">
          <img
            src={displayUrl}
            alt="Vista previa"
            style={{ maxWidth: 200, maxHeight: 200, objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
