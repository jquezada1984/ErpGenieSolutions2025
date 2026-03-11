from flask import Blueprint, request, jsonify
from models.usuario import Usuario
from schemas.usuario_schema import UsuarioSchema
from utils.db import db
from flask_jwt_extended import jwt_required
import bcrypt

usuario_bp = Blueprint('usuario_bp', __name__)
usuario_schema = UsuarioSchema()

def _prepare_usuario_data(data):
    """Elimina load_only y hashea password si viene. Solo incluye columnas del modelo."""
    data = dict(data)
    password = data.pop('password', None)
    if password:
        data['password_hash'] = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12)).decode('utf-8')
    if 'password_hash' not in data and not password:
        data.pop('password_hash', None)
    allowed = {c.key for c in Usuario.__table__.columns}
    return {k: v for k, v in data.items() if k in allowed}

@usuario_bp.route('/usuario', methods=['POST'])
@jwt_required()
def crear_usuario():
    data = request.get_json()
    if not data.get('password') and not data.get('password_hash'):
        return jsonify({'password': ['Se requiere contraseña o password_hash']}), 400
    errors = usuario_schema.validate(data, partial=True)
    if errors:
        return jsonify(errors), 400
    payload = _prepare_usuario_data(usuario_schema.load(data, partial=True))
    if not payload.get('password_hash'):
        return jsonify({'password': ['Se requiere contraseña']}), 400
    usuario = Usuario(**payload)
    db.session.add(usuario)
    db.session.commit()
    return jsonify(usuario_schema.dump(usuario)), 201

@usuario_bp.route('/usuario/<string:id_usuario>', methods=['PUT'])
@jwt_required()
def actualizar_usuario(id_usuario):
    data = request.get_json()
    usuario = Usuario.query.get_or_404(id_usuario)
    errors = usuario_schema.validate(data, partial=True)
    if errors:
        return jsonify(errors), 400
    loaded = usuario_schema.load(data, partial=True)
    payload = _prepare_usuario_data(loaded)
    for key, value in payload.items():
        if hasattr(usuario, key):
            setattr(usuario, key, value)
    db.session.commit()
    return jsonify(usuario_schema.dump(usuario)), 200