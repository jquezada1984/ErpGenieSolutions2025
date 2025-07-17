from flask import Flask, jsonify
from config.config import Config
from models.entidad import db
from api.empresa_routes import empresa_bp
# Importar los blueprints de las demás entidades cuando estén listos

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

# Registro de blueprints
app.register_blueprint(empresa_bp, url_prefix='/api')
# app.register_blueprint(sucursal_bp, url_prefix='/api')
# app.register_blueprint(perfil_bp, url_prefix='/api')
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