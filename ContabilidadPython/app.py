from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

app = Flask(__name__)

_jwt = (os.getenv('JWT_SECRET') or os.getenv('JWT_SECRET_KEY') or '').strip()
if not _jwt:
    raise RuntimeError('Configure JWT_SECRET o JWT_SECRET_KEY en el entorno (.env).')
app.config['JWT_SECRET_KEY'] = _jwt
app.config['CORS_ORIGINS'] = os.getenv('CORS_ORIGINS', '*').split(',')

# CORS
CORS(app, origins=app.config['CORS_ORIGINS'])

# JWT
jwt = JWTManager(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'contabilidad-python'}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=True)
