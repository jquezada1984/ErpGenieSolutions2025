import logging

from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from models.usuario import Usuario
from schemas.usuario_schema import UsuarioSchema
from utils.db import db
from flask_jwt_extended import jwt_required, get_jwt
import bcrypt

logger = logging.getLogger(__name__)

usuario_bp = Blueprint('usuario_bp', __name__)
usuario_schema = UsuarioSchema()


def _caller_scope_global():
    try:
        claims = get_jwt() or {}
        return str(claims.get('scope_acceso', 'EMPRESA')).strip().upper() == 'GLOBAL'
    except Exception:
        return False


def _prepare_usuario_data(data):
    """Elimina load_only y hashea password si viene. Solo incluye columnas del modelo."""
    data = dict(data)
    password = data.pop('password', None)
    if password:
        data['password_hash'] = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12)).decode('utf-8')
    elif data.get('password_hash') is None:
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
    loaded = usuario_schema.load(data, partial=True)
    if not _caller_scope_global():
        loaded['scope_acceso'] = 'EMPRESA'
    elif 'scope_acceso' not in loaded or loaded.get('scope_acceso') is None:
        loaded['scope_acceso'] = 'EMPRESA'
    payload = _prepare_usuario_data(loaded)
    if not payload.get('password_hash'):
        return jsonify({'password': ['Se requiere contraseña']}), 400
    usuario = Usuario(**payload)
    db.session.add(usuario)
    db.session.commit()
    return jsonify(usuario_schema.dump(usuario)), 201

@usuario_bp.route('/usuario/<string:id_usuario>', methods=['PUT'])
@jwt_required()
def actualizar_usuario(id_usuario):
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({'_schema': ['Se requiere un cuerpo JSON objeto']}), 400
    usuario = Usuario.query.get_or_404(id_usuario)
    try:
        loaded = usuario_schema.load(data, partial=True)
    except ValidationError as err:
        logger.warning('PUT /api/usuario/%s validation failed: %s', id_usuario, err.messages)
        return jsonify(err.messages), 400
    if not _caller_scope_global():
        loaded.pop('scope_acceso', None)
    payload = _prepare_usuario_data(loaded)
    for key, value in payload.items():
        if hasattr(usuario, key):
            setattr(usuario, key, value)
    db.session.commit()
    return jsonify(usuario_schema.dump(usuario)), 200