import os
from flask import Flask, jsonify
from flask_cors import CORS
from config.config import Config
from utils.db import db
from api.cuenta_contable_routes import cuenta_contable_bp
from api.asiento_contable_routes import asiento_contable_bp
from api.movimiento_contable_routes import movimiento_contable_bp
from api.balance_general_routes import balance_general_bp
from api.diario_contable_routes import diario_contable_bp
from api.periodo_contable_routes import periodo_contable_bp
from api.libro_mayor_routes import libro_mayor_bp
from api.saldo_cuenta_routes import saldo_cuenta_bp
from api.configuracion_contabilidad_routes import configuracion_bp
from api.modelo_plan_contable_routes import modelo_bp
from api.plan_contable_routes import plan_bp
from api.cuenta_contable_defecto_routes import cuenta_defecto_bp
from api.cuenta_iva_routes import cuenta_iva_bp
from api.cuenta_impuesto_routes import cuenta_impuesto_bp
from api.cuenta_bancaria_routes import cuenta_bancaria_bp
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config.from_object(Config)
app.config['JWT_SECRET_KEY'] = 'supersecret'  # Debe coincidir con la de NestJS

# Configurar CORS para permitir peticiones desde el frontend y Gateway API
CORS(app, origins=app.config['CORS_ORIGINS'])

jwt = JWTManager(app)

db.init_app(app)

# Registro de blueprints
app.register_blueprint(cuenta_contable_bp, url_prefix='/api')
app.register_blueprint(asiento_contable_bp, url_prefix='/api')
app.register_blueprint(movimiento_contable_bp, url_prefix='/api')
app.register_blueprint(balance_general_bp, url_prefix='/api')
app.register_blueprint(diario_contable_bp, url_prefix='/api')
app.register_blueprint(periodo_contable_bp, url_prefix='/api')
app.register_blueprint(libro_mayor_bp, url_prefix='/api')
app.register_blueprint(saldo_cuenta_bp, url_prefix='/api')
app.register_blueprint(configuracion_bp, url_prefix='/api')
app.register_blueprint(modelo_bp, url_prefix='/api')
app.register_blueprint(plan_bp, url_prefix='/api')
app.register_blueprint(cuenta_defecto_bp, url_prefix='/api')
app.register_blueprint(cuenta_iva_bp, url_prefix='/api')
app.register_blueprint(cuenta_impuesto_bp, url_prefix='/api')
app.register_blueprint(cuenta_bancaria_bp, url_prefix='/api')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'ContabilidadPython'}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=True)
