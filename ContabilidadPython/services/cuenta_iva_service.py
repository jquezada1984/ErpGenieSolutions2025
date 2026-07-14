from datetime import datetime
from typing import Dict, Any, List
from marshmallow import ValidationError
from utils.db import db
from models.cuenta_iva import CuentaIva


def listar(id_empresa: str) -> List[Dict[str, Any]]:
    rows = CuentaIva.query.filter_by(id_empresa=id_empresa, estado=True).order_by(CuentaIva.tipo_iva).all()
    return [_dump(r) for r in rows]


def crear(id_empresa: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    tipo = (payload.get('tipo_iva') or '').strip()
    pct = payload.get('porcentaje')
    id_cuenta = payload.get('id_cuenta_contable')
    if not tipo or pct is None or not id_cuenta:
        raise ValidationError({'campos': ['tipo_iva, porcentaje e id_cuenta_contable son obligatorios']})
    exists = CuentaIva.query.filter_by(id_empresa=id_empresa, tipo_iva=tipo, porcentaje=pct).first()
    if exists:
        raise ValidationError({'tipo_iva': ['Ya existe esta combinación tipo/porcentaje']})
    row = CuentaIva(id_empresa=id_empresa, tipo_iva=tipo, porcentaje=pct, id_cuenta_contable=id_cuenta)
    db.session.add(row)
    db.session.commit()
    return _dump(row)


def actualizar(id_empresa: str, id_row: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    row = CuentaIva.query.filter_by(id_cuenta_iva=id_row, id_empresa=id_empresa).first()
    if not row:
        raise ValidationError({'id': ['Registro no encontrado']})
    if 'tipo_iva' in payload:
        row.tipo_iva = payload['tipo_iva']
    if 'porcentaje' in payload:
        row.porcentaje = payload['porcentaje']
    if 'id_cuenta_contable' in payload:
        row.id_cuenta_contable = payload['id_cuenta_contable']
    row.updated_at = datetime.utcnow()
    db.session.commit()
    return _dump(row)


def eliminar(id_empresa: str, id_row: str) -> Dict[str, Any]:
    row = CuentaIva.query.filter_by(id_cuenta_iva=id_row, id_empresa=id_empresa).first()
    if not row:
        raise ValidationError({'id': ['Registro no encontrado']})
    row.estado = False
    row.updated_at = datetime.utcnow()
    db.session.commit()
    return {'ok': True}


def _dump(r: CuentaIva) -> Dict[str, Any]:
    return {
        'id_cuenta_iva': str(r.id_cuenta_iva),
        'id_empresa': str(r.id_empresa),
        'tipo_iva': r.tipo_iva,
        'porcentaje': float(r.porcentaje),
        'id_cuenta_contable': str(r.id_cuenta_contable),
        'estado': r.estado,
    }
