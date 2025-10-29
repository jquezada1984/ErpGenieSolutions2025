import os
from flask import Flask, jsonify
from flask_cors import CORS
from config.config import Config

app = Flask(__name__)
app.config.from_object(Config)
app.config['JWT_SECRET_KEY'] = 'supersecret'  # Debe coincidir con la de NestJS

# Configurar CORS para permitir peticiones desde el frontend y Gateway API
CORS(app, origins=app.config['CORS_ORIGINS'])

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'FinancieroPython'}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)

