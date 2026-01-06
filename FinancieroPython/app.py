import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from config.config import Config
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'shared-logging-python'))
from logger import Logger

logger = Logger(service_name='financiero-python')

app = Flask(__name__)
app.config.from_object(Config)
app.config['JWT_SECRET_KEY'] = 'supersecret'  # Debe coincidir con la de NestJS

# Configurar CORS para permitir peticiones desde el frontend y Gateway API
CORS(app, origins=app.config['CORS_ORIGINS'])

# Configurar logging de errores
@app.errorhandler(Exception)
def handle_exception(e):
    """Manejo global de excepciones"""
    logger.log_exception(
        e,
        context='Flask',
        path=request.path,
        method=request.method,
        url=request.url,
    )
    return jsonify({
        'error': str(e),
        'status': 'error'
    }), 500

@app.before_request
def log_request():
    """Log de cada request"""
    logger.info(
        f"{request.method} {request.path}",
        context='Flask',
        metadata={
            'method': request.method,
            'path': request.path,
            'remote_addr': request.remote_addr,
        }
    )

@app.route('/health', methods=['GET'])
def health():
    """Endpoint de salud"""
    try:
        logger.info('Health check realizado', context='Flask')
        return jsonify({'status': 'ok', 'service': 'FinancieroPython'}), 200
    except Exception as e:
        logger.log_exception(e, context='Flask', endpoint='health')
        raise

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    logger.info(f'Iniciando servidor en puerto {port}', context='Flask')
    app.run(host='0.0.0.0', port=port, debug=True)
