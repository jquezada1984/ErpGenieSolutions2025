from flask import Blueprint, request, jsonify
from models.sucursal import Sucursal
from schemas.sucursal_schema import SucursalSchema
from utils.db import db

sucursal_routes = Blueprint('sucursal_routes', __name__)
sucursal_schema = SucursalSchema()
sucursales_schema = SucursalSchema(many=True)

# SOLO MUTACIONES - Las consultas van por GraphQL a InicioNestJS

@sucursal_routes.route('/sucursales', methods=['POST'])
def create_sucursal():
    """Crear una nueva sucursal"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data.get('nombre'):
            return jsonify({
                'success': False,
                'error': 'El nombre de la sucursal es requerido',
                'message': 'Debe proporcionar un nombre para la sucursal'
            }), 400

        # Crear la sucursal
        nueva_sucursal = Sucursal(
            nombre=data['nombre'],
            direccion=data.get('direccion'),
            telefono=data.get('telefono'),
            codigo_establecimiento=data.get('codigo_establecimiento', ''),
            estado=data.get('estado', True)
        )
        
        db.session.add(nueva_sucursal)
        db.session.commit()
        db.session.refresh(nueva_sucursal)
        
        return jsonify({
            'success': True,
            'data': sucursal_schema.dump(nueva_sucursal),
            'message': 'Sucursal creada exitosamente'
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al crear la sucursal'
        }), 500

@sucursal_routes.route('/sucursales/<sucursal_id>', methods=['PUT'])
def update_sucursal(sucursal_id):
    """Actualizar una sucursal existente"""
    try:
        data = request.get_json()
        
        # Verificar que la sucursal existe
        sucursal_existente = Sucursal.query.filter(Sucursal.id_sucursal == sucursal_id).first()
        if not sucursal_existente:
            return jsonify({
                'success': False,
                'error': 'Sucursal no encontrada',
                'message': 'No se encontró la sucursal especificada'
            }), 404

        # Actualizar campos
        if 'nombre' in data:
            sucursal_existente.nombre = data['nombre']
        if 'direccion' in data:
            sucursal_existente.direccion = data['direccion']
        if 'telefono' in data:
            sucursal_existente.telefono = data['telefono']
        if 'codigo_establecimiento' in data:
            sucursal_existente.codigo_establecimiento = data['codigo_establecimiento']
        if 'estado' in data:
            sucursal_existente.estado = data['estado']
        
        db.session.commit()
        db.session.refresh(sucursal_existente)
        
        return jsonify({
            'success': True,
            'data': sucursal_schema.dump(sucursal_existente),
            'message': 'Sucursal actualizada exitosamente'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al actualizar la sucursal'
        }), 500

@sucursal_routes.route('/sucursales/<sucursal_id>', methods=['DELETE'])
def delete_sucursal(sucursal_id):
    """Eliminar una sucursal"""
    try:
        # Verificar que la sucursal existe
        sucursal_existente = Sucursal.query.filter(Sucursal.id_sucursal == sucursal_id).first()
        if not sucursal_existente:
            return jsonify({
                'success': False,
                'error': 'Sucursal no encontrada',
                'message': 'No se encontró la sucursal especificada'
            }), 404

        # Eliminar la sucursal
        db.session.delete(sucursal_existente)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Sucursal eliminada exitosamente'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al eliminar la sucursal'
        }), 500

@sucursal_routes.route('/sucursales/<sucursal_id>/estado', methods=['PUT'])
def cambiar_estado_sucursal(sucursal_id):
    """Cambiar el estado de una sucursal"""
    try:
        data = request.get_json()
        nuevo_estado = data.get('estado')
        
        if nuevo_estado is None:
            return jsonify({
                'success': False,
                'error': 'El estado es requerido',
                'message': 'Debe proporcionar el nuevo estado de la sucursal'
            }), 400

        # Verificar que la sucursal existe
        sucursal_existente = Sucursal.query.filter(Sucursal.id_sucursal == sucursal_id).first()
        if not sucursal_existente:
            return jsonify({
                'success': False,
                'error': 'Sucursal no encontrada',
                'message': 'No se encontró la sucursal especificada'
            }), 404

        # Cambiar el estado de la sucursal
        sucursal_existente.estado = nuevo_estado
        db.session.commit()
        db.session.refresh(sucursal_existente)
        
        return jsonify({
            'success': True,
            'data': sucursal_schema.dump(sucursal_existente),
            'message': f'Estado de la sucursal cambiado a {"activo" if nuevo_estado else "inactivo"}'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al cambiar el estado de la sucursal'
        }), 500 