from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services.factura_cliente_service import (
    crear_factura_borrador,
    reemplazar_lineas,
    validar_factura,
    anular_factura,
    encolar_correo_factura,
)

facturas_proveedores_bp = Blueprint('facturas_proveedores_bp', __name__)


def _empresa_id():
    return request.headers.get('X-Company-Id') or request.headers.get('x-company-id')


@facturas_proveedores_bp.route('/facturas-proveedores', methods=['POST', 'OPTIONS'])
@facturas_proveedores_bp.route('/facturas-proveedores/', methods=['POST', 'OPTIONS'])
def crear_borrador():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id en headers'}), 400
    try:
        out = crear_factura_borrador(id_empresa, request.get_json(silent=True) or {}, es_proveedor=True)
        return jsonify({'success': True, 'data': out}), 201
    except ValidationError as ve:
        return jsonify({'success': False, 'error': ve.messages}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@facturas_proveedores_bp.route('/facturas-proveedores/<id_factura>/lineas', methods=['PUT', 'OPTIONS'])
def put_lineas(id_factura: str):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        out = reemplazar_lineas(id_empresa, id_factura, request.get_json(silent=True) or {})
        return jsonify({'success': True, 'data': out}), 200
    except ValidationError as ve:
        return jsonify({'success': False, 'error': ve.messages}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@facturas_proveedores_bp.route('/facturas-proveedores/<id_factura>/validar', methods=['POST', 'OPTIONS'])
def post_validar(id_factura: str):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        out = validar_factura(id_empresa, id_factura, es_proveedor=True)
        return jsonify({'success': True, 'data': out}), 200
    except ValidationError as ve:
        return jsonify({'success': False, 'error': ve.messages}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@facturas_proveedores_bp.route('/facturas-proveedores/<id_factura>/anular', methods=['POST', 'OPTIONS'])
def post_anular(id_factura: str):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        out = anular_factura(id_empresa, id_factura, es_proveedor=True)
        return jsonify({'success': True, 'data': out}), 200
    except ValidationError as ve:
        return jsonify({'success': False, 'error': ve.messages}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@facturas_proveedores_bp.route('/facturas-proveedores/<id_factura>/enviar-correo', methods=['POST', 'OPTIONS'])
def post_enviar_correo(id_factura: str):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        out = encolar_correo_factura(
            id_empresa, id_factura, request.get_json(silent=True) or {}, es_proveedor=True
        )
        return jsonify({'success': True, 'data': out}), 200
    except ValidationError as ve:
        return jsonify({'success': False, 'error': ve.messages}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
