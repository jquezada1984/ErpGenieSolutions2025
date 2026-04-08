from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config.config import Config
from utils.db import db
from api.item_routes import item_bp

import models  # Cascarón: modelos se registrarán cuando existan en models/__init__.py

app = Flask(__name__)
app.config.from_object(Config)
app.config['JWT_SECRET_KEY'] = app.config.get('SECRET_KEY', 'supersecret')

CORS(app, origins=app.config.get('CORS_ORIGINS', ['*']))

db.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(item_bp, url_prefix='/api')


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 3005))
    app.run(host='0.0.0.0', port=port, debug=False)
