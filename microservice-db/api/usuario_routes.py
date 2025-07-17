from flask import Blueprint, request, jsonify
from models.usuario import Usuario
from schemas.usuario_schema import UsuarioSchema
from utils.db import db
import bcrypt

usuario_bp = Blueprint('usuario_bp', __name__)
usuario_schema = UsuarioSchema()

@usuario_bp.route('/usuario', methods=['POST'])
def crear_usuario():
    data = request.get_json()
    errors = usuario_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    # Hashear la contraseña si viene en el JSON
    if 'password_hash' in data:
        data['password_hash'] = bcrypt.hashpw(data['password_hash'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    usuario = Usuario(**data)
    db.session.add(usuario)
    db.session.commit()
    return jsonify(usuario_schema.dump(usuario)), 201

@usuario_bp.route('/usuario/<int:id_usuario>', methods=['PUT'])
def actualizar_usuario(id_usuario):
    data = request.get_json()
    usuario = Usuario.query.get_or_404(id_usuario)
    errors = usuario_schema.validate(data, partial=True)
    if errors:
        return jsonify(errors), 400
    # Si se actualiza la contraseña, hashearla
    if 'password_hash' in data:
        data['password_hash'] = bcrypt.hashpw(data['password_hash'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    for key, value in data.items():
        setattr(usuario, key, value)
    db.session.commit()
    return jsonify(usuario_schema.dump(usuario)), 200 