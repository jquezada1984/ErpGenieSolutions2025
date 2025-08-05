from flask import Blueprint, request, jsonify
from models.menu import MenuSeccion, MenuItem
from schemas.menu_schema import MenuSeccionSchema, MenuItemSchema
from utils.db import db

menu_routes = Blueprint('menu_routes', __name__)
menu_seccion_schema = MenuSeccionSchema()
menu_secciones_schema = MenuSeccionSchema(many=True)
menu_item_schema = MenuItemSchema()
menu_items_schema = MenuItemSchema(many=True)

# SOLO MUTACIONES - Las consultas van por GraphQL a InicioNestJS

@menu_routes.route('/menu-secciones', methods=['POST'])
def create_menu_seccion():
    """Crear una nueva sección de menú"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data.get('nombre'):
            return jsonify({
                'success': False,
                'error': 'El nombre de la sección es requerido',
                'message': 'Debe proporcionar un nombre para la sección'
            }), 400

        # Verificar que el nombre no esté duplicado
        seccion_existente = MenuSeccion.query.filter(MenuSeccion.nombre == data['nombre']).first()
        if seccion_existente:
            return jsonify({
                'success': False,
                'error': 'Ya existe una sección con ese nombre',
                'message': 'El nombre de la sección ya está en uso'
            }), 400

        # Crear la sección
        nueva_seccion = MenuSeccion(
            nombre=data['nombre'],
            orden=data.get('orden', 0),
            icono=data.get('icono')
        )
        
        db.session.add(nueva_seccion)
        db.session.commit()
        db.session.refresh(nueva_seccion)
        
        return jsonify({
            'success': True,
            'data': menu_seccion_schema.dump(nueva_seccion),
            'message': 'Sección creada exitosamente'
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al crear la sección'
        }), 500

@menu_routes.route('/menu-secciones/<seccion_id>', methods=['PUT'])
def update_menu_seccion(seccion_id):
    """Actualizar una sección existente"""
    try:
        data = request.get_json()
        
        # Verificar que la sección existe
        seccion_existente = MenuSeccion.query.filter(MenuSeccion.id_seccion == seccion_id).first()
        if not seccion_existente:
            return jsonify({
                'success': False,
                'error': 'Sección no encontrada',
                'message': 'No se encontró la sección especificada'
            }), 404

        # Verificar que el nombre no esté duplicado (si se está cambiando)
        if 'nombre' in data and data['nombre'] != seccion_existente.nombre:
            seccion_duplicada = MenuSeccion.query.filter(
                MenuSeccion.nombre == data['nombre'],
                MenuSeccion.id_seccion != seccion_id
            ).first()
            if seccion_duplicada:
                return jsonify({
                    'success': False,
                    'error': 'Ya existe una sección con ese nombre',
                    'message': 'El nombre de la sección ya está en uso'
                }), 400

        # Actualizar campos
        if 'nombre' in data:
            seccion_existente.nombre = data['nombre']
        if 'orden' in data:
            seccion_existente.orden = data['orden']
        if 'icono' in data:
            seccion_existente.icono = data['icono']
        
        db.session.commit()
        db.session.refresh(seccion_existente)
        
        return jsonify({
            'success': True,
            'data': menu_seccion_schema.dump(seccion_existente),
            'message': 'Sección actualizada exitosamente'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al actualizar la sección'
        }), 500

@menu_routes.route('/menu-secciones/<seccion_id>', methods=['DELETE'])
def delete_menu_seccion(seccion_id):
    """Eliminar una sección"""
    try:
        # Verificar que la sección existe
        seccion_existente = MenuSeccion.query.filter(MenuSeccion.id_seccion == seccion_id).first()
        if not seccion_existente:
            return jsonify({
                'success': False,
                'error': 'Sección no encontrada',
                'message': 'No se encontró la sección especificada'
            }), 404

        # Verificar si hay items asociados
        items_asociados = MenuItem.query.filter(MenuItem.id_seccion == seccion_id).count()
        if items_asociados > 0:
            return jsonify({
                'success': False,
                'error': 'No se puede eliminar la sección',
                'message': f'La sección tiene {items_asociados} items asociados. Elimine los items primero.'
            }), 400

        # Eliminar la sección
        db.session.delete(seccion_existente)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Sección eliminada exitosamente'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al eliminar la sección'
        }), 500

# Rutas para items de menú - SOLO MUTACIONES

@menu_routes.route('/menu-items', methods=['POST'])
def create_menu_item():
    """Crear un nuevo item de menú"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data.get('etiqueta'):
            return jsonify({
                'success': False,
                'error': 'La etiqueta del item es requerida',
                'message': 'Debe proporcionar una etiqueta para el item'
            }), 400
        
        if not data.get('id_seccion'):
            return jsonify({
                'success': False,
                'error': 'La sección es requerida',
                'message': 'Debe seleccionar una sección para el item'
            }), 400

        # Verificar que la sección existe
        seccion = MenuSeccion.query.filter(MenuSeccion.id_seccion == data['id_seccion']).first()
        if not seccion:
            return jsonify({
                'success': False,
                'error': 'La sección especificada no existe',
                'message': 'Seleccione una sección válida'
            }), 400

        # Crear el item
        nuevo_item = MenuItem(
            id_seccion=data['id_seccion'],
            parent_id=data.get('parent_id'),
            etiqueta=data['etiqueta'],
            icono=data.get('icono'),
            ruta=data.get('ruta'),
            es_clickable=data.get('es_clickable', True),
            orden=data.get('orden', 0),
            muestra_badge=data.get('muestra_badge', False),
            badge_text=data.get('badge_text'),
            estado=data.get('estado', True)
        )
        
        db.session.add(nuevo_item)
        db.session.commit()
        db.session.refresh(nuevo_item)
        
        return jsonify({
            'success': True,
            'data': menu_item_schema.dump(nuevo_item),
            'message': 'Item creado exitosamente'
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al crear el item'
        }), 500

