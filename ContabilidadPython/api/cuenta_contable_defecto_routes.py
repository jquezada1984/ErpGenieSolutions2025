from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services.cuenta_contable_defecto_service import (
    inicializar_cuentas_defecto,
    guardar_cuentas_defecto,
)

cuenta_contable_defecto_bp = Blueprint('cuenta_contable_defecto_bp', __name__)


def _empresa_id():
    return request.headers.get('X-Company-Id') or request.headers.get('x-company-id')


@cuenta_contable_defecto_bp.route('/cuentas-contables-defecto/inicializar', methods=['POST', 'OPTIONS'])
def inicializar():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    try:
        out = inicializar_cuentas_defecto(id_empresa)
        return jsonify({'creados': out, 'total': len(out)}), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@cuenta_contable_defecto_bp.route('/cuentas-contables-defecto', methods=['PUT', 'OPTIONS'])
def guardar():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    body = request.get_json(silent=True) or {}
    items = body.get('items') or body
    if not isinstance(items, list):
        return jsonify({'error': 'Se espera un arreglo items'}), 400
    try:
        guardar_cuentas_defecto(id_empresa, items)
        return jsonify({'ok': True}), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
