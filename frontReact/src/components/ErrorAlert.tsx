import React from 'react';
import { Alert, AlertProps } from 'reactstrap';
import { extractErrorMessage, getErrorType, getErrorIcon } from '../utils/errorTranslator';

interface ErrorAlertProps extends Omit<AlertProps, 'color'> {
  error: any;
  onDismiss?: () => void;
  showIcon?: boolean;
  className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  onDismiss, 
  showIcon = true, 
  className = '',
  ...alertProps 
}) => {
  const errorMessage = extractErrorMessage(error);
  const errorType = getErrorType(error);
  const errorIcon = getErrorIcon(errorType);

  const getAlertColor = (): AlertProps['color'] => {
    switch (errorType) {
      case 'validation':
        return 'warning';
      case 'network':
        return 'info';
      case 'auth':
        return 'danger';
      case 'server':
        return 'danger';
      default:
        return 'danger';
    }
  };

  return (
    <Alert 
      color={getAlertColor()} 
      isOpen={true}
      toggle={onDismiss}
      fade={false}
      className={`d-flex align-items-center ${className}`}
      {...alertProps}
    >
      {showIcon && (
        <i className={`bi ${errorIcon} me-2 fs-5`}></i>
      )}
      <div className="flex-grow-1">
        {errorMessage}
      </div>
    </Alert>
  );
};

export default ErrorAlert; 