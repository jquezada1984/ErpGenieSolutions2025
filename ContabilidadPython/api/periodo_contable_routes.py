from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services.periodo_contable_service import crear_periodo_contable, cerrar_periodo_contable

periodo_contable_bp = Blueprint('periodo_contable_bp', __name__)


def _empresa_id():
    return request.headers.get('X-Company-Id') or request.headers.get('x-company-id')


@periodo_contable_bp.route('/periodos-contables', methods=['POST', 'OPTIONS'])
def crear():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    try:
        out = crear_periodo_contable(id_empresa, request.get_json(silent=True) or {})
        return jsonify(out), 201
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@periodo_contable_bp.route('/periodos-contables/<id_periodo>/cerrar', methods=['PATCH', 'OPTIONS'])
def cerrar(id_periodo):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    id_usuario = request.headers.get('X-User-Id') or request.headers.get('x-user-id')
    try:
        out = cerrar_periodo_contable(id_empresa, id_periodo, id_usuario)
        return jsonify(out), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
