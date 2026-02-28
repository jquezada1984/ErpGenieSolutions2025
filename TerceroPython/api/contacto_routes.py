from flask import Blueprint, request, jsonify
import traceback

from services.contacto_service import (
    create_contacto as servicio_create_contacto,
    get_contactos_by_tercero as servicio_get_contactos_by_tercero,
    get_contacto_by_id as servicio_get_contacto_by_id,
    update_contacto as servicio_update_contacto,
    toggle_estado as servicio_toggle_estado,
)

contacto_bp = Blueprint('contacto_bp', __name__)


@contacto_bp.route('/contactos', methods=['POST', 'OPTIONS'])
@contacto_bp.route('/contactos/', methods=['POST', 'OPTIONS'])
def crear_contacto():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json(silent=True) or {}
    print('[CONTACTO] POST /contactos - payload recibido:', data)
    try:
        print('[CONTACTO] POST /contactos - antes de llamar a servicio_create_contacto')
        res = servicio_create_contacto(data)
        print('[CONTACTO] POST /contactos - éxito', {'id_contacto': res.get('id_contacto')})
        return jsonify(res), 201
    except ValueError as e:
        print('[CONTACTO] POST /contactos - ValueError', str(e))
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print('ERROR REAL:', str(e))
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@contacto_bp.route('/contactos/tercero/<string:id_tercero>', methods=['GET', 'OPTIONS'])
@contacto_bp.route('/contactos/tercero/<string:id_tercero>/', methods=['GET', 'OPTIONS'])
def listar_contactos_tercero(id_tercero):
    if request.method == 'OPTIONS':
        return '', 204
    try:
        solo_activos = request.args.get('activos', 'true').lower() == 'true'
        res = servicio_get_contactos_by_tercero(id_tercero, solo_activos=solo_activos)
        return jsonify(res), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@contacto_bp.route('/contactos/<string:id_contacto>', methods=['GET', 'OPTIONS'])
@contacto_bp.route('/contactos/<string:id_contacto>/', methods=['GET', 'OPTIONS'])
def obtener_contacto(id_contacto):
    if request.method == 'OPTIONS':
        return '', 204
    try:
        res = servicio_get_contacto_by_id(id_contacto)
        if not res:
            return jsonify({'error': 'Contacto no encontrado'}), 404
        return jsonify(res), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@contacto_bp.route('/contactos/<string:id_contacto>', methods=['PUT', 'OPTIONS'])
@contacto_bp.route('/contactos/<string:id_contacto>/', methods=['PUT', 'OPTIONS'])
def actualizar_contacto(id_contacto):
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json(silent=True) or {}
    try:
        res = servicio_update_contacto(id_contacto, data)
        if not res:
            return jsonify({'error': 'Contacto no encontrado'}), 404
        return jsonify(res), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@contacto_bp.route('/contactos/<string:id_contacto>/estado', methods=['PATCH', 'OPTIONS'])
@contacto_bp.route('/contactos/<string:id_contacto>/estado/', methods=['PATCH', 'OPTIONS'])
def toggle_contacto_estado(id_contacto):
    if request.method == 'OPTIONS':
        return '', 204
    try:
        res = servicio_toggle_estado(id_contacto)
        if not res:
            return jsonify({'error': 'Contacto no encontrado'}), 404
        return jsonify(res), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
