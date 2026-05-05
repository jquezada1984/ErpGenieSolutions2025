from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services.factura_cliente_service import crear_factura_cliente_borrador


facturas_clientes_bp = Blueprint('facturas_clientes_bp', __name__)


@facturas_clientes_bp.route('/facturas-clientes', methods=['POST', 'OPTIONS'])
@facturas_clientes_bp.route('/facturas-clientes/', methods=['POST', 'OPTIONS'])
def crear_borrador():
    if request.method == 'OPTIONS':
        return '', 204

    id_empresa = request.headers.get('X-Company-Id') or request.headers.get('x-company-id')
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400

    data = request.get_json(silent=True) or {}
    try:
        out = crear_factura_cliente_borrador(id_empresa=id_empresa, payload=data)
        return jsonify({'success': True, 'data': out}), 201
    except ValidationError as ve:
        return jsonify({'success': False, 'error': ve.messages}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
