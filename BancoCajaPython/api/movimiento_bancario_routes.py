from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from services.movimiento_bancario_service import (
    servicio_crear_movimiento,
    servicio_actualizar_movimiento,
    servicio_eliminar_movimiento,
)

movimiento_bp = Blueprint('movimiento_bp', __name__)


def _ctx():
    id_empresa = request.headers.get('X-Company-Id') or request.headers.get('x-company-id')
    user_id = request.headers.get('X-User-Id') or request.headers.get('x-user-id')
    scope = request.headers.get('X-Scope-Acceso') or request.headers.get('x-scope-acceso') or 'EMPRESA'
    return id_empresa, user_id, scope


@movimiento_bp.route('/movimiento-bancario', methods=['POST', 'OPTIONS'])
def crear_movimiento():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa, user_id, scope = _ctx()
    if not id_empresa and scope != 'GLOBAL':
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    data = request.get_json(silent=True) or {}
    try:
        res = servicio_crear_movimiento(
            data, id_empresa=id_empresa or '', user_id=user_id, scope_acceso=scope,
        )
        return jsonify(res), 201
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@movimiento_bp.route('/movimiento-bancario/<string:id_movimiento>', methods=['PUT', 'PATCH', 'OPTIONS'])
def actualizar_movimiento(id_movimiento):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa, user_id, scope = _ctx()
    if not id_empresa and scope != 'GLOBAL':
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    data = request.get_json(silent=True) or {}
    try:
        res = servicio_actualizar_movimiento(
            id_movimiento, id_empresa or '', data, user_id, scope_acceso=scope,
        )
        if not res:
            return jsonify({'error': 'Movimiento no encontrado'}), 404
        return jsonify(res), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@movimiento_bp.route('/movimiento-bancario/<string:id_movimiento>', methods=['DELETE', 'OPTIONS'])
def eliminar_movimiento(id_movimiento):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa, user_id, scope = _ctx()
    if not id_empresa and scope != 'GLOBAL':
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    try:
        ok = servicio_eliminar_movimiento(
            id_movimiento, id_empresa or '', user_id, scope_acceso=scope,
        )
        if not ok:
            return jsonify({'error': 'Movimiento no encontrado'}), 404
        return jsonify({'message': 'Movimiento anulado'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
