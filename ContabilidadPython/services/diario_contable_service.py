from datetime import datetime
from typing import Dict, Any, List
from marshmallow import ValidationError
from sqlalchemy import text
from utils.db import db
from models.diario_contable import DiarioContable
from constants.diarios_defecto import DIARIOS_DEFECTO
from schemas.diario_contable_schema import (
    DiarioContableCrearSchema,
    DiarioContableActualizarSchema,
    DiarioContableOutSchema,
)


def inicializar_diarios_defecto(id_empresa: str) -> List[Dict[str, Any]]:
    """Crea los 7 diarios estándar si la empresa aún no los tiene."""
    creados: List[Dict[str, Any]] = []
    for item in DIARIOS_DEFECTO:
        exists = DiarioContable.query.filter_by(
            id_empresa=id_empresa,
            codigo=item['codigo'],
        ).first()
        if exists:
            continue
        row = DiarioContable(
            id_empresa=id_empresa,
            codigo=item['codigo'],
            nombre=item['nombre'],
            tipo_diario=item['tipo_diario'],
            estado=True,
        )
        db.session.add(row)
        creados.append(row)
    if creados:
        db.session.commit()
    return DiarioContableOutSchema(many=True).dump(creados)


def crear_diario_contable(id_empresa: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    data = DiarioContableCrearSchema().load(payload or {})
    exists = DiarioContable.query.filter_by(id_empresa=id_empresa, codigo=data['codigo']).first()
    if exists:
        raise ValidationError({'codigo': ['Código ya existe para esta empresa']})

    row = DiarioContable(id_empresa=id_empresa, **data)
    db.session.add(row)
    db.session.commit()
    return DiarioContableOutSchema().dump(row)


def actualizar_diario_contable(id_empresa: str, id_diario: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    data = DiarioContableActualizarSchema().load(payload or {})
    row = DiarioContable.query.filter_by(id_diario_contable=id_diario, id_empresa=id_empresa).first()
    if not row:
        raise ValidationError({'id': ['Diario no encontrado']})

    if 'codigo' in data and data['codigo'] != row.codigo:
        asientos = db.session.execute(
            text('SELECT COUNT(*) FROM asiento_contable WHERE id_diario_contable = :id'),
            {'id': id_diario},
        ).scalar()
        if asientos and int(asientos) > 0:
            raise ValidationError({'codigo': ['No se puede cambiar el código con asientos asociados']})
        dup = DiarioContable.query.filter_by(id_empresa=id_empresa, codigo=data['codigo']).first()
        if dup and dup.id_diario_contable != id_diario:
            raise ValidationError({'codigo': ['Código ya existe']})

    for key, value in data.items():
        setattr(row, key, value)
    row.updated_at = datetime.utcnow()
    db.session.commit()
    return DiarioContableOutSchema().dump(row)


def patch_activo_diario(id_empresa: str, id_diario: str, activo: bool) -> Dict[str, Any]:
    row = DiarioContable.query.filter_by(id_diario_contable=id_diario, id_empresa=id_empresa).first()
    if not row:
        raise ValidationError({'id': ['Diario no encontrado']})
    row.estado = bool(activo)
    row.updated_at = datetime.utcnow()
    db.session.commit()
    return DiarioContableOutSchema().dump(row)


def eliminar_diario_contable(id_empresa: str, id_diario: str) -> None:
    row = DiarioContable.query.filter_by(id_diario_contable=id_diario, id_empresa=id_empresa).first()
    if not row:
        raise ValidationError({'id': ['Diario no encontrado']})
    asientos = db.session.execute(
        text('SELECT COUNT(*) FROM asiento_contable WHERE id_diario_contable = :id'),
        {'id': id_diario},
    ).scalar()
    if asientos and int(asientos) > 0:
        raise ValidationError({'id': ['No se puede eliminar: tiene asientos asociados']})
    db.session.delete(row)
    db.session.commit()
