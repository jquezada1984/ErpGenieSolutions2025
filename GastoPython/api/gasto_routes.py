from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from utils.context import read_request_ctx, resolve_id_empresa, require_user_id
from utils.integrity import map_integrity_error
from services import gasto_service as servicio

gasto_bp = Blueprint('gasto_bp', __name__)


def _require_ctx(body=None):
    header_company, user_id, scope = read_request_ctx(request.headers)
    try:
        id_empresa = resolve_id_empresa(header_company, body, scope)
        uid = require_user_id(user_id)
    except ValueError as e:
        return None, None, None, (jsonify({'success': False, 'error': str(e)}), 400)
    return id_empresa, uid, scope, None


@gasto_bp.route('/gasto', methods=['POST', 'OPTIONS'])
@gasto_bp.route('/gasto/', methods=['POST', 'OPTIONS'])
def crear_gasto():
    if request.method == 'OPTIONS':
        return '', 204
    body = request.get_json(silent=True) or {}
    id_empresa, user_id, scope, err = _require_ctx(body)
    if err:
        return err
    try:
        data = servicio.crear_gasto(body, id_empresa=id_empresa, user_id=user_id)
        return jsonify({'success': True, 'data': data}), 201
    except ValidationError as ve:
        return jsonify({'success': False, 'errors': ve.messages}), 400
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except IntegrityError as ie:
        status, msg = map_integrity_error(ie)
        return jsonify({'success': False, 'error': msg}), status
    except Exception:
        return jsonify({'success': False, 'error': 'Error interno al crear gasto'}), 500


@gasto_bp.route('/gasto/<string:id_gasto>', methods=['PUT', 'OPTIONS'])
@gasto_bp.route('/gasto/<string:id_gasto>/', methods=['PUT', 'OPTIONS'])
def actualizar_gasto(id_gasto: str):
    if request.method == 'OPTIONS':
        return '', 204
    body = request.get_json(silent=True) or {}
    id_empresa, user_id, scope, err = _require_ctx(body)
    if err:
        return err
    try:
        data = servicio.actualizar_gasto(
            id_gasto, body, id_empresa=id_empresa, user_id=user_id,
        )
        if data is None:
            return jsonify({'success': False, 'error': 'Gasto no encontrado'}), 404
        return jsonify({'success': True, 'data': data}), 200
    except ValidationError as ve:
        return jsonify({'success': False, 'errors': ve.messages}), 400
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except IntegrityError as ie:
        status, msg = map_integrity_error(ie)
        return jsonify({'success': False, 'error': msg}), status
    except Exception:
        return jsonify({'success': False, 'error': 'Error interno al actualizar gasto'}), 500
