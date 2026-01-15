from flask import Blueprint, request, jsonify
from models.configuracion_contabilidad import ConfiguracionContabilidad
from schemas.configuracion_contabilidad_schema import ConfiguracionContabilidadSchema, ConfiguracionContabilidadCreateSchema, ConfiguracionContabilidadUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError

configuracion_bp = Blueprint('configuracion_bp', __name__)
configuracion_schema = ConfiguracionContabilidadSchema()
configuracion_create_schema = ConfiguracionContabilidadCreateSchema()
configuracion_update_schema = ConfiguracionContabilidadUpdateSchema()

@configuracion_bp.route('/configuracion-contabilidad', methods=['POST', 'OPTIONS'])
@configuracion_bp.route('/configuracion-contabilidad/', methods=['POST', 'OPTIONS'])
def crear_configuracion():
    """Crear una nueva configuración de contabilidad"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        print(f"📝 Datos recibidos para crear configuración: {data}")
        
        errors = configuracion_create_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        # Verificar si ya existe configuración para esta empresa
        existente = ConfiguracionContabilidad.query.filter_by(empresa_id=data['empresa_id']).first()
        if existente:
            return jsonify({
                'error': 'Ya existe una configuración de contabilidad para esta empresa',
                'field': 'empresa_id',
                'type': 'duplicate'
            }), 409
        
        configuracion = ConfiguracionContabilidad(**data)
        db.session.add(configuracion)
        db.session.commit()
        
        result = configuracion_schema.dump(configuracion)
        return jsonify(result), 201
    except Exception as e:
        print(f"❌ Error al crear configuración: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@configuracion_bp.route('/configuracion-contabilidad/<int:id>', methods=['PUT', 'OPTIONS'])
@configuracion_bp.route('/configuracion-contabilidad/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_configuracion(id):
    """Actualizar configuración de contabilidad"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        configuracion = ConfiguracionContabilidad.query.get(id)
        if not configuracion:
            return jsonify({'error': 'Configuración no encontrada'}), 404
        
        data = request.get_json()
        errors = configuracion_update_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        for key, value in data.items():
            if hasattr(configuracion, key):
                setattr(configuracion, key, value)
        
        db.session.commit()
        result = configuracion_schema.dump(configuracion)
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Error al actualizar configuración: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
