from flask import Blueprint, request, jsonify
from models.cuenta_bancaria import CuentaBancaria
from schemas.cuenta_bancaria_schema import CuentaBancariaSchema, CuentaBancariaCreateSchema, CuentaBancariaUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError
from decimal import Decimal

cuenta_bancaria_bp = Blueprint('cuenta_bancaria_bp', __name__)
cuenta_bancaria_schema = CuentaBancariaSchema()
cuenta_bancaria_create_schema = CuentaBancariaCreateSchema()
cuenta_bancaria_update_schema = CuentaBancariaUpdateSchema()

@cuenta_bancaria_bp.route('/cuenta-bancaria', methods=['POST', 'OPTIONS'])
@cuenta_bancaria_bp.route('/cuenta-bancaria/', methods=['POST', 'OPTIONS'])
def crear_cuenta_bancaria():
    """Crear una nueva cuenta bancaria"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        errors = cuenta_bancaria_create_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        # Convertir valores a Decimal
        for key in ['saldo_inicial', 'saldo_actual']:
            if key in data:
                data[key] = Decimal(str(data[key]))
        
        cuenta_bancaria = CuentaBancaria(**data)
        db.session.add(cuenta_bancaria)
        db.session.commit()
        
        result = cuenta_bancaria_schema.dump(cuenta_bancaria)
        return jsonify(result), 201
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({
            'error': 'Ya existe una cuenta bancaria con este número para este banco en esta empresa',
            'field': 'numero_cuenta',
            'type': 'duplicate'
        }), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cuenta_bancaria_bp.route('/cuenta-bancaria/<int:id>', methods=['PUT', 'OPTIONS'])
@cuenta_bancaria_bp.route('/cuenta-bancaria/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_cuenta_bancaria(id):
    """Actualizar cuenta bancaria"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        cuenta_bancaria = CuentaBancaria.query.get(id)
        if not cuenta_bancaria:
            return jsonify({'error': 'Cuenta bancaria no encontrada'}), 404
        
        data = request.get_json()
        errors = cuenta_bancaria_update_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        for key, value in data.items():
            if hasattr(cuenta_bancaria, key):
                if key in ['saldo_inicial', 'saldo_actual']:
                    setattr(cuenta_bancaria, key, Decimal(str(value)))
                else:
                    setattr(cuenta_bancaria, key, value)
        
        db.session.commit()
        result = cuenta_bancaria_schema.dump(cuenta_bancaria)
        return jsonify(result), 200
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'error': 'Error de duplicidad'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cuenta_bancaria_bp.route('/cuenta-bancaria/<int:id>', methods=['DELETE', 'OPTIONS'])
@cuenta_bancaria_bp.route('/cuenta-bancaria/<int:id>/', methods=['DELETE', 'OPTIONS'])
def eliminar_cuenta_bancaria(id):
    """Desactivar cuenta bancaria"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        cuenta_bancaria = CuentaBancaria.query.get(id)
        if not cuenta_bancaria:
            return jsonify({'error': 'Cuenta bancaria no encontrada'}), 404
        
        cuenta_bancaria.estado = False
        db.session.commit()
        return jsonify({'message': 'Cuenta bancaria desactivada exitosamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
