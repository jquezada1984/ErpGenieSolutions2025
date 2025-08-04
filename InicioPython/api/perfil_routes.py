from flask import Blueprint, request, jsonify
from models.perfil import Perfil
from schemas.perfil_schema import PerfilSchema
from services.perfil_service import PerfilService

perfil_routes = Blueprint('perfil_routes', __name__)
perfil_schema = PerfilSchema()
perfiles_schema = PerfilSchema(many=True)
perfil_service = PerfilService()

@perfil_routes.route('/perfiles', methods=['GET'])
def get_perfiles():
    """Obtener todos los perfiles"""
    try:
        perfiles = perfil_service.get_all_perfiles()
        return jsonify({
            'success': True,
            'data': perfiles_schema.dump(perfiles),
            'message': f'Se encontraron {len(perfiles)} perfiles'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al obtener perfiles'
        }), 500

@perfil_routes.route('/perfiles/<perfil_id>', methods=['GET'])
def get_perfil(perfil_id):
    """Obtener un perfil específico por ID"""
    try:
        perfil = perfil_service.get_perfil_by_id(perfil_id)
        if perfil:
            return jsonify({
                'success': True,
                'data': perfil_schema.dump(perfil),
                'message': 'Perfil encontrado'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Perfil no encontrado',
                'message': 'No se encontró el perfil especificado'
            }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al obtener el perfil'
        }), 500

@perfil_routes.route('/perfiles', methods=['POST'])
def create_perfil():
    """Crear un nuevo perfil"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data.get('nombre'):
            return jsonify({
                'success': False,
                'error': 'El nombre del perfil es requerido',
                'message': 'Debe proporcionar un nombre para el perfil'
            }), 400
        
        if not data.get('id_empresa'):
            return jsonify({
                'success': False,
                'error': 'La empresa es requerida',
                'message': 'Debe seleccionar una empresa para el perfil'
            }), 400

        # Crear el perfil
        nuevo_perfil = perfil_service.create_perfil(data)
        
        return jsonify({
            'success': True,
            'data': perfil_schema.dump(nuevo_perfil),
            'message': 'Perfil creado exitosamente'
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al crear el perfil'
        }), 500

@perfil_routes.route('/perfiles/<perfil_id>', methods=['PUT'])
def update_perfil(perfil_id):
    """Actualizar un perfil existente"""
    try:
        data = request.get_json()
        
        # Verificar que el perfil existe
        perfil_existente = perfil_service.get_perfil_by_id(perfil_id)
        if not perfil_existente:
            return jsonify({
                'success': False,
                'error': 'Perfil no encontrado',
                'message': 'No se encontró el perfil especificado'
            }), 404

        # Actualizar el perfil
        perfil_actualizado = perfil_service.update_perfil(perfil_id, data)
        
        return jsonify({
            'success': True,
            'data': perfil_schema.dump(perfil_actualizado),
            'message': 'Perfil actualizado exitosamente'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al actualizar el perfil'
        }), 500

@perfil_routes.route('/perfiles/<perfil_id>', methods=['DELETE'])
def delete_perfil(perfil_id):
    """Eliminar un perfil"""
    try:
        # Verificar que el perfil existe
        perfil_existente = perfil_service.get_perfil_by_id(perfil_id)
        if not perfil_existente:
            return jsonify({
                'success': False,
                'error': 'Perfil no encontrado',
                'message': 'No se encontró el perfil especificado'
            }), 404

        # Eliminar el perfil
        perfil_service.delete_perfil(perfil_id)
        
        return jsonify({
            'success': True,
            'message': 'Perfil eliminado exitosamente'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al eliminar el perfil'
        }), 500

@perfil_routes.route('/perfiles/<perfil_id>/estado', methods=['PUT'])
def cambiar_estado_perfil(perfil_id):
    """Cambiar el estado de un perfil"""
    try:
        data = request.get_json()
        nuevo_estado = data.get('estado')
        
        if nuevo_estado is None:
            return jsonify({
                'success': False,
                'error': 'El estado es requerido',
                'message': 'Debe proporcionar el nuevo estado del perfil'
            }), 400

        # Verificar que el perfil existe
        perfil_existente = perfil_service.get_perfil_by_id(perfil_id)
        if not perfil_existente:
            return jsonify({
                'success': False,
                'error': 'Perfil no encontrado',
                'message': 'No se encontró el perfil especificado'
            }), 404

        # Cambiar el estado del perfil
        perfil_actualizado = perfil_service.cambiar_estado_perfil(perfil_id, nuevo_estado)
        
        return jsonify({
            'success': True,
            'data': perfil_schema.dump(perfil_actualizado),
            'message': f'Estado del perfil cambiado a {"activo" if nuevo_estado else "inactivo"}'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al cambiar el estado del perfil'
        }), 500

@perfil_routes.route('/empresas/<empresa_id>/perfiles', methods=['GET'])
def get_perfiles_por_empresa(empresa_id):
    """Obtener perfiles por empresa"""
    try:
        perfiles = perfil_service.get_perfiles_por_empresa(empresa_id)
        return jsonify({
            'success': True,
            'data': perfiles_schema.dump(perfiles),
            'message': f'Se encontraron {len(perfiles)} perfiles para la empresa'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al obtener perfiles por empresa'
        }), 500 