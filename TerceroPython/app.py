from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

import os

from config.config import Config
from utils.db import db
from api.tercero_routes import tercero_bp
from api.contacto_routes import contacto_bp
from api.socio_routes import socio_bp

# Importar modelos para que SQLAlchemy los registre
import models  # Esto importa todos los modelos definidos en __init__.py

app = Flask(__name__)
app.config.from_object(Config)

_jwt = (os.getenv('JWT_SECRET') or os.getenv('JWT_SECRET_KEY') or '').strip()
if not _jwt:
    raise RuntimeError(
        'Configure JWT_SECRET o JWT_SECRET_KEY en el entorno (.env); debe coincidir con el servicio que firma el JWT.'
    )
app.config['JWT_SECRET_KEY'] = _jwt

# CORS
CORS(app, origins=app.config.get('CORS_ORIGINS', '*'))

# DB + JWT
db.init_app(app)
jwt = JWTManager(app)

# Blueprints
app.register_blueprint(tercero_bp, url_prefix='/api')
app.register_blueprint(contacto_bp, url_prefix='/api')
app.register_blueprint(socio_bp, url_prefix='/api')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    # No crear tablas aquí
    import os
    port = int(os.environ.get('PORT', 3004))
    app.run(host='0.0.0.0', port=port, debug=True)
