from flask import Blueprint, request, jsonify
from models.periodo_contable import PeriodoContable
from schemas.periodo_contable_schema import PeriodoContableSchema, PeriodoContableCreateSchema, PeriodoContableUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError
from datetime import datetime

periodo_contable_bp = Blueprint('periodo_contable_bp', __name__)
periodo_contable_schema = PeriodoContableSchema()
periodo_contable_create_schema = PeriodoContableCreateSchema()
periodo_contable_update_schema = PeriodoContableUpdateSchema()

@periodo_contable_bp.route('/periodo-contable', methods=['POST', 'OPTIONS'])
@periodo_contable_bp.route('/periodo-contable/', methods=['POST', 'OPTIONS'])
def crear_periodo_contable():
    """Crear un nuevo período contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        print(f"📝 Datos recibidos para crear período contable: {data}")
        
        # Validar y deserializar
        errors = periodo_contable_create_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Crear período contable
        periodo = PeriodoContable(**data)
        db.session.add(periodo)
        db.session.commit()
        
        result = periodo_contable_schema.dump(periodo)
        print(f"✅ Período contable creado exitosamente: {result}")
        return jsonify(result), 201
    except IntegrityError as e:
        print(f"❌ Error de integridad al crear período contable: {e}")
        db.session.rollback()
        if "año" in str(e).lower() and "mes" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe un período contable para este año y mes en esta empresa',
                'field': 'año,mes',
                'type': 'duplicate'
            }), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al crear período contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@periodo_contable_bp.route('/periodo-contable/<int:id>', methods=['PUT', 'OPTIONS'])
@periodo_contable_bp.route('/periodo-contable/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_periodo_contable(id):
    """Actualizar un período contable existente"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        periodo = PeriodoContable.query.get(id)
        if not periodo:
            return jsonify({'error': 'Período contable no encontrado'}), 404
        
        data = request.get_json()
        print(f"📝 Datos recibidos para actualizar período contable {id}: {data}")
        
        # Validar y deserializar
        errors = periodo_contable_update_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Actualizar campos
        for key, value in data.items():
            if hasattr(periodo, key):
                setattr(periodo, key, value)
        
        db.session.commit()
        
        result = periodo_contable_schema.dump(periodo)
        print(f"✅ Período contable actualizado exitosamente: {result}")
        return jsonify(result), 200
    except IntegrityError as e:
        print(f"❌ Error de integridad al actualizar período contable: {e}")
        db.session.rollback()
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al actualizar período contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@periodo_contable_bp.route('/periodo-contable/<int:id>/cerrar', methods=['POST', 'OPTIONS'])
@periodo_contable_bp.route('/periodo-contable/<int:id>/cerrar/', methods=['POST', 'OPTIONS'])
def cerrar_periodo_contable(id):
    """Cerrar un período contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        periodo = PeriodoContable.query.get(id)
        if not periodo:
            return jsonify({'error': 'Período contable no encontrado'}), 404
        
        data = request.get_json() or {}
        usuario_cierre_id = data.get('usuario_cierre_id')
        
        periodo.estado = 'CERRADO'
        periodo.fecha_cierre = datetime.now()
        if usuario_cierre_id:
            periodo.usuario_cierre_id = usuario_cierre_id
        
        db.session.commit()
        
        result = periodo_contable_schema.dump(periodo)
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Error al cerrar período contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@periodo_contable_bp.route('/periodo-contable/<int:id>/bloquear', methods=['POST', 'OPTIONS'])
@periodo_contable_bp.route('/periodo-contable/<int:id>/bloquear/', methods=['POST', 'OPTIONS'])
def bloquear_periodo_contable(id):
    """Bloquear un período contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        periodo = PeriodoContable.query.get(id)
        if not periodo:
            return jsonify({'error': 'Período contable no encontrado'}), 404
        
        periodo.estado = 'BLOQUEADO'
        db.session.commit()
        
        result = periodo_contable_schema.dump(periodo)
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Error al bloquear período contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
