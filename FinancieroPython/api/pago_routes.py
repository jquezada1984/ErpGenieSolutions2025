from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services.pago_service import crear_pago, validar_pago, anular_pago

pagos_bp = Blueprint('pagos_bp', __name__)


def _empresa_id():
    return request.headers.get('X-Company-Id') or request.headers.get('x-company-id')


def _handle_crear(es_cobro: bool):
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        out = crear_pago(id_empresa, request.get_json(silent=True) or {}, es_cobro=es_cobro)
        return jsonify({'success': True, 'data': out}), 201
    except ValidationError as ve:
        return jsonify({'success': False, 'error': ve.messages}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


def _handle_accion(id_pago: str, es_cobro: bool, fn):
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        out = fn(id_empresa, id_pago, es_cobro=es_cobro)
        return jsonify({'success': True, 'data': out}), 200
    except ValidationError as ve:
        return jsonify({'success': False, 'error': ve.messages}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@pagos_bp.route('/cobros', methods=['POST', 'OPTIONS'])
def crear_cobro():
    if request.method == 'OPTIONS':
        return '', 204
    return _handle_crear(True)


@pagos_bp.route('/cobros/<id_pago>/validar', methods=['POST', 'OPTIONS'])
def validar_cobro(id_pago: str):
    if request.method == 'OPTIONS':
        return '', 204
    return _handle_accion(id_pago, True, validar_pago)


@pagos_bp.route('/cobros/<id_pago>/anular', methods=['POST', 'OPTIONS'])
def anular_cobro(id_pago: str):
    if request.method == 'OPTIONS':
        return '', 204
    return _handle_accion(id_pago, True, anular_pago)


@pagos_bp.route('/pagos-proveedor', methods=['POST', 'OPTIONS'])
def crear_pago_prov():
    if request.method == 'OPTIONS':
        return '', 204
    return _handle_crear(False)


@pagos_bp.route('/pagos-proveedor/<id_pago>/validar', methods=['POST', 'OPTIONS'])
def validar_pago_prov(id_pago: str):
    if request.method == 'OPTIONS':
        return '', 204
    return _handle_accion(id_pago, False, validar_pago)


@pagos_bp.route('/pagos-proveedor/<id_pago>/anular', methods=['POST', 'OPTIONS'])
def anular_pago_prov(id_pago: str):
    if request.method == 'OPTIONS':
        return '', 204
    return _handle_accion(id_pago, False, anular_pago)
