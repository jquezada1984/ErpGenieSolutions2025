from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

app = Flask(__name__)

# Configuración básica
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'supersecret')
app.config['CORS_ORIGINS'] = os.getenv('CORS_ORIGINS', '*').split(',')

# CORS
CORS(app, origins=app.config['CORS_ORIGINS'])

# JWT
jwt = JWTManager(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'financiero-python'}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
