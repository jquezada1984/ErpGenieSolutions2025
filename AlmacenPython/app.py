from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config.config import Config
from utils.db import db
from api.almacen_routes import almacen_bp

import models

app = Flask(__name__)
app.config.from_object(Config)
app.config['JWT_SECRET_KEY'] = app.config.get('SECRET_KEY', 'supersecret')

CORS(app, origins=app.config.get('CORS_ORIGINS', ['*']))

db.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(almacen_bp, url_prefix='/api')


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    import os
    # Fallback local alineado con docker-compose (PORT=3018). Gateway: pendiente.
    port = int(os.environ.get('PORT', 3018))
    app.run(host='0.0.0.0', port=port, debug=False)
