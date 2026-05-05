from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services.configuracion_contabilidad_service import actualizar_configuracion_contabilidad


configuracion_contabilidad_bp = Blueprint('configuracion_contabilidad_bp', __name__)


@configuracion_contabilidad_bp.route('/configuracion-contabilidad', methods=['PUT', 'OPTIONS'])
@configuracion_contabilidad_bp.route('/configuracion-contabilidad/', methods=['PUT', 'OPTIONS'])
def upsert_configuracion_contabilidad():
    if request.method == 'OPTIONS':
        return '', 204

    id_empresa = request.headers.get('X-Company-Id') or request.headers.get('x-company-id')
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400

    data = request.get_json(silent=True) or {}
    try:
        out = actualizar_configuracion_contabilidad(id_empresa=id_empresa, payload=data)
        return jsonify(out), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
