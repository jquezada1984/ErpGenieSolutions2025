from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from services.banco_service import (
    servicio_crear_banco,
    servicio_actualizar_banco,
    servicio_eliminar_banco,
)

banco_bp = Blueprint('banco_bp', __name__)


def _user_id():
    return request.headers.get('X-User-Id') or request.headers.get('x-user-id')


@banco_bp.route('/banco', methods=['POST', 'OPTIONS'])
def crear_banco():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json(silent=True) or {}
    try:
        res = servicio_crear_banco(data, _user_id())
        return jsonify(res), 201
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@banco_bp.route('/banco/<string:id_banco>', methods=['PUT', 'PATCH', 'OPTIONS'])
def actualizar_banco(id_banco):
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json(silent=True) or {}
    try:
        res = servicio_actualizar_banco(id_banco, data, _user_id())
        if not res:
            return jsonify({'error': 'Banco no encontrado'}), 404
        return jsonify(res), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@banco_bp.route('/banco/<string:id_banco>', methods=['DELETE', 'OPTIONS'])
def eliminar_banco(id_banco):
    if request.method == 'OPTIONS':
        return '', 204
    try:
        ok = servicio_eliminar_banco(id_banco)
        if not ok:
            return jsonify({'error': 'Banco no encontrado'}), 404
        return jsonify({'message': 'Banco desactivado'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
