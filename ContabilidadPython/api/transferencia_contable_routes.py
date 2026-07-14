from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from services import transferencia_contable_service as svc

transferencia_bp = Blueprint('transferencia_bp', __name__)


def _empresa_id():
    return request.headers.get('X-Company-Id') or request.headers.get('x-company-id')


@transferencia_bp.route('/transferencia-contable/facturas-clientes/resumen', methods=['GET', 'OPTIONS'])
def resumen_clientes():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    anio = int(request.args.get('anio') or 2025)
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    return jsonify(svc.resumen_vinculacion(id_empresa, anio, True)), 200


@transferencia_bp.route('/transferencia-contable/facturas-proveedores/resumen', methods=['GET', 'OPTIONS'])
def resumen_proveedores():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    anio = int(request.args.get('anio') or 2025)
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    return jsonify(svc.resumen_vinculacion(id_empresa, anio, False)), 200


@transferencia_bp.route('/transferencia-contable/facturas-clientes/lineas', methods=['GET', 'OPTIONS'])
def lineas_clientes():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    anio = int(request.args.get('anio') or 2025)
    vinc = request.args.get('vinculadas', 'false').lower() in ('1', 'true', 'yes')
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    return jsonify({'data': svc.lineas_transferencia(id_empresa, anio, True, vinc)}), 200


@transferencia_bp.route('/transferencia-contable/facturas-proveedores/lineas', methods=['GET', 'OPTIONS'])
def lineas_proveedores():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    anio = int(request.args.get('anio') or 2025)
    vinc = request.args.get('vinculadas', 'false').lower() in ('1', 'true', 'yes')
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    return jsonify({'data': svc.lineas_transferencia(id_empresa, anio, False, vinc)}), 200


@transferencia_bp.route('/transferencia-contable/facturas-clientes/vincular-automatico', methods=['POST', 'OPTIONS'])
def vinc_auto_clientes():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    body = request.get_json(silent=True) or {}
    anio = int(body.get('anio') or request.args.get('anio') or 2025)
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        return jsonify(svc.vincular_automatico(id_empresa, anio, True)), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400


@transferencia_bp.route('/transferencia-contable/facturas-proveedores/vincular-automatico', methods=['POST', 'OPTIONS'])
def vinc_auto_proveedores():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    body = request.get_json(silent=True) or {}
    anio = int(body.get('anio') or request.args.get('anio') or 2025)
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        return jsonify(svc.vincular_automatico(id_empresa, anio, False)), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400


@transferencia_bp.route('/transferencia-contable/lineas/vincular', methods=['PATCH', 'OPTIONS'])
def vincular_lineas():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    body = request.get_json(silent=True) or {}
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        return jsonify(svc.vincular_lineas(id_empresa, body.get('ids_lineas') or [], body.get('id_cuenta_contable'))), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400


@transferencia_bp.route('/transferencia-contable/lineas/cambiar-cuenta', methods=['PATCH', 'OPTIONS'])
def cambiar_cuenta():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    body = request.get_json(silent=True) or {}
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        return jsonify(svc.cambiar_cuenta_lineas(id_empresa, body.get('ids_lineas') or [], body.get('id_cuenta_contable'))), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400


@transferencia_bp.route('/transferencia-contable/registro/<origen>/preview', methods=['GET', 'OPTIONS'])
def preview_registro(origen):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    desde = request.args.get('desde') or '2000-01-01'
    hasta = request.args.get('hasta') or '2099-12-31'
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    return jsonify({'data': svc.preview_registro(id_empresa, origen, desde, hasta)}), 200


@transferencia_bp.route('/transferencia-contable/registro/<origen>', methods=['POST', 'OPTIONS'])
def ejecutar_registro(origen):
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    body = request.get_json(silent=True) or {}
    desde = body.get('desde') or '2000-01-01'
    hasta = body.get('hasta') or '2099-12-31'
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    try:
        return jsonify(svc.ejecutar_registro(id_empresa, origen, desde, hasta)), 200
    except ValidationError as ve:
        return jsonify(ve.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@transferencia_bp.route('/transferencia-contable/exportar-documentos', methods=['GET', 'OPTIONS'])
def exportar_docs():
    if request.method == 'OPTIONS':
        return '', 204
    id_empresa = _empresa_id()
    desde = request.args.get('desde') or '2000-01-01'
    hasta = request.args.get('hasta') or '2099-12-31'
    tipos = request.args.getlist('tipos[]') or request.args.getlist('tipos') or ['facturas', 'facturas_proveedor']
    if not id_empresa:
        return jsonify({'error': 'Falta X-Company-Id'}), 400
    return jsonify(svc.exportar_documentos_origen(id_empresa, desde, hasta, tipos)), 200
