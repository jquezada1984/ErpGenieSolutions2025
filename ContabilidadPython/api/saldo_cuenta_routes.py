from flask import Blueprint, request, jsonify
from models.saldo_cuenta import SaldoCuenta
from schemas.saldo_cuenta_schema import SaldoCuentaSchema, SaldoCuentaCreateSchema, SaldoCuentaUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError
from decimal import Decimal

saldo_cuenta_bp = Blueprint('saldo_cuenta_bp', __name__)
saldo_cuenta_schema = SaldoCuentaSchema()
saldo_cuenta_create_schema = SaldoCuentaCreateSchema()
saldo_cuenta_update_schema = SaldoCuentaUpdateSchema()

@saldo_cuenta_bp.route('/saldo-cuenta', methods=['POST', 'OPTIONS'])
@saldo_cuenta_bp.route('/saldo-cuenta/', methods=['POST', 'OPTIONS'])
def crear_saldo_cuenta():
    """Crear un nuevo saldo de cuenta"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        print(f"📝 Datos recibidos para crear saldo de cuenta: {data}")
        
        # Validar y deserializar
        errors = saldo_cuenta_create_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Convertir valores a Decimal
        for key in ['saldo_debe', 'saldo_haber', 'saldo_final']:
            if key in data:
                data[key] = Decimal(str(data[key]))
        
        # Crear saldo de cuenta
        saldo = SaldoCuenta(**data)
        db.session.add(saldo)
        db.session.commit()
        
        result = saldo_cuenta_schema.dump(saldo)
        print(f"✅ Saldo de cuenta creado exitosamente: {result}")
        return jsonify(result), 201
    except IntegrityError as e:
        print(f"❌ Error de integridad al crear saldo de cuenta: {e}")
        db.session.rollback()
        return jsonify({'error': 'Error de integridad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al crear saldo de cuenta: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@saldo_cuenta_bp.route('/saldo-cuenta/<int:id>', methods=['PUT', 'OPTIONS'])
@saldo_cuenta_bp.route('/saldo-cuenta/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_saldo_cuenta(id):
    """Actualizar un saldo de cuenta existente"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        saldo = SaldoCuenta.query.get(id)
        if not saldo:
            return jsonify({'error': 'Saldo de cuenta no encontrado'}), 404
        
        data = request.get_json()
        print(f"📝 Datos recibidos para actualizar saldo de cuenta {id}: {data}")
        
        # Validar y deserializar
        errors = saldo_cuenta_update_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Actualizar campos
        for key, value in data.items():
            if hasattr(saldo, key):
                if key in ['saldo_debe', 'saldo_haber', 'saldo_final']:
                    setattr(saldo, key, Decimal(str(value)))
                else:
                    setattr(saldo, key, value)
        
        db.session.commit()
        
        result = saldo_cuenta_schema.dump(saldo)
        print(f"✅ Saldo de cuenta actualizado exitosamente: {result}")
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Error al actualizar saldo de cuenta: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@saldo_cuenta_bp.route('/saldo-cuenta/<int:id>', methods=['DELETE', 'OPTIONS'])
@saldo_cuenta_bp.route('/saldo-cuenta/<int:id>/', methods=['DELETE', 'OPTIONS'])
def eliminar_saldo_cuenta(id):
    """Eliminar un saldo de cuenta"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        saldo = SaldoCuenta.query.get(id)
        if not saldo:
            return jsonify({'error': 'Saldo de cuenta no encontrado'}), 404
        
        db.session.delete(saldo)
        db.session.commit()
        return jsonify({'message': 'Saldo de cuenta eliminado exitosamente'}), 200
    except Exception as e:
        print(f"❌ Error al eliminar saldo de cuenta: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
