from flask import Blueprint, request, jsonify
from models.plan_contable import PlanContable
from schemas.plan_contable_schema import PlanContableSchema, PlanContableCreateSchema, PlanContableUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError

plan_bp = Blueprint('plan_contable_bp', __name__)
plan_schema = PlanContableSchema()
plan_create_schema = PlanContableCreateSchema()
plan_update_schema = PlanContableUpdateSchema()

@plan_bp.route('/plan-contable', methods=['POST', 'OPTIONS'])
@plan_bp.route('/plan-contable/', methods=['POST', 'OPTIONS'])
def crear_plan():
    """Crear un nuevo plan contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        errors = plan_create_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        plan = PlanContable(**data)
        db.session.add(plan)
        db.session.commit()
        
        result = plan_schema.dump(plan)
        return jsonify(result), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@plan_bp.route('/plan-contable/<int:id>', methods=['PUT', 'OPTIONS'])
@plan_bp.route('/plan-contable/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_plan(id):
    """Actualizar plan contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        plan = PlanContable.query.get(id)
        if not plan:
            return jsonify({'error': 'Plan contable no encontrado'}), 404
        
        data = request.get_json()
        errors = plan_update_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        for key, value in data.items():
            if hasattr(plan, key):
                setattr(plan, key, value)
        
        db.session.commit()
        result = plan_schema.dump(plan)
        return jsonify(result), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@plan_bp.route('/plan-contable/<int:id>', methods=['DELETE', 'OPTIONS'])
@plan_bp.route('/plan-contable/<int:id>/', methods=['DELETE', 'OPTIONS'])
def eliminar_plan(id):
    """Desactivar plan contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        plan = PlanContable.query.get(id)
        if not plan:
            return jsonify({'error': 'Plan contable no encontrado'}), 404
        
        plan.estado = False
        db.session.commit()
        return jsonify({'message': 'Plan contable desactivado exitosamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
