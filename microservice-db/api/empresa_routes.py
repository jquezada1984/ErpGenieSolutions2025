from flask import Blueprint, request, jsonify
from models.empresa import Empresa
from schemas.empresa_schema import EmpresaSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError

empresa_bp = Blueprint('empresa_bp', __name__)
empresa_schema = EmpresaSchema()

@empresa_bp.route('/empresa', methods=['GET', 'OPTIONS'])
@empresa_bp.route('/empresa/', methods=['GET', 'OPTIONS'])
def obtener_empresas():
    """Obtener todas las empresas"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        empresas = Empresa.query.filter_by(estado=True).all()
        return jsonify(empresa_schema.dump(empresas, many=True)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@empresa_bp.route('/empresa/<string:id_empresa>', methods=['GET', 'OPTIONS'])
@empresa_bp.route('/empresa/<string:id_empresa>/', methods=['GET', 'OPTIONS'])
def obtener_empresa(id_empresa):
    """Obtener una empresa específica"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        empresa = Empresa.query.get_or_404(id_empresa)
        return jsonify(empresa_schema.dump(empresa)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@empresa_bp.route('/empresa', methods=['POST', 'OPTIONS'])
@empresa_bp.route('/empresa/', methods=['POST', 'OPTIONS'])
def crear_empresa():
    """Crear una nueva empresa"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        print(f"📝 Datos recibidos para crear empresa: {data}")
        
        # Validar y deserializar
        errors = empresa_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        empresa = Empresa(**data)
        db.session.add(empresa)
        db.session.commit()
        
        result = empresa_schema.dump(empresa)
        print(f"✅ Empresa creada exitosamente: {result}")
        return jsonify(result), 201
    except IntegrityError as e:
        print(f"❌ Error de integridad al crear empresa: {e}")
        db.session.rollback()
        # Detectar si es error de RUC duplicado
        if "ruc" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe una empresa con este RUC',
                'field': 'ruc',
                'type': 'duplicate'
            }), 409
        # Detectar si es error de email duplicado
        elif "email" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe una empresa con este email',
                'field': 'email',
                'type': 'duplicate'
            }), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al crear empresa: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@empresa_bp.route('/empresa/<string:id_empresa>', methods=['PUT', 'OPTIONS'])
@empresa_bp.route('/empresa/<string:id_empresa>/', methods=['PUT', 'OPTIONS'])
def actualizar_empresa(id_empresa):
    """Actualizar una empresa existente"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        print(f"📝 Actualizando empresa {id_empresa} con datos: {data}")
        
        empresa = Empresa.query.get_or_404(id_empresa)
        errors = empresa_schema.validate(data, partial=True)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        for key, value in data.items():
            setattr(empresa, key, value)
        
        db.session.commit()
        result = empresa_schema.dump(empresa)
        print(f"✅ Empresa actualizada exitosamente: {result}")
        return jsonify(result), 200
    except IntegrityError as e:
        print(f"❌ Error de integridad al actualizar empresa: {e}")
        db.session.rollback()
        # Detectar si es error de RUC duplicado
        if "ruc" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe una empresa con este RUC',
                'field': 'ruc',
                'type': 'duplicate'
            }), 409
        # Detectar si es error de email duplicado
        elif "email" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe una empresa con este email',
                'field': 'email',
                'type': 'duplicate'
            }), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al actualizar empresa: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@empresa_bp.route('/empresa/<string:id_empresa>', methods=['DELETE', 'OPTIONS'])
@empresa_bp.route('/empresa/<string:id_empresa>/', methods=['DELETE', 'OPTIONS'])
def eliminar_empresa(id_empresa):
    """Eliminar una empresa (cambiar estado a False)"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        empresa = Empresa.query.get_or_404(id_empresa)
        empresa.estado = False
        db.session.commit()
        return jsonify({'message': 'Empresa eliminada exitosamente'}), 200
    except Exception as e:
        print(f"❌ Error al eliminar empresa: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 