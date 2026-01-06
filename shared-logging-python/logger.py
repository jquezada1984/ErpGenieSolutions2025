"""
Módulo de logging para servicios Python del ERP
Proporciona logging estructurado con rotación de archivos
"""
import logging
import logging.handlers
import os
import json
from datetime import datetime
from pathlib import Path


class CustomFormatter(logging.Formatter):
    """Formateador personalizado para logs estructurados"""
    
    def format(self, record):
        log_data = {
            'timestamp': datetime.fromtimestamp(record.created).isoformat(),
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno,
        }
        
        # Agregar información adicional si existe
        if hasattr(record, 'context'):
            log_data['context'] = record.context
        if hasattr(record, 'metadata'):
            log_data['metadata'] = record.metadata
        if hasattr(record, 'user_id'):
            log_data['user_id'] = record.user_id
        if hasattr(record, 'request_id'):
            log_data['request_id'] = record.request_id
        if hasattr(record, 'service_name'):
            log_data['service'] = record.service_name
            
        # Agregar excepción si existe
        if record.exc_info:
            log_data['exception'] = self.formatException(record.exc_info)
            
        return json.dumps(log_data, ensure_ascii=False, indent=2)


class Logger:
    """Clase de logging con rotación de archivos"""
    
    def __init__(self, service_name='python-service', log_dir=None):
        self.service_name = service_name
        self.log_dir = log_dir or os.getenv('LOG_DIR', './logs')
        
        # Crear directorio de logs si no existe
        Path(self.log_dir).mkdir(parents=True, exist_ok=True)
        
        # Configurar logger
        self.logger = logging.getLogger(service_name)
        self.logger.setLevel(logging.DEBUG)
        
        # Evitar duplicación de handlers
        if self.logger.handlers:
            return
            
        # Handler para archivo de errores
        error_handler = logging.handlers.RotatingFileHandler(
            os.path.join(self.log_dir, f'{service_name}-error.log'),
            maxBytes=5 * 1024 * 1024,  # 5MB
            backupCount=5,
            encoding='utf-8'
        )
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(CustomFormatter())
        
        # Handler para todos los logs
        all_handler = logging.handlers.RotatingFileHandler(
            os.path.join(self.log_dir, f'{service_name}-combined.log'),
            maxBytes=5 * 1024 * 1024,  # 5MB
            backupCount=5,
            encoding='utf-8'
        )
        all_handler.setLevel(logging.DEBUG)
        all_handler.setFormatter(CustomFormatter())
        
        # Handler para consola (formato más legible)
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_format = logging.Formatter(
            '%(asctime)s [%(levelname)s] [%(name)s]: %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        console_handler.setFormatter(console_format)
        
        # Agregar handlers
        self.logger.addHandler(error_handler)
        self.logger.addHandler(all_handler)
        self.logger.addHandler(console_handler)
    
    def _log(self, level, message, **kwargs):
        """Método interno para logging con metadata"""
        extra = {'service_name': self.service_name}
        if 'context' in kwargs:
            extra['context'] = kwargs.pop('context')
        if 'metadata' in kwargs:
            extra['metadata'] = kwargs.pop('metadata')
        if 'user_id' in kwargs:
            extra['user_id'] = kwargs.pop('user_id')
        if 'request_id' in kwargs:
            extra['request_id'] = kwargs.pop('request_id')
            
        getattr(self.logger, level)(message, extra=extra, **kwargs)
    
    def info(self, message, **kwargs):
        """Log de información"""
        self._log('info', message, **kwargs)
    
    def error(self, message, exception=None, **kwargs):
        """Log de error"""
        if exception:
            kwargs['exc_info'] = exception
            self.logger.error(message, exc_info=exception, extra=kwargs)
        else:
            self._log('error', message, **kwargs)
    
    def warning(self, message, **kwargs):
        """Log de advertencia"""
        self._log('warning', message, **kwargs)
    
    def debug(self, message, **kwargs):
        """Log de debug"""
        self._log('debug', message, **kwargs)
    
    def critical(self, message, exception=None, **kwargs):
        """Log crítico"""
        if exception:
            kwargs['exc_info'] = exception
            self.logger.critical(message, exc_info=exception, extra=kwargs)
        else:
            self._log('critical', message, **kwargs)
    
    def log_exception(self, exception, context=None, **metadata):
        """Log de excepción con contexto"""
        self.logger.error(
            f"Exception in {context or 'unknown'}: {str(exception)}",
            exc_info=exception,
            extra={
                'service_name': self.service_name,
                'context': context,
                'metadata': metadata,
            }
        )


# Instancia global del logger (puede ser sobrescrita)
logger = Logger()


