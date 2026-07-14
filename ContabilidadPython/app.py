from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

from config.config import Config
from utils.db import db
from api.configuracion_contabilidad_routes import configuracion_contabilidad_bp
from api.periodo_contable_routes import periodo_contable_bp
from api.diario_contable_routes import diario_contable_bp
from api.modelo_plan_contable_routes import modelo_plan_contable_bp
from api.cuenta_contable_routes import cuenta_contable_bp
from api.cuenta_contable_defecto_routes import cuenta_contable_defecto_bp
from api.exportar_contabilidad_routes import exportar_contabilidad_bp
from api.cuenta_iva_routes import cuenta_iva_bp
from api.cuenta_impuesto_routes import cuenta_impuesto_bp
from api.grupo_cuenta_personalizado_routes import grupo_cuenta_bp
from api.transferencia_contable_routes import transferencia_bp
from api.cuenta_bancaria_contable_routes import cuenta_bancaria_contable_bp
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
app.register_blueprint(periodo_contable_bp, url_prefix='/api')
app.register_blueprint(diario_contable_bp, url_prefix='/api')
app.register_blueprint(modelo_plan_contable_bp, url_prefix='/api')
app.register_blueprint(cuenta_contable_bp, url_prefix='/api')
app.register_blueprint(cuenta_contable_defecto_bp, url_prefix='/api')
app.register_blueprint(exportar_contabilidad_bp, url_prefix='/api')
app.register_blueprint(cuenta_iva_bp, url_prefix='/api')
app.register_blueprint(cuenta_impuesto_bp, url_prefix='/api')
app.register_blueprint(grupo_cuenta_bp, url_prefix='/api')
app.register_blueprint(transferencia_bp, url_prefix='/api')
app.register_blueprint(cuenta_bancaria_contable_bp, url_prefix='/api')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'contabilidad-python'}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=True)
