from datetime import datetime
from typing import Dict, Any
from marshmallow import ValidationError
from sqlalchemy import text
from utils.db import db
from models.cuenta_contable import CuentaContable
from schemas.cuenta_contable_schema import (
    CuentaContableCrearSchema,
    CuentaContableActualizarSchema,
    CuentaContableOutSchema,
)


def _calcular_nivel(id_plan: str, id_padre: str | None) -> int:
    if not id_padre:
        return 1
    padre = CuentaContable.query.filter_by(
        id_cuenta_contable=id_padre,
        id_plan_contable=id_plan,
    ).first()
    if not padre:
        raise ValidationError({'id_cuenta_padre': ['Cuenta padre no encontrada en el plan']})
    return (padre.nivel or 1) + 1


def crear_cuenta_contable(payload: Dict[str, Any]) -> Dict[str, Any]:
    data = CuentaContableCrearSchema().load(payload or {})
    id_plan = str(data['id_plan_contable'])
    codigo = data['codigo']
    dup = CuentaContable.query.filter_by(id_plan_contable=id_plan, codigo=codigo).first()
    if dup:
        raise ValidationError({'codigo': ['Código ya existe en el plan']})

    id_padre = str(data['id_cuenta_padre']) if data.get('id_cuenta_padre') else None
    nivel = _calcular_nivel(id_plan, id_padre)

    row = CuentaContable(
        id_plan_contable=id_plan,
        codigo=codigo,
        nombre=data['nombre'],
        descripcion=data.get('descripcion'),
        tipo_cuenta=data['tipo_cuenta'],
        nivel=nivel,
        id_cuenta_padre=id_padre,
        permite_movimientos=data.get('permite_movimientos', True),
        estado=True,
    )
    db.session.add(row)
    db.session.commit()
    return CuentaContableOutSchema().dump(row)


def actualizar_cuenta_contable(id_cuenta: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    data = CuentaContableActualizarSchema().load(payload or {})
    row = CuentaContable.query.filter_by(id_cuenta_contable=id_cuenta).first()
    if not row:
        raise ValidationError({'id': ['Cuenta no encontrada']})
    for key, value in data.items():
        setattr(row, key, value)
    row.updated_at = datetime.utcnow()
    db.session.commit()
    return CuentaContableOutSchema().dump(row)


def patch_activo_cuenta(id_cuenta: str, activo: bool) -> Dict[str, Any]:
    row = CuentaContable.query.filter_by(id_cuenta_contable=id_cuenta).first()
    if not row:
        raise ValidationError({'id': ['Cuenta no encontrada']})
    row.estado = bool(activo)
    row.updated_at = datetime.utcnow()
    db.session.commit()
    return CuentaContableOutSchema().dump(row)


def eliminar_cuenta_contable(id_cuenta: str) -> None:
    row = CuentaContable.query.filter_by(id_cuenta_contable=id_cuenta).first()
    if not row:
        raise ValidationError({'id': ['Cuenta no encontrada']})

    hijos = CuentaContable.query.filter_by(id_cuenta_padre=id_cuenta).count()
    if hijos > 0:
        raise ValidationError({'id': ['No se puede eliminar: tiene subcuentas']})

    movs = db.session.execute(
        text('SELECT COUNT(*) FROM movimiento_contable WHERE id_cuenta_contable = :id'),
        {'id': id_cuenta},
    ).scalar()
    if movs and int(movs) > 0:
        raise ValidationError({'id': ['No se puede eliminar: tiene movimientos']})

    db.session.delete(row)
    db.session.commit()
