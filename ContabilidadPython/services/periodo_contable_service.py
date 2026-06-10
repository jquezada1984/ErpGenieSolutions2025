from datetime import datetime
from typing import Dict, Any
from marshmallow import ValidationError
from sqlalchemy import text
from utils.db import db
from models.periodo_contable import PeriodoContable
from schemas.periodo_contable_schema import PeriodoContableCrearSchema, PeriodoContableOutSchema


def _periodo_solapa(id_empresa: str, fecha_inicio, fecha_fin, exclude_id: str | None = None) -> bool:
    q = PeriodoContable.query.filter_by(id_empresa=id_empresa).filter(
        PeriodoContable.fecha_inicio <= fecha_fin,
        PeriodoContable.fecha_fin >= fecha_inicio,
    )
    if exclude_id:
        q = q.filter(PeriodoContable.id_periodo_contable != exclude_id)
    return q.first() is not None


def crear_periodo_contable(id_empresa: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    data = PeriodoContableCrearSchema().load(payload or {})
    if data['fecha_fin'] <= data['fecha_inicio']:
        raise ValidationError({'fecha_fin': ['Debe ser posterior a fecha_inicio']})

    anio = data.get('anio') or data['fecha_inicio'].year
    mes = data.get('mes') or data['fecha_inicio'].month

    exists = PeriodoContable.query.filter_by(id_empresa=id_empresa, anio=anio, mes=mes).first()
    if exists:
        raise ValidationError({'mes': ['Ya existe un periodo para ese año y mes']})

    if _periodo_solapa(id_empresa, data['fecha_inicio'], data['fecha_fin']):
        raise ValidationError({'fecha_inicio': ['El rango de fechas se solapa con otro periodo']})

    row = PeriodoContable(
        id_empresa=id_empresa,
        anio=anio,
        mes=mes,
        etiqueta=data['etiqueta'],
        fecha_inicio=data['fecha_inicio'],
        fecha_fin=data['fecha_fin'],
        estado='ABIERTO',
    )
    db.session.add(row)
    db.session.commit()
    return PeriodoContableOutSchema().dump(row)


def cerrar_periodo_contable(id_empresa: str, id_periodo: str, id_usuario: str | None) -> Dict[str, Any]:
    row = PeriodoContable.query.filter_by(
        id_periodo_contable=id_periodo,
        id_empresa=id_empresa,
    ).first()
    if not row:
        raise ValidationError({'id': ['Periodo no encontrado']})
    if row.estado != 'ABIERTO':
        raise ValidationError({'estado': ['Solo se pueden cerrar periodos ABIERTO']})

    borradores = db.session.execute(
        text(
            """SELECT COUNT(*) FROM asiento_contable
               WHERE id_empresa = :emp
                 AND estado = 'BORRADOR'
                 AND fecha_asiento >= :ini
                 AND fecha_asiento <= :fin"""
        ),
        {'emp': id_empresa, 'ini': row.fecha_inicio, 'fin': row.fecha_fin},
    ).scalar()
    if borradores and int(borradores) > 0:
        raise ValidationError({'estado': ['Existen asientos en BORRADOR en el rango del periodo']})

    row.estado = 'CERRADO'
    row.fecha_cierre = datetime.utcnow()
    row.id_usuario_cierre = id_usuario
    row.updated_at = datetime.utcnow()
    db.session.commit()
    return PeriodoContableOutSchema().dump(row)
