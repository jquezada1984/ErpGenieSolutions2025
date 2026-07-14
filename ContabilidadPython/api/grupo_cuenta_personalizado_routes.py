from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services import grupo_cuenta_personalizado_service as svc

grupo_cuenta_bp = Blueprint('grupo_cuenta_bp', __name__)


def _empresa_id():
    return request.headers.get('X-Company-Id') or request.headers.get('x-company-id')


@grupo_cuenta_bp.route('/grupos-cuentas-personalizados', methods=['GET', 'OPTIONS'])
def listar():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    return jsonify({'data': svc.listar(id_empresa)}), 200


@grupo_cuenta_bp.route('/grupos-cuentas-personalizados', methods=['POST', 'OPTIONS'])
def crear():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        return jsonify(svc.crear(id_empresa, request.get_json(silent=True) or {})), 201
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@grupo_cuenta_bp.route('/grupos-cuentas-personalizados/<id_grupo>', methods=['PUT', 'OPTIONS'])
def actualizar(id_grupo):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        return jsonify(svc.actualizar(id_empresa, id_grupo, request.get_json(silent=True) or {})), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@grupo_cuenta_bp.route('/grupos-cuentas-personalizados/<id_grupo>', methods=['DELETE', 'OPTIONS'])
def eliminar(id_grupo):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        return jsonify(svc.eliminar(id_empresa, id_grupo)), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@grupo_cuenta_bp.route('/grupos-cuentas-personalizados/<id_grupo>/cuentas', methods=['PUT', 'OPTIONS'])
def asignar_cuentas(id_grupo):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    body = request.get_json(silent=True) or {}
    try:
        return jsonify(svc.asignar_cuentas(id_empresa, id_grupo, body.get('ids_cuentas_contables') or [])), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
