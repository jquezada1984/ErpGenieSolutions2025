import hashlib
import os
import warnings

from flask import Flask, jsonify

# Evitar duplicar el aviso de PyJWT: ya registramos uno explícito con Flask si la clave es corta.
try:
    from jwt.warnings import InsecureKeyLengthWarning

    warnings.filterwarnings('ignore', category=InsecureKeyLengthWarning)
except Exception:
    pass
from flask_cors import CORS
from config.config import Config
from models.empresa import db
from models.usuario import Usuario
from api.empresa_routes import empresa_bp
from api.entidad_routes import entidad_bp
from api.perfil_routes import perfil_routes
from api.menu_routes import menu_routes
from api.sucursal_routes import sucursal_routes
from api.usuario_routes import usuario_bp
from flask_jwt_extended import JWTManager
# Importar los blueprints de las demás entidades cuando estén listos

app = Flask(__name__)
app.config.from_object(Config)


def _normalize_jwt_secret(raw):
    """Quita BOM/comillas/espacios que en .env (Windows) desalinean la firma respecto a Nest."""
    if raw is None:
        return ''
    s = str(raw).strip().lstrip('\ufeff')
    if len(s) >= 2 and s[0] == s[-1] and s[0] in '"\'':
        s = s[1:-1].strip()
    return s


# Misma clave que Nest (JWT_SECRET). En Docker, env_file suele ser InicioNestJs/.env (prioridad sobre .env local montado).
_raw_jwt = os.getenv('JWT_SECRET') or os.getenv('JWT_SECRET_KEY')
_jwt_secret = _normalize_jwt_secret(_raw_jwt)
if not _jwt_secret:
    raise RuntimeError(
        'Configure JWT_SECRET o JWT_SECRET_KEY en el entorno (.env o contenedor). '
        'Debe ser el mismo valor que JWT_SECRET en InicioNestJs. Tras cambiar el secreto: reiniciar Nest + Python y volver a iniciar sesión.'
    )

# Aviso: JWT_SECRET no debe ser un accessToken (tres partes separadas por puntos).
if _jwt_secret.count('.') == 2 and all(p for p in _jwt_secret.split('.')):
    app.logger.warning(
        'JWT_SECRET parece un token JWT (tres segmentos). Debe ser una clave HMAC propia '
        '(p. ej. openssl rand -base64 48), no el Bearer del login. Si Nest y Python coinciden pero falla la firma, cierre sesión y vuelva a entrar.'
    )

app.config['JWT_SECRET_KEY'] = _jwt_secret

if os.getenv('FLASK_ENV', 'development') != 'production':
    _fp = hashlib.sha256(_jwt_secret.encode('utf-8')).hexdigest()[:12]
    app.logger.info(
        'Huella JWT_SECRET (dev, sha256·12 hex): %s — debe coincidir con el log [auth] de InicioNestJs.',
        _fp,
    )

_jwt_len = len(_jwt_secret.encode('utf-8'))
if _jwt_len < 32:
    app.logger.warning(
        'JWT_SECRET tiene %d bytes; se recomienda >= 32 bytes para HMAC-SHA256. '
        'Use p. ej. `openssl rand -base64 48` en InicioNestJs/.env (JWT_SECRET), reinicie Nest + Python y vuelva a iniciar sesión.',
        _jwt_len,
    )

# Configurar CORS para permitir peticiones desde el frontend y Gateway API
CORS(app, origins=app.config['CORS_ORIGINS'])

jwt = JWTManager(app)


@jwt.invalid_token_loader
def _jwt_invalid_token_callback(error_string: str):
    """Por defecto Flask-JWT usa 422; 401 es más claro y coincide con APIs REST habituales."""
    app.logger.warning(
        'JWT inválido (%s). Alinee JWT_SECRET con InicioNestJs, reinicie servicios y cierre sesión en el navegador.',
        error_string,
    )
    return jsonify(msg=error_string), 401


db.init_app(app)

# Registro de blueprints
app.register_blueprint(empresa_bp, url_prefix='/api')
app.register_blueprint(entidad_bp, url_prefix='/api')
app.register_blueprint(perfil_routes, url_prefix='/api')
app.register_blueprint(menu_routes, url_prefix='/api')
app.register_blueprint(sucursal_routes, url_prefix='/api')
app.register_blueprint(usuario_bp, url_prefix='/api')


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    # No crear tablas automáticamente - la base de datos PostgreSQL externa ya tiene las tablas
    app.run(host='0.0.0.0', port=5000, debug=True) 