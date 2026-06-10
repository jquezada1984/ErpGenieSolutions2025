from datetime import datetime
from typing import Dict, Any, List
from marshmallow import ValidationError
from sqlalchemy import text
from utils.db import db
from models.cuenta_contable_defecto import CuentaContableDefecto
from constants.cuentas_defecto import CUENTAS_DEFECTO_CATALOGO

TIPOS_VALIDOS = {c['tipo_operacion'] for c in CUENTAS_DEFECTO_CATALOGO}


def _plan_activo_id(id_empresa: str) -> str | None:
    row = db.session.execute(
        text(
            """SELECT id_plan_contable FROM plan_contable
               WHERE id_empresa = :emp AND estado = true
               ORDER BY created_at DESC LIMIT 1"""
        ),
        {'emp': id_empresa},
    ).fetchone()
    return str(row[0]) if row else None


def _cuenta_en_plan(id_plan: str, id_cuenta: str) -> bool:
    row = db.session.execute(
        text(
            """SELECT 1 FROM cuenta_contable
               WHERE id_plan_contable = :plan AND id_cuenta_contable = :cuenta"""
        ),
        {'plan': id_plan, 'cuenta': id_cuenta},
    ).fetchone()
    return row is not None


def inicializar_cuentas_defecto(id_empresa: str) -> List[Dict[str, Any]]:
    id_plan = _plan_activo_id(id_empresa)
    if not id_plan:
        raise ValidationError({'plan': ['La empresa no tiene plan contable activo']})

    creados = []
    for item in CUENTAS_DEFECTO_CATALOGO:
        exists = CuentaContableDefecto.query.filter_by(
            id_empresa=id_empresa,
            tipo_operacion=item['tipo_operacion'],
        ).first()
        if exists:
            continue

        cuenta = db.session.execute(
            text(
                """SELECT id_cuenta_contable FROM cuenta_contable
                   WHERE id_plan_contable = :plan AND codigo = :codigo LIMIT 1"""
            ),
            {'plan': id_plan, 'codigo': item['codigo_cuenta']},
        ).fetchone()
        if not cuenta:
            continue

        row = CuentaContableDefecto(
            id_empresa=id_empresa,
            tipo_operacion=item['tipo_operacion'],
            id_cuenta_contable=str(cuenta[0]),
            descripcion=item['label'],
            estado=True,
        )
        db.session.add(row)
        creados.append(row)

    if creados:
        db.session.commit()
    return [{'tipo_operacion': r.tipo_operacion, 'id_cuenta_contable': r.id_cuenta_contable} for r in creados]


def guardar_cuentas_defecto(id_empresa: str, items: List[Dict[str, Any]]) -> None:
    id_plan = _plan_activo_id(id_empresa)
    if not id_plan:
        raise ValidationError({'plan': ['La empresa no tiene plan contable activo']})

    for item in items:
        tipo = item.get('tipo_operacion')
        id_cuenta = item.get('id_cuenta_contable')
        if tipo not in TIPOS_VALIDOS:
            raise ValidationError({'tipo_operacion': [f'Tipo inválido: {tipo}']})
        if not id_cuenta:
            raise ValidationError({'id_cuenta_contable': ['Requerido']})
        if not _cuenta_en_plan(id_plan, str(id_cuenta)):
            raise ValidationError({'id_cuenta_contable': ['La cuenta no pertenece al plan activo']})

        row = CuentaContableDefecto.query.filter_by(
            id_empresa=id_empresa,
            tipo_operacion=tipo,
        ).first()
        if row is None:
            row = CuentaContableDefecto(id_empresa=id_empresa, tipo_operacion=tipo)
            db.session.add(row)
        row.id_cuenta_contable = str(id_cuenta)
        row.estado = True
        row.updated_at = datetime.utcnow()

    db.session.commit()
