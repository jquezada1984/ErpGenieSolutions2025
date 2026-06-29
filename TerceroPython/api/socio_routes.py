from flask import Blueprint, request, jsonify

from services.socio_service import (
    create_socio as servicio_create_socio,
    update_socio as servicio_update_socio,
    toggle_estado_socio as servicio_toggle_estado_socio,
    list_roles_socio_activos as servicio_list_roles_socio_activos,
)

socio_bp = Blueprint('socio_bp', __name__)


def _ctx_headers():
    id_empresa = request.headers.get("X-Company-Id") or request.headers.get("x-company-id")
    user_id = request.headers.get("X-User-Id") or request.headers.get("x-user-id")
    scope_acceso = request.headers.get("X-Scope-Acceso") or request.headers.get("x-scope-acceso") or "EMPRESA"
    return id_empresa, user_id, scope_acceso


@socio_bp.route('/socio', methods=['POST', 'OPTIONS'])
@socio_bp.route('/socio/', methods=['POST', 'OPTIONS'])
def crear_socio():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json(silent=True) or {}
    id_empresa, user_id, scope_acceso = _ctx_headers()
    if not id_empresa and scope_acceso != 'GLOBAL':
        return jsonify({'success': False, 'error': 'Falta X-Company-Id en headers'}), 400
    try:
        res = servicio_create_socio(data, user_id, id_empresa, scope_acceso)
        return jsonify({'success': True, 'data': res}), 201
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@socio_bp.route('/socio/<string:id_socio>', methods=['PUT', 'OPTIONS'])
@socio_bp.route('/socio/<string:id_socio>/', methods=['PUT', 'OPTIONS'])
def actualizar_socio(id_socio):
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json(silent=True) or {}
    id_empresa, user_id, scope_acceso = _ctx_headers()
    if not id_empresa and scope_acceso != 'GLOBAL':
        return jsonify({'success': False, 'error': 'Falta X-Company-Id en headers'}), 400
    try:
        res = servicio_update_socio(id_socio, data, user_id)
        if not res:
            return jsonify({'success': False, 'error': 'Socio no encontrado'}), 404
        return jsonify({'success': True, 'data': res}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@socio_bp.route('/socio/<string:id_socio>/estado', methods=['PATCH', 'OPTIONS'])
@socio_bp.route('/socio/<string:id_socio>/estado/', methods=['PATCH', 'OPTIONS'])
def cambiar_estado_socio(id_socio):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa, user_id, scope_acceso = _ctx_headers()
    if not id_empresa and scope_acceso != 'GLOBAL':
        return jsonify({'success': False, 'error': 'Falta X-Company-Id en headers'}), 400
    try:
        res = servicio_toggle_estado_socio(id_socio, user_id)
        if not res:
            return jsonify({'success': False, 'error': 'Socio no encontrado'}), 404
        return jsonify({'success': True, 'data': res}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@socio_bp.route('/socio/selects/rol-socio', methods=['GET', 'OPTIONS'])
@socio_bp.route('/socio/selects/rol-socio/', methods=['GET', 'OPTIONS'])
def listar_roles_socio():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa, user_id, scope_acceso = _ctx_headers()
    _ = user_id
    if not id_empresa and scope_acceso != 'GLOBAL':
        return jsonify({'success': False, 'error': 'Falta X-Company-Id en headers'}), 400
    try:
        res = servicio_list_roles_socio_activos()
        return jsonify(res), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
