from datetime import datetime
from typing import Dict, Any
from marshmallow import ValidationError
from sqlalchemy import text
from utils.db import db
from models.modelo_plan_contable import ModeloPlanContable
from schemas.modelo_plan_contable_schema import (
    ModeloPlanContableCrearSchema,
    ModeloPlanContableActualizarSchema,
    ModeloPlanContableOutSchema,
)


def crear_modelo_plan_contable(payload: Dict[str, Any]) -> Dict[str, Any]:
    data = ModeloPlanContableCrearSchema().load(payload or {})
    if ModeloPlanContable.query.filter_by(codigo=data['codigo']).first():
        raise ValidationError({'codigo': ['Código ya existe']})
    row = ModeloPlanContable(
        codigo=data['codigo'],
        nombre=data['nombre'],
        descripcion=data.get('descripcion'),
        id_pais=str(data['id_pais']),
        estado=True,
    )
    db.session.add(row)
    db.session.commit()
    return ModeloPlanContableOutSchema().dump(row)


def actualizar_modelo_plan_contable(id_modelo: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    data = ModeloPlanContableActualizarSchema().load(payload or {})
    row = ModeloPlanContable.query.filter_by(id_modelo_plan_contable=id_modelo).first()
    if not row:
        raise ValidationError({'id': ['Modelo no encontrado']})
    if 'codigo' in data and data['codigo'] != row.codigo:
        dup = ModeloPlanContable.query.filter_by(codigo=data['codigo']).first()
        if dup:
            raise ValidationError({'codigo': ['Código ya existe']})
    for key, value in data.items():
        setattr(row, key, str(value) if key == 'id_pais' and value is not None else value)
    row.updated_at = datetime.utcnow()
    db.session.commit()
    return ModeloPlanContableOutSchema().dump(row)


def patch_activo_modelo(id_modelo: str, activo: bool) -> Dict[str, Any]:
    row = ModeloPlanContable.query.filter_by(id_modelo_plan_contable=id_modelo).first()
    if not row:
        raise ValidationError({'id': ['Modelo no encontrado']})
    row.estado = bool(activo)
    row.updated_at = datetime.utcnow()
    db.session.commit()
    return ModeloPlanContableOutSchema().dump(row)


def eliminar_modelo_plan_contable(id_modelo: str) -> None:
    row = ModeloPlanContable.query.filter_by(id_modelo_plan_contable=id_modelo).first()
    if not row:
        raise ValidationError({'id': ['Modelo no encontrado']})
    planes = db.session.execute(
        text('SELECT COUNT(*) FROM plan_contable WHERE id_modelo_plan_contable = :id'),
        {'id': id_modelo},
    ).scalar()
    if planes and int(planes) > 0:
        cuentas = db.session.execute(
            text(
                """SELECT COUNT(*) FROM cuenta_contable cc
                   INNER JOIN plan_contable pc ON pc.id_plan_contable = cc.id_plan_contable
                   WHERE pc.id_modelo_plan_contable = :id"""
            ),
            {'id': id_modelo},
        ).scalar()
        if cuentas and int(cuentas) > 0:
            raise ValidationError({'id': ['No se puede eliminar: tiene cuentas asociadas']})
    db.session.delete(row)
    db.session.commit()
