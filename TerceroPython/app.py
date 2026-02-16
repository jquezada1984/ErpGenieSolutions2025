from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config.config import Config
from utils.db import db
from api.tercero_routes import tercero_bp

# Importar modelos para que SQLAlchemy los registre
import models  # Esto importa todos los modelos definidos en __init__.py

app = Flask(__name__)
app.config.from_object(Config)

# Debe coincidir con el gateway
app.config['JWT_SECRET_KEY'] = 'supersecret'

# CORS
CORS(app, origins=app.config.get('CORS_ORIGINS', '*'))

# DB + JWT
db.init_app(app)
jwt = JWTManager(app)

# Blueprints
app.register_blueprint(tercero_bp, url_prefix='/api')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    # No crear tablas aquí
    import os
    port = int(os.environ.get('PORT', 3004))
    app.run(host='0.0.0.0', port=port, debug=False)
