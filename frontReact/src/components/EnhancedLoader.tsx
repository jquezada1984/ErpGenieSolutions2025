import React, { useState, useEffect } from 'react';
import { Spinner, Progress } from 'reactstrap';
import './EnhancedLoader.scss';

const EnhancedLoader = ({ message = 'Cargando...', showProgress = true }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [showProgress]);

  return (
    <div className="enhanced-fallback-spinner">
      <div className="loading-container">
        <div className="loading-content">
          <Spinner color="primary" size="sm" />
          <h6 className="mt-3 mb-2">{message}</h6>
          {showProgress && (
            <div className="progress-container">
              <Progress 
                value={progress} 
                color="primary" 
                className="progress-sm"
                style={{ width: '200px' }}
              />
              <small className="text-muted mt-1">{Math.round(progress)}%</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoader; 