@menu_routes.route('/menu-items/<item_id>', methods=['PUT'])
def update_menu_item(item_id):
    """Actualizar un item existente"""
    try:
        data = request.get_json()
        
        # Verificar que el item existe
        item_existente = MenuItem.query.filter(MenuItem.id_item == item_id).first()
        if not item_existente:
            return jsonify({
                'success': False,
                'error': 'Item no encontrado',
                'message': 'No se encontró el item especificado'
            }), 404

        # Actualizar campos
        if 'etiqueta' in data:
            item_existente.etiqueta = data['etiqueta']
        if 'id_seccion' in data:
            item_existente.id_seccion = data['id_seccion']
        if 'parent_id' in data:
            item_existente.parent_id = data['parent_id']
        if 'icono' in data:
            item_existente.icono = data['icono']
        if 'ruta' in data:
            item_existente.ruta = data['ruta']
        if 'es_clickable' in data:
            item_existente.es_clickable = data['es_clickable']
        if 'orden' in data:
            item_existente.orden = data['orden']
        if 'muestra_badge' in data:
            item_existente.muestra_badge = data['muestra_badge']
        if 'badge_text' in data:
            item_existente.badge_text = data['badge_text']
        if 'estado' in data:
            item_existente.estado = data['estado']
        
        db.session.commit()
        db.session.refresh(item_existente)
        
        return jsonify({
            'success': True,
            'data': menu_item_schema.dump(item_existente),
            'message': 'Item actualizado exitosamente'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al actualizar el item'
        }), 500

@menu_routes.route('/menu-items/<item_id>', methods=['DELETE'])
def delete_menu_item(item_id):
    """Eliminar un item"""
    try:
        # Verificar que el item existe
        item_existente = MenuItem.query.filter(MenuItem.id_item == item_id).first()
        if not item_existente:
            return jsonify({
                'success': False,
                'error': 'Item no encontrado',
                'message': 'No se encontró el item especificado'
            }), 404

        # Verificar si hay items hijos
        items_hijos = MenuItem.query.filter(MenuItem.parent_id == item_id).count()
        if items_hijos > 0:
            return jsonify({
                'success': False,
                'error': 'No se puede eliminar el item',
                'message': f'El item tiene {items_hijos} sub-items. Elimine los sub-items primero.'
            }), 400

        # Eliminar el item
        db.session.delete(item_existente)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Item eliminado exitosamente'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al eliminar el item'
        }), 500

# SOLO MUTACIONES - Las consultas van por GraphQL a InicioNestJS 