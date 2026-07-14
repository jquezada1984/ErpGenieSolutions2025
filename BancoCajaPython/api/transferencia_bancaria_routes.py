from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from services.transferencia_bancaria_service import (
    servicio_crear_transferencia,
    servicio_eliminar_transferencia,
)

transferencia_bp = Blueprint('transferencia_bp', __name__)


def _ctx():
    id_empresa = request.headers.get('X-Company-Id') or request.headers.get('x-company-id')
    user_id = request.headers.get('X-User-Id') or request.headers.get('x-user-id')
    scope = request.headers.get('X-Scope-Acceso') or request.headers.get('x-scope-acceso') or 'EMPRESA'
    return id_empresa, user_id, scope


@transferencia_bp.route('/transferencia-bancaria', methods=['POST', 'OPTIONS'])
def crear_transferencia():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa, user_id, scope = _ctx()
    if not id_empresa and scope != 'GLOBAL':
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    data = request.get_json(silent=True) or {}
    try:
        res = servicio_crear_transferencia(
            data, id_empresa=id_empresa or '', user_id=user_id, scope_acceso=scope,
        )
        return jsonify(res), 201
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@transferencia_bp.route('/transferencia-bancaria/<string:id_transferencia>', methods=['DELETE', 'OPTIONS'])
def eliminar_transferencia(id_transferencia):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa, user_id, scope = _ctx()
    if not id_empresa and scope != 'GLOBAL':
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    try:
        ok = servicio_eliminar_transferencia(
            id_transferencia, id_empresa or '', user_id, scope_acceso=scope,
        )
        if not ok:
            return jsonify({'error': 'Transferencia no encontrada'}), 404
        return jsonify({'message': 'Transferencia anulada'}), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
