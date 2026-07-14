from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services import cuenta_iva_service as svc

cuenta_iva_bp = Blueprint('cuenta_iva_bp', __name__)


def _empresa_id():
    return request.headers.get('X-Company-Id') or request.headers.get('x-company-id')


@cuenta_iva_bp.route('/cuentas-iva', methods=['GET', 'OPTIONS'])
def listar():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    return jsonify({'data': svc.listar(id_empresa)}), 200


@cuenta_iva_bp.route('/cuentas-iva', methods=['POST', 'OPTIONS'])
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


@cuenta_iva_bp.route('/cuentas-iva/<id_row>', methods=['PUT', 'OPTIONS'])
def actualizar(id_row):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        return jsonify(svc.actualizar(id_empresa, id_row, request.get_json(silent=True) or {})), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@cuenta_iva_bp.route('/cuentas-iva/<id_row>', methods=['DELETE', 'OPTIONS'])
def eliminar(id_row):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        return jsonify(svc.eliminar(id_empresa, id_row)), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
