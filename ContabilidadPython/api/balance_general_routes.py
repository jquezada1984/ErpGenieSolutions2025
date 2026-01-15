from flask import Blueprint, request, jsonify
from models.balance_general import BalanceGeneral
from schemas.balance_general_schema import BalanceGeneralSchema, BalanceGeneralCreateSchema, BalanceGeneralUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError
from decimal import Decimal

balance_general_bp = Blueprint('balance_general_bp', __name__)
balance_general_schema = BalanceGeneralSchema()
balance_general_create_schema = BalanceGeneralCreateSchema()
balance_general_update_schema = BalanceGeneralUpdateSchema()

@balance_general_bp.route('/balance-general', methods=['POST', 'OPTIONS'])
@balance_general_bp.route('/balance-general/', methods=['POST', 'OPTIONS'])
def crear_balance_general():
    """Crear un nuevo balance general"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        print(f"📝 Datos recibidos para crear balance general: {data}")
        
        # Validar y deserializar
        errors = balance_general_create_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Convertir valores a Decimal
        if 'total_activos' in data:
            data['total_activos'] = Decimal(str(data['total_activos']))
        if 'total_pasivos' in data:
            data['total_pasivos'] = Decimal(str(data['total_pasivos']))
        if 'total_patrimonio' in data:
            data['total_patrimonio'] = Decimal(str(data['total_patrimonio']))
        
        # Crear balance general
        balance = BalanceGeneral(**data)
        db.session.add(balance)
        db.session.commit()
        
        result = balance_general_schema.dump(balance)
        print(f"✅ Balance general creado exitosamente: {result}")
        return jsonify(result), 201
    except IntegrityError as e:
        print(f"❌ Error de integridad al crear balance general: {e}")
        db.session.rollback()
        return jsonify({'error': 'Error de integridad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al crear balance general: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@balance_general_bp.route('/balance-general/<int:id>', methods=['PUT', 'OPTIONS'])
@balance_general_bp.route('/balance-general/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_balance_general(id):
    """Actualizar un balance general existente"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        balance = BalanceGeneral.query.get(id)
        if not balance:
            return jsonify({'error': 'Balance general no encontrado'}), 404
        
        data = request.get_json()
        print(f"📝 Datos recibidos para actualizar balance general {id}: {data}")
        
        # Validar y deserializar
        errors = balance_general_update_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Actualizar campos
        for key, value in data.items():
            if hasattr(balance, key):
                if key in ['total_activos', 'total_pasivos', 'total_patrimonio']:
                    setattr(balance, key, Decimal(str(value)))
                else:
                    setattr(balance, key, value)
        
        db.session.commit()
        
        result = balance_general_schema.dump(balance)
        print(f"✅ Balance general actualizado exitosamente: {result}")
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Error al actualizar balance general: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@balance_general_bp.route('/balance-general/<int:id>', methods=['DELETE', 'OPTIONS'])
@balance_general_bp.route('/balance-general/<int:id>/', methods=['DELETE', 'OPTIONS'])
def eliminar_balance_general(id):
    """Eliminar un balance general"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        balance = BalanceGeneral.query.get(id)
        if not balance:
            return jsonify({'error': 'Balance general no encontrado'}), 404
        
        db.session.delete(balance)
        db.session.commit()
        return jsonify({'message': 'Balance general eliminado exitosamente'}), 200
    except Exception as e:
        print(f"❌ Error al eliminar balance general: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@balance_general_bp.route('/balance-general/<int:id>/aprobar', methods=['POST', 'OPTIONS'])
@balance_general_bp.route('/balance-general/<int:id>/aprobar/', methods=['POST', 'OPTIONS'])
def aprobar_balance_general(id):
    """Aprobar un balance general"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        balance = BalanceGeneral.query.get(id)
        if not balance:
            return jsonify({'error': 'Balance general no encontrado'}), 404
        
        balance.estado = 'APROBADO'
        db.session.commit()
        
        result = balance_general_schema.dump(balance)
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Error al aprobar balance general: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
