from flask import Blueprint, request, jsonify
from models.movimiento_contable import MovimientoContable
from models.asiento_contable import AsientoContable
from schemas.movimiento_contable_schema import MovimientoContableSchema, MovimientoContableCreateSchema, MovimientoContableUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError
from decimal import Decimal

movimiento_contable_bp = Blueprint('movimiento_contable_bp', __name__)
movimiento_contable_schema = MovimientoContableSchema()
movimiento_contable_create_schema = MovimientoContableCreateSchema()
movimiento_contable_update_schema = MovimientoContableUpdateSchema()

@movimiento_contable_bp.route('/movimiento-contable', methods=['POST', 'OPTIONS'])
@movimiento_contable_bp.route('/movimiento-contable/', methods=['POST', 'OPTIONS'])
def crear_movimiento_contable():
    """Crear un nuevo movimiento contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        print(f"📝 Datos recibidos para crear movimiento contable: {data}")
        
        # Validar y deserializar
        errors = movimiento_contable_create_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Verificar que el asiento contable existe
        asiento = AsientoContable.query.get(data['asiento_contable_id'])
        if not asiento:
            return jsonify({'error': 'Asiento contable no encontrado'}), 404
        
        # Convertir valores a Decimal
        if 'debe' in data:
            data['debe'] = Decimal(str(data['debe']))
        if 'haber' in data:
            data['haber'] = Decimal(str(data['haber']))
        
        # Crear movimiento contable
        movimiento = MovimientoContable(**data)
        db.session.add(movimiento)
        
        # Actualizar totales del asiento contable
        asiento.total_debe = Decimal(str(asiento.total_debe or 0)) + Decimal(str(data.get('debe', 0)))
        asiento.total_haber = Decimal(str(asiento.total_haber or 0)) + Decimal(str(data.get('haber', 0)))
        
        db.session.commit()
        
        result = movimiento_contable_schema.dump(movimiento)
        print(f"✅ Movimiento contable creado exitosamente: {result}")
        return jsonify(result), 201
    except IntegrityError as e:
        print(f"❌ Error de integridad al crear movimiento contable: {e}")
        db.session.rollback()
        return jsonify({'error': 'Error de integridad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al crear movimiento contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@movimiento_contable_bp.route('/movimiento-contable/<int:id>', methods=['PUT', 'OPTIONS'])
@movimiento_contable_bp.route('/movimiento-contable/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_movimiento_contable(id):
    """Actualizar un movimiento contable existente"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        movimiento = MovimientoContable.query.get(id)
        if not movimiento:
            return jsonify({'error': 'Movimiento contable no encontrado'}), 404
        
        data = request.get_json()
        print(f"📝 Datos recibidos para actualizar movimiento contable {id}: {data}")
        
        # Validar y deserializar
        errors = movimiento_contable_update_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Guardar valores antiguos para actualizar totales del asiento
        debe_anterior = movimiento.debe
        haber_anterior = movimiento.haber
        
        # Actualizar campos
        for key, value in data.items():
            if hasattr(movimiento, key):
                if key in ['debe', 'haber']:
                    setattr(movimiento, key, Decimal(str(value)))
                else:
                    setattr(movimiento, key, value)
        
        # Actualizar totales del asiento contable
        asiento = AsientoContable.query.get(movimiento.asiento_contable_id)
        if asiento:
            asiento.total_debe = Decimal(str(asiento.total_debe)) - Decimal(str(debe_anterior)) + Decimal(str(movimiento.debe))
            asiento.total_haber = Decimal(str(asiento.total_haber)) - Decimal(str(haber_anterior)) + Decimal(str(movimiento.haber))
        
        db.session.commit()
        
        result = movimiento_contable_schema.dump(movimiento)
        print(f"✅ Movimiento contable actualizado exitosamente: {result}")
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Error al actualizar movimiento contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@movimiento_contable_bp.route('/movimiento-contable/<int:id>', methods=['DELETE', 'OPTIONS'])
@movimiento_contable_bp.route('/movimiento-contable/<int:id>/', methods=['DELETE', 'OPTIONS'])
def eliminar_movimiento_contable(id):
    """Eliminar un movimiento contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        movimiento = MovimientoContable.query.get(id)
        if not movimiento:
            return jsonify({'error': 'Movimiento contable no encontrado'}), 404
        
        # Guardar valores para actualizar totales del asiento
        debe_anterior = movimiento.debe
        haber_anterior = movimiento.haber
        asiento_id = movimiento.asiento_contable_id
        
        # Eliminar movimiento
        db.session.delete(movimiento)
        
        # Actualizar totales del asiento contable
        asiento = AsientoContable.query.get(asiento_id)
        if asiento:
            asiento.total_debe = Decimal(str(asiento.total_debe)) - Decimal(str(debe_anterior))
            asiento.total_haber = Decimal(str(asiento.total_haber)) - Decimal(str(haber_anterior))
        
        db.session.commit()
        return jsonify({'message': 'Movimiento contable eliminado exitosamente'}), 200
    except Exception as e:
        print(f"❌ Error al eliminar movimiento contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
