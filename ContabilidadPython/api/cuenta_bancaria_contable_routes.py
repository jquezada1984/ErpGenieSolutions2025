from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services import cuenta_bancaria_contable_service as svc

cuenta_bancaria_contable_bp = Blueprint('cuenta_bancaria_contable_bp', __name__)


def _empresa_id():
    return request.headers.get('X-Company-Id') or request.headers.get('x-company-id')


@cuenta_bancaria_contable_bp.route('/cuentas-bancarias-contables', methods=['GET', 'OPTIONS'])
def listar():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    return jsonify({'data': svc.listar(id_empresa)}), 200


@cuenta_bancaria_contable_bp.route('/cuentas-bancarias-contables/<id_cb>', methods=['PUT', 'OPTIONS'])
def actualizar(id_cb):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        return jsonify(svc.actualizar_contabilidad(id_empresa, id_cb, request.get_json(silent=True) or {})), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
