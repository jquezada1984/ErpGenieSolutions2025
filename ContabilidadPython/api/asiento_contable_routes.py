from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services import asiento_contable_service as svc

asiento_contable_bp = Blueprint('asiento_contable_bp', __name__)


def _empresa_id():
    return request.headers.get('X-Company-Id') or request.headers.get('x-company-id')


def _user_id():
    return request.headers.get('X-User-Id') or request.headers.get('x-user-id')


@asiento_contable_bp.route('/asientos-contables', methods=['POST', 'OPTIONS'])
def crear_asiento():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        data = svc.crear_asiento_manual(id_empresa, request.get_json(silent=True) or {}, _user_id())
        return jsonify(data), 201
    except ValidationError as ve:
        return jsonify(ve.messages), 400


@asiento_contable_bp.route('/asientos-contables/<id_asiento>/aprobar', methods=['PATCH', 'OPTIONS'])
def aprobar_asiento(id_asiento: str):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        data = svc.aprobar_asiento(id_empresa, id_asiento, _user_id())
        return jsonify(data), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400


@asiento_contable_bp.route('/asientos-contables/<id_asiento>/reversar', methods=['POST', 'OPTIONS'])
def reversar_asiento(id_asiento: str):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        data = svc.reversar_asiento(id_empresa, id_asiento, _user_id())
        return jsonify(data), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
