from flask import Blueprint, request, jsonify
from models.asiento_contable import AsientoContable
from schemas.asiento_contable_schema import AsientoContableSchema, AsientoContableCreateSchema, AsientoContableUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError
from decimal import Decimal

asiento_contable_bp = Blueprint('asiento_contable_bp', __name__)
asiento_contable_schema = AsientoContableSchema()
asiento_contable_create_schema = AsientoContableCreateSchema()
asiento_contable_update_schema = AsientoContableUpdateSchema()

@asiento_contable_bp.route('/asiento-contable', methods=['POST', 'OPTIONS'])
@asiento_contable_bp.route('/asiento-contable/', methods=['POST', 'OPTIONS'])
def crear_asiento_contable():
    """Crear un nuevo asiento contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        print(f"📝 Datos recibidos para crear asiento contable: {data}")
        
        # Validar y deserializar
        errors = asiento_contable_create_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Calcular totales si no se proporcionan
        if 'total_debe' not in data or data['total_debe'] is None:
            data['total_debe'] = Decimal('0')
        if 'total_haber' not in data or data['total_haber'] is None:
            data['total_haber'] = Decimal('0')
        
        # Crear asiento contable
        asiento = AsientoContable(**data)
        db.session.add(asiento)
        db.session.commit()
        
        result = asiento_contable_schema.dump(asiento)
        print(f"✅ Asiento contable creado exitosamente: {result}")
        return jsonify(result), 201
    except IntegrityError as e:
        print(f"❌ Error de integridad al crear asiento contable: {e}")
        db.session.rollback()
        if "numero" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe un asiento contable con este número',
                'field': 'numero',
                'type': 'duplicate'
            }), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al crear asiento contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@asiento_contable_bp.route('/asiento-contable/<int:id>', methods=['PUT', 'OPTIONS'])
@asiento_contable_bp.route('/asiento-contable/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_asiento_contable(id):
    """Actualizar un asiento contable existente"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        asiento = AsientoContable.query.get(id)
        if not asiento:
            return jsonify({'error': 'Asiento contable no encontrado'}), 404
        
        data = request.get_json()
        print(f"📝 Datos recibidos para actualizar asiento contable {id}: {data}")
        
        # Validar y deserializar
        errors = asiento_contable_update_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Actualizar campos
        for key, value in data.items():
            if hasattr(asiento, key):
                setattr(asiento, key, value)
        
        db.session.commit()
        
        result = asiento_contable_schema.dump(asiento)
        print(f"✅ Asiento contable actualizado exitosamente: {result}")
        return jsonify(result), 200
    except IntegrityError as e:
        print(f"❌ Error de integridad al actualizar asiento contable: {e}")
        db.session.rollback()
        if "numero" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe un asiento contable con este número',
                'field': 'numero',
                'type': 'duplicate'
            }), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al actualizar asiento contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@asiento_contable_bp.route('/asiento-contable/<int:id>', methods=['DELETE', 'OPTIONS'])
@asiento_contable_bp.route('/asiento-contable/<int:id>/', methods=['DELETE', 'OPTIONS'])
def eliminar_asiento_contable(id):
    """Anular un asiento contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        asiento = AsientoContable.query.get(id)
        if not asiento:
            return jsonify({'error': 'Asiento contable no encontrado'}), 404
        
        asiento.estado = 'ANULADO'
        db.session.commit()
        return jsonify({'message': 'Asiento contable anulado exitosamente'}), 200
    except Exception as e:
        print(f"❌ Error al anular asiento contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@asiento_contable_bp.route('/asiento-contable/<int:id>/aprobar', methods=['POST', 'OPTIONS'])
@asiento_contable_bp.route('/asiento-contable/<int:id>/aprobar/', methods=['POST', 'OPTIONS'])
def aprobar_asiento_contable(id):
    """Aprobar un asiento contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        asiento = AsientoContable.query.get(id)
        if not asiento:
            return jsonify({'error': 'Asiento contable no encontrado'}), 404
        
        asiento.estado = 'APROBADO'
        db.session.commit()
        
        result = asiento_contable_schema.dump(asiento)
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Error al aprobar asiento contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
