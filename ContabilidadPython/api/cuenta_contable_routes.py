from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services.cuenta_contable_service import (
    crear_cuenta_contable,
    actualizar_cuenta_contable,
    patch_activo_cuenta,
    eliminar_cuenta_contable,
)

cuenta_contable_bp = Blueprint('cuenta_contable_bp', __name__)


@cuenta_contable_bp.route('/cuentas-contables', methods=['POST', 'OPTIONS'])
def crear():
    if request.method == 'OPTIONS':
        return '', 204
    try:
        out = crear_cuenta_contable(request.get_json(silent=True) or {})
        return jsonify(out), 201
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@cuenta_contable_bp.route('/cuentas-contables/<id_cuenta>', methods=['PUT', 'OPTIONS'])
def actualizar(id_cuenta):
    if request.method == 'OPTIONS':
        return '', 204
    try:
        out = actualizar_cuenta_contable(id_cuenta, request.get_json(silent=True) or {})
        return jsonify(out), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@cuenta_contable_bp.route('/cuentas-contables/<id_cuenta>/activo', methods=['PATCH', 'OPTIONS'])
def patch_activo(id_cuenta):
    if request.method == 'OPTIONS':
        return '', 204
    body = request.get_json(silent=True) or {}
    activo = body.get('activo', body.get('estado', True))
    try:
        out = patch_activo_cuenta(id_cuenta, bool(activo))
        return jsonify(out), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@cuenta_contable_bp.route('/cuentas-contables/<id_cuenta>', methods=['DELETE', 'OPTIONS'])
def eliminar(id_cuenta):
    if request.method == 'OPTIONS':
        return '', 204
    try:
        eliminar_cuenta_contable(id_cuenta)
        return jsonify({'ok': True}), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
