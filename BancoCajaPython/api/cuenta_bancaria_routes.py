from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from services.cuenta_bancaria_service import (
    servicio_crear_cuenta,
    servicio_actualizar_cuenta,
    servicio_eliminar_cuenta,
)

cuenta_bp = Blueprint('cuenta_bp', __name__)


def _ctx():
    id_empresa = request.headers.get('X-Company-Id') or request.headers.get('x-company-id')
    user_id = request.headers.get('X-User-Id') or request.headers.get('x-user-id')
    scope = request.headers.get('X-Scope-Acceso') or request.headers.get('x-scope-acceso') or 'EMPRESA'
    return id_empresa, user_id, scope


@cuenta_bp.route('/cuenta-bancaria', methods=['POST', 'OPTIONS'])
def crear_cuenta():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa, user_id, _ = _ctx()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    data = request.get_json(silent=True) or {}
    try:
        res = servicio_crear_cuenta(data, id_empresa=id_empresa, user_id=user_id)
        return jsonify(res), 201
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@cuenta_bp.route('/cuenta-bancaria/<string:id_cuenta>', methods=['PUT', 'PATCH', 'OPTIONS'])
def actualizar_cuenta(id_cuenta):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa, user_id, scope = _ctx()
    if not id_empresa and scope != 'GLOBAL':
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    data = request.get_json(silent=True) or {}
    try:
        res = servicio_actualizar_cuenta(
            id_cuenta, id_empresa or '', data, user_id, scope_acceso=scope,
        )
        if not res:
            return jsonify({'error': 'Cuenta no encontrada'}), 404
        return jsonify(res), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@cuenta_bp.route('/cuenta-bancaria/<string:id_cuenta>', methods=['DELETE', 'OPTIONS'])
def eliminar_cuenta(id_cuenta):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa, user_id, scope = _ctx()
    if not id_empresa and scope != 'GLOBAL':
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    try:
        ok = servicio_eliminar_cuenta(
            id_cuenta, id_empresa or '', user_id, scope_acceso=scope,
        )
        if not ok:
            return jsonify({'error': 'Cuenta no encontrada'}), 404
        return jsonify({'message': 'Cuenta desactivada'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
