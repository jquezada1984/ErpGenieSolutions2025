from flask import Flask, jsonify
from flask_cors import CORS
from config.config import Config
from models.empresa import db
from models.usuario import Usuario
from api.empresa_routes import empresa_bp
from api.entidad_routes import entidad_bp
from api.perfil_routes import perfil_routes
from api.menu_routes import menu_routes
from api.sucursal_routes import sucursal_routes
from flask_jwt_extended import JWTManager
# Importar los blueprints de las demás entidades cuando estén listos

app = Flask(__name__)
app.config.from_object(Config)
app.config['JWT_SECRET_KEY'] = 'supersecret'  # Debe coincidir con la de NestJS

# Configurar CORS para permitir peticiones desde el frontend y Gateway API
CORS(app, origins=app.config['CORS_ORIGINS'])

jwt = JWTManager(app)

db.init_app(app)

# Registro de blueprints
app.register_blueprint(empresa_bp, url_prefix='/api')
app.register_blueprint(entidad_bp, url_prefix='/api')
app.register_blueprint(perfil_routes, url_prefix='/api')
app.register_blueprint(menu_routes, url_prefix='/api')
app.register_blueprint(sucursal_routes, url_prefix='/api')
# app.register_blueprint(sucursal_bp, url_prefix='/api')
# app.register_blueprint(menu_bp, url_prefix='/api')
# app.register_blueprint(usuario_bp, url_prefix='/api')
# app.register_blueprint(usuario_sucursal_bp, url_prefix='/api')
# app.register_blueprint(perfil_menu_bp, url_prefix='/api')
# app.register_blueprint(perfil_menu_permiso_bp, url_prefix='/api')
# app.register_blueprint(tercero_bp, url_prefix='/api')
# app.register_blueprint(tercero_rib_bp, url_prefix='/api')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True) 