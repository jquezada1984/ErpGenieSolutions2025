from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

from config.config import Config
from utils.db import db
from api.configuracion_contabilidad_routes import configuracion_contabilidad_bp
import models

app = Flask(__name__)
app.config.from_object(Config)

_jwt = (os.getenv('JWT_SECRET') or os.getenv('JWT_SECRET_KEY') or '').strip()
if not _jwt:
    raise RuntimeError('Configure JWT_SECRET o JWT_SECRET_KEY en el entorno (.env).')
app.config['JWT_SECRET_KEY'] = _jwt

# CORS
CORS(app, origins=app.config.get('CORS_ORIGINS', '*'))

# DB + JWT
db.init_app(app)
jwt = JWTManager(app)

# Blueprints
app.register_blueprint(configuracion_contabilidad_bp, url_prefix='/api')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'contabilidad-python'}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=True)
