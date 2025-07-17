from flask import Blueprint, request, jsonify
from services.entidad_service import EntidadService
from schemas.entidad_schema import EntidadSchema

entidad_bp = Blueprint('entidad_bp', __name__)
entidad_schema = EntidadSchema()

@entidad_bp.route('/entidad', methods=['POST'])
def crear_entidad():
    data = request.get_json()
    entidad = EntidadService.crear_entidad(data)
    return entidad_schema.jsonify(entidad), 201

@entidad_bp.route('/entidad/<int:id>', methods=['PUT'])
def actualizar_entidad(id):
    data = request.get_json()
    entidad = EntidadService.actualizar_entidad(id, data)
    if entidad:
        return entidad_schema.jsonify(entidad), 200
    return jsonify({'error': 'Entidad no encontrada'}), 404 