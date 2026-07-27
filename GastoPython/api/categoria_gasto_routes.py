from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from utils.context import read_request_ctx, resolve_id_empresa, require_user_id
from utils.integrity import map_integrity_error
from services import categoria_gasto_service as servicio

categoria_gasto_bp = Blueprint('categoria_gasto_bp', __name__)


def _require_ctx(body=None, require_user: bool = True):
    header_company, user_id, scope = read_request_ctx(request.headers)
    try:
        id_empresa = resolve_id_empresa(header_company, body, scope)
        uid = require_user_id(user_id) if require_user else user_id
    except ValueError as e:
        return None, None, None, (jsonify({'success': False, 'error': str(e)}), 400)
    return id_empresa, uid, scope, None


@categoria_gasto_bp.route('/categoria-gasto', methods=['POST', 'OPTIONS'])
@categoria_gasto_bp.route('/categoria-gasto/', methods=['POST', 'OPTIONS'])
def crear_categoria():
    if request.method == 'OPTIONS':
        return '', 204
    body = request.get_json(silent=True) or {}
    id_empresa, user_id, scope, err = _require_ctx(body)
    if err:
        return err
    try:
        data = servicio.crear_categoria(body, id_empresa=id_empresa)
        return jsonify({'success': True, 'data': data}), 201
    except ValidationError as ve:
        return jsonify({'success': False, 'errors': ve.messages}), 400
    except IntegrityError as ie:
        status, msg = map_integrity_error(ie)
        return jsonify({'success': False, 'error': msg}), status
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception:
        return jsonify({'success': False, 'error': 'Error interno al crear categoría'}), 500


@categoria_gasto_bp.route('/categoria-gasto/<string:id_categoria>', methods=['PUT', 'OPTIONS'])
@categoria_gasto_bp.route('/categoria-gasto/<string:id_categoria>/', methods=['PUT', 'OPTIONS'])
def actualizar_categoria(id_categoria: str):
    if request.method == 'OPTIONS':
        return '', 204
    body = request.get_json(silent=True) or {}
    id_empresa, user_id, scope, err = _require_ctx(body)
    if err:
        return err
    try:
        data = servicio.actualizar_categoria(id_categoria, body, id_empresa=id_empresa)
        if data is None:
            return jsonify({'success': False, 'error': 'Categoría no encontrada'}), 404
        return jsonify({'success': True, 'data': data}), 200
    except ValidationError as ve:
        return jsonify({'success': False, 'errors': ve.messages}), 400
    except IntegrityError as ie:
        status, msg = map_integrity_error(ie)
        return jsonify({'success': False, 'error': msg}), status
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception:
        return jsonify({'success': False, 'error': 'Error interno al actualizar categoría'}), 500


@categoria_gasto_bp.route(
    '/categoria-gasto/<string:id_categoria>/estado', methods=['PATCH', 'OPTIONS'],
)
@categoria_gasto_bp.route(
    '/categoria-gasto/<string:id_categoria>/estado/', methods=['PATCH', 'OPTIONS'],
)
def cambiar_estado_categoria(id_categoria: str):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa, user_id, scope, err = _require_ctx()
    if err:
        return err
    try:
        data = servicio.toggle_estado_categoria(id_categoria, id_empresa=id_empresa)
        if data is None:
            return jsonify({'success': False, 'error': 'Categoría no encontrada'}), 404
        return jsonify({'success': True, 'data': data}), 200
    except Exception:
        return jsonify({'success': False, 'error': 'Error interno al cambiar estado'}), 500
