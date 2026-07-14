from datetime import datetime
from typing import Dict, Any, List
from marshmallow import ValidationError
from utils.db import db
from models.cuenta_impuesto import CuentaImpuesto


def listar(id_empresa: str) -> List[Dict[str, Any]]:
    rows = CuentaImpuesto.query.filter_by(id_empresa=id_empresa, estado=True).order_by(CuentaImpuesto.tipo_impuesto).all()
    return [_dump(r) for r in rows]


def crear(id_empresa: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    tipo = (payload.get('tipo_impuesto') or '').strip()
    pct = payload.get('porcentaje')
    id_cuenta = payload.get('id_cuenta_contable')
    if not tipo or pct is None or not id_cuenta:
        raise ValidationError({'campos': ['tipo_impuesto, porcentaje e id_cuenta_contable son obligatorios']})
    exists = CuentaImpuesto.query.filter_by(id_empresa=id_empresa, tipo_impuesto=tipo, porcentaje=pct).first()
    if exists:
        raise ValidationError({'tipo_impuesto': ['Ya existe esta combinación tipo/porcentaje']})
    row = CuentaImpuesto(id_empresa=id_empresa, tipo_impuesto=tipo, porcentaje=pct, id_cuenta_contable=id_cuenta)
    db.session.add(row)
    db.session.commit()
    return _dump(row)


def actualizar(id_empresa: str, id_row: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    row = CuentaImpuesto.query.filter_by(id_cuenta_impuesto=id_row, id_empresa=id_empresa).first()
    if not row:
        raise ValidationError({'id': ['Registro no encontrado']})
    if 'tipo_impuesto' in payload:
        row.tipo_impuesto = payload['tipo_impuesto']
    if 'porcentaje' in payload:
        row.porcentaje = payload['porcentaje']
    if 'id_cuenta_contable' in payload:
        row.id_cuenta_contable = payload['id_cuenta_contable']
    row.updated_at = datetime.utcnow()
    db.session.commit()
    return _dump(row)


def eliminar(id_empresa: str, id_row: str) -> Dict[str, Any]:
    row = CuentaImpuesto.query.filter_by(id_cuenta_impuesto=id_row, id_empresa=id_empresa).first()
    if not row:
        raise ValidationError({'id': ['Registro no encontrado']})
    row.estado = False
    row.updated_at = datetime.utcnow()
    db.session.commit()
    return {'ok': True}


def _dump(r: CuentaImpuesto) -> Dict[str, Any]:
    return {
        'id_cuenta_impuesto': str(r.id_cuenta_impuesto),
        'id_empresa': str(r.id_empresa),
        'tipo_impuesto': r.tipo_impuesto,
        'porcentaje': float(r.porcentaje),
        'id_cuenta_contable': str(r.id_cuenta_contable),
        'estado': r.estado,
    }
