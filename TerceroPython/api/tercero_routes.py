from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from services.tercero_service import (
    servicio_crear_tercero,
    servicio_actualizar_tercero,
    servicio_eliminar_tercero,
)

tercero_bp = Blueprint('tercero_bp', __name__)

def _ctx_empresa_user():
    # Headers enviados por el gateway (JWT / InicioNestJs)
    id_empresa = request.headers.get("X-Company-Id") or request.headers.get("x-company-id")
    user_id = request.headers.get("X-User-Id") or request.headers.get("x-user-id")
    scope_acceso = request.headers.get("X-Scope-Acceso") or request.headers.get("x-scope-acceso") or "EMPRESA"
    return id_empresa, user_id, scope_acceso

@tercero_bp.route('/tercero', methods=['POST', 'OPTIONS'])
@tercero_bp.route('/tercero/', methods=['POST', 'OPTIONS'])
def crear_tercero():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa, user_id, _ = _ctx_empresa_user()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    data = request.get_json(silent=True) or {}
    try:
        res = servicio_crear_tercero(data, id_empresa=id_empresa, user_id=user_id)
        return jsonify(res), 201
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except IntegrityError as e:
        err_lower = str(e).lower()
        if "codigo_cliente" in err_lower and "unique" in err_lower:
            return jsonify({'error': 'Código cliente duplicado', 'field': 'codigo_cliente', 'type': 'duplicate'}), 409
        if "codigo_proveedor" in err_lower and "unique" in err_lower:
            return jsonify({'error': 'Código proveedor duplicado', 'field': 'codigo_proveedor', 'type': 'duplicate'}), 409
        return jsonify({'error': 'Error de duplicidad'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tercero_bp.route('/tercero/<string:id_tercero>', methods=['PUT', 'PATCH', 'OPTIONS'])
@tercero_bp.route('/tercero/<string:id_tercero>/', methods=['PUT', 'PATCH', 'OPTIONS'])
def actualizar_tercero(id_tercero):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa, user_id, scope_acceso = _ctx_empresa_user()
    if not id_empresa and scope_acceso != 'GLOBAL':
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    data = request.get_json(silent=True) or {}
    try:
        res = servicio_actualizar_tercero(id_tercero, id_empresa or '', data, user_id, scope_acceso=scope_acceso)
        if not res:
            return jsonify({'error': 'Tercero no encontrado'}), 404
        return jsonify(res), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except IntegrityError as e:
        err_lower = str(e).lower()
        if "codigo_cliente" in err_lower and "unique" in err_lower:
            return jsonify({'error': 'Código cliente duplicado', 'field': 'codigo_cliente', 'type': 'duplicate'}), 409
        if "codigo_proveedor" in err_lower and "unique" in err_lower:
            return jsonify({'error': 'Código proveedor duplicado', 'field': 'codigo_proveedor', 'type': 'duplicate'}), 409
        return jsonify({'error': 'Error de duplicidad'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tercero_bp.route('/tercero/<string:id_tercero>', methods=['DELETE', 'OPTIONS'])
@tercero_bp.route('/tercero/<string:id_tercero>/', methods=['DELETE', 'OPTIONS'])
def eliminar_tercero(id_tercero):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa, user_id, scope_acceso = _ctx_empresa_user()
    if not id_empresa and scope_acceso != 'GLOBAL':
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    try:
        ok = servicio_eliminar_tercero(id_tercero, id_empresa or '', user_id, scope_acceso=scope_acceso)
        if not ok:
            return jsonify({'error': 'Tercero no encontrado'}), 404
        return jsonify({'message': 'Tercero eliminado exitosamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
