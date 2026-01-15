from flask import Blueprint, request, jsonify
from models.cuenta_iva import CuentaIva
from schemas.cuenta_iva_schema import CuentaIvaSchema, CuentaIvaCreateSchema, CuentaIvaUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError
from decimal import Decimal

cuenta_iva_bp = Blueprint('cuenta_iva_bp', __name__)
cuenta_iva_schema = CuentaIvaSchema()
cuenta_iva_create_schema = CuentaIvaCreateSchema()
cuenta_iva_update_schema = CuentaIvaUpdateSchema()

@cuenta_iva_bp.route('/cuenta-iva', methods=['POST', 'OPTIONS'])
@cuenta_iva_bp.route('/cuenta-iva/', methods=['POST', 'OPTIONS'])
def crear_cuenta_iva():
    """Crear una nueva cuenta de IVA"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        errors = cuenta_iva_create_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        if 'porcentaje' in data:
            data['porcentaje'] = Decimal(str(data['porcentaje']))
        
        cuenta_iva = CuentaIva(**data)
        db.session.add(cuenta_iva)
        db.session.commit()
        
        result = cuenta_iva_schema.dump(cuenta_iva)
        return jsonify(result), 201
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({
            'error': 'Ya existe una cuenta de IVA con este tipo y porcentaje para esta empresa',
            'field': 'tipo_iva,porcentaje',
            'type': 'duplicate'
        }), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cuenta_iva_bp.route('/cuenta-iva/<int:id>', methods=['PUT', 'OPTIONS'])
@cuenta_iva_bp.route('/cuenta-iva/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_cuenta_iva(id):
    """Actualizar cuenta de IVA"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        cuenta_iva = CuentaIva.query.get(id)
        if not cuenta_iva:
            return jsonify({'error': 'Cuenta de IVA no encontrada'}), 404
        
        data = request.get_json()
        errors = cuenta_iva_update_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        for key, value in data.items():
            if hasattr(cuenta_iva, key):
                if key == 'porcentaje':
                    setattr(cuenta_iva, key, Decimal(str(value)))
                else:
                    setattr(cuenta_iva, key, value)
        
        db.session.commit()
        result = cuenta_iva_schema.dump(cuenta_iva)
        return jsonify(result), 200
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'error': 'Error de duplicidad'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cuenta_iva_bp.route('/cuenta-iva/<int:id>', methods=['DELETE', 'OPTIONS'])
@cuenta_iva_bp.route('/cuenta-iva/<int:id>/', methods=['DELETE', 'OPTIONS'])
def eliminar_cuenta_iva(id):
    """Desactivar cuenta de IVA"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        cuenta_iva = CuentaIva.query.get(id)
        if not cuenta_iva:
            return jsonify({'error': 'Cuenta de IVA no encontrada'}), 404
        
        cuenta_iva.estado = False
        db.session.commit()
        return jsonify({'message': 'Cuenta de IVA desactivada exitosamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
