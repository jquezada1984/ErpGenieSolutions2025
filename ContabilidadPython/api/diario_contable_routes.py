from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services.diario_contable_service import (
    crear_diario_contable,
    actualizar_diario_contable,
    patch_activo_diario,
    eliminar_diario_contable,
    inicializar_diarios_defecto,
)

diario_contable_bp = Blueprint('diario_contable_bp', __name__)


def _empresa_id():
    return request.headers.get('X-Company-Id') or request.headers.get('x-company-id')


@diario_contable_bp.route('/diarios-contables/inicializar-defecto', methods=['POST', 'OPTIONS'])
def inicializar_defecto():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    try:
        out = inicializar_diarios_defecto(id_empresa)
        return jsonify({'creados': out, 'total': len(out)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@diario_contable_bp.route('/diarios-contables', methods=['POST', 'OPTIONS'])
def crear():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    try:
        out = crear_diario_contable(id_empresa, request.get_json(silent=True) or {})
        return jsonify(out), 201
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@diario_contable_bp.route('/diarios-contables/<id_diario>', methods=['PUT', 'OPTIONS'])
def actualizar(id_diario):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    try:
        out = actualizar_diario_contable(id_empresa, id_diario, request.get_json(silent=True) or {})
        return jsonify(out), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@diario_contable_bp.route('/diarios-contables/<id_diario>/activo', methods=['PATCH', 'OPTIONS'])
def patch_activo(id_diario):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    body = request.get_json(silent=True) or {}
    activo = body.get('activo', body.get('estado', True))
    try:
        out = patch_activo_diario(id_empresa, id_diario, bool(activo))
        return jsonify(out), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@diario_contable_bp.route('/diarios-contables/<id_diario>', methods=['DELETE', 'OPTIONS'])
def eliminar(id_diario):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    try:
        eliminar_diario_contable(id_empresa, id_diario)
        return jsonify({'ok': True}), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
