from flask import Blueprint, request, jsonify
from models.cuenta_contable import CuentaContable
from schemas.cuenta_contable_schema import CuentaContableSchema, CuentaContableCreateSchema, CuentaContableUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError

cuenta_contable_bp = Blueprint('cuenta_contable_bp', __name__)
cuenta_contable_schema = CuentaContableSchema()
cuenta_contable_create_schema = CuentaContableCreateSchema()
cuenta_contable_update_schema = CuentaContableUpdateSchema()

@cuenta_contable_bp.route('/cuenta-contable', methods=['POST', 'OPTIONS'])
@cuenta_contable_bp.route('/cuenta-contable/', methods=['POST', 'OPTIONS'])
def crear_cuenta_contable():
    """Crear una nueva cuenta contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        print(f"📝 Datos recibidos para crear cuenta contable: {data}")
        
        # Validar y deserializar
        errors = cuenta_contable_create_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Crear cuenta contable
        cuenta = CuentaContable(**data)
        db.session.add(cuenta)
        db.session.commit()
        
        result = cuenta_contable_schema.dump(cuenta)
        print(f"✅ Cuenta contable creada exitosamente: {result}")
        return jsonify(result), 201
    except IntegrityError as e:
        print(f"❌ Error de integridad al crear cuenta contable: {e}")
        db.session.rollback()
        if "codigo" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe una cuenta contable con este código',
                'field': 'codigo',
                'type': 'duplicate'
            }), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al crear cuenta contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cuenta_contable_bp.route('/cuenta-contable/<int:id>', methods=['PUT', 'OPTIONS'])
@cuenta_contable_bp.route('/cuenta-contable/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_cuenta_contable(id):
    """Actualizar una cuenta contable existente"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        cuenta = CuentaContable.query.get(id)
        if not cuenta:
            return jsonify({'error': 'Cuenta contable no encontrada'}), 404
        
        data = request.get_json()
        print(f"📝 Datos recibidos para actualizar cuenta contable {id}: {data}")
        
        # Validar y deserializar
        errors = cuenta_contable_update_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Actualizar campos
        for key, value in data.items():
            if hasattr(cuenta, key):
                setattr(cuenta, key, value)
        
        db.session.commit()
        
        result = cuenta_contable_schema.dump(cuenta)
        print(f"✅ Cuenta contable actualizada exitosamente: {result}")
        return jsonify(result), 200
    except IntegrityError as e:
        print(f"❌ Error de integridad al actualizar cuenta contable: {e}")
        db.session.rollback()
        if "codigo" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe una cuenta contable con este código',
                'field': 'codigo',
                'type': 'duplicate'
            }), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al actualizar cuenta contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cuenta_contable_bp.route('/cuenta-contable/<int:id>', methods=['DELETE', 'OPTIONS'])
@cuenta_contable_bp.route('/cuenta-contable/<int:id>/', methods=['DELETE', 'OPTIONS'])
def eliminar_cuenta_contable(id):
    """Eliminar una cuenta contable (desactivar)"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        cuenta = CuentaContable.query.get(id)
        if not cuenta:
            return jsonify({'error': 'Cuenta contable no encontrada'}), 404
        
        cuenta.activa = False
        db.session.commit()
        return jsonify({'message': 'Cuenta contable desactivada exitosamente'}), 200
    except Exception as e:
        print(f"❌ Error al eliminar cuenta contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
