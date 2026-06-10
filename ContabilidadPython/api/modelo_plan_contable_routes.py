from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services.modelo_plan_contable_service import (
    crear_modelo_plan_contable,
    actualizar_modelo_plan_contable,
    patch_activo_modelo,
    eliminar_modelo_plan_contable,
)

modelo_plan_contable_bp = Blueprint('modelo_plan_contable_bp', __name__)


@modelo_plan_contable_bp.route('/modelos-planes-contables', methods=['POST', 'OPTIONS'])
def crear():
    if request.method == 'OPTIONS':
        return '', 204
    try:
        out = crear_modelo_plan_contable(request.get_json(silent=True) or {})
        return jsonify(out), 201
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@modelo_plan_contable_bp.route('/modelos-planes-contables/<id_modelo>', methods=['PUT', 'OPTIONS'])
def actualizar(id_modelo):
    if request.method == 'OPTIONS':
        return '', 204
    try:
        out = actualizar_modelo_plan_contable(id_modelo, request.get_json(silent=True) or {})
        return jsonify(out), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@modelo_plan_contable_bp.route('/modelos-planes-contables/<id_modelo>/activo', methods=['PATCH', 'OPTIONS'])
def patch_activo(id_modelo):
    if request.method == 'OPTIONS':
        return '', 204
    body = request.get_json(silent=True) or {}
    activo = body.get('activo', body.get('estado', True))
    try:
        out = patch_activo_modelo(id_modelo, bool(activo))
        return jsonify(out), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@modelo_plan_contable_bp.route('/modelos-planes-contables/<id_modelo>', methods=['DELETE', 'OPTIONS'])
def eliminar(id_modelo):
    if request.method == 'OPTIONS':
        return '', 204
    try:
        eliminar_modelo_plan_contable(id_modelo)
        return jsonify({'ok': True}), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
