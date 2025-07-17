from flask import Blueprint, request, jsonify
from models.empresa import Empresa
from schemas.empresa_schema import EmpresaSchema
from utils.db import db

empresa_bp = Blueprint('empresa_bp', __name__)
empresa_schema = EmpresaSchema()

@empresa_bp.route('/empresa', methods=['POST'])
def crear_empresa():
    data = request.get_json()
    # Validar y deserializar
    errors = empresa_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    empresa = Empresa(**data)
    db.session.add(empresa)
    db.session.commit()
    return jsonify(empresa_schema.dump(empresa)), 201

@empresa_bp.route('/empresa/<int:id_empresa>', methods=['PUT'])
def actualizar_empresa(id_empresa):
    data = request.get_json()
    empresa = Empresa.query.get_or_404(id_empresa)
    errors = empresa_schema.validate(data, partial=True)
    if errors:
        return jsonify(errors), 400
    for key, value in data.items():
        setattr(empresa, key, value)
    db.session.commit()
    return jsonify(empresa_schema.dump(empresa)), 200 