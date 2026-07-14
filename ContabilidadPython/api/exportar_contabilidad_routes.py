from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services.exportar_contabilidad_service import listar_movimientos_exportar, ejecutar_exportacion

exportar_contabilidad_bp = Blueprint('exportar_contabilidad_bp', __name__)


def _empresa_id():
    return request.headers.get('X-Company-Id') or request.headers.get('x-company-id')


@exportar_contabilidad_bp.route('/contabilidad/exportar', methods=['GET', 'OPTIONS'])
def listar():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    desde = request.args.get('desde') or '2000-01-01'
    hasta = request.args.get('hasta') or '2099-12-31'
    incluir = request.args.get('incluir_exportados', 'false').lower() in ('1', 'true', 'yes')
    try:
        data = listar_movimientos_exportar(id_empresa, desde, hasta, incluir)
        return jsonify({'data': data, 'total': len(data)}), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@exportar_contabilidad_bp.route('/contabilidad/exportar/ejecutar', methods=['POST', 'OPTIONS'])
def ejecutar():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    body = request.get_json(silent=True) or {}
    desde = body.get('desde') or '2000-01-01'
    hasta = body.get('hasta') or '2099-12-31'
    ids = body.get('ids_movimientos')
    try:
        out = ejecutar_exportacion(id_empresa, desde, hasta, ids)
        return jsonify(out), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
