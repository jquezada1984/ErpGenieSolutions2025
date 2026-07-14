from datetime import datetime
from typing import Dict, Any
from marshmallow import ValidationError
from sqlalchemy import text
from utils.db import db


def listar(id_empresa: str):
    rows = db.session.execute(
        text(
            """SELECT cb.id_cuenta_bancaria, cb.numero_cuenta, cb.etiqueta_cuenta, cb.iban,
                      cb.id_cuenta_contable, cb.id_diario_contable, cb.estado,
                      c.codigo AS cuenta_codigo, c.nombre AS cuenta_nombre,
                      d.codigo AS diario_codigo
               FROM cuenta_bancaria cb
               LEFT JOIN cuenta_contable c ON c.id_cuenta_contable = cb.id_cuenta_contable
               LEFT JOIN diario_contable d ON d.id_diario_contable = cb.id_diario_contable
               WHERE cb.id_empresa = :e AND cb.estado = true
               ORDER BY cb.etiqueta_cuenta"""
        ),
        {'e': id_empresa},
    ).mappings().all()
    return [dict(r) for r in rows]


def actualizar_contabilidad(id_empresa: str, id_cuenta_bancaria: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    row = db.session.execute(
        text('SELECT id_cuenta_bancaria FROM cuenta_bancaria WHERE id_cuenta_bancaria = :id AND id_empresa = :e'),
        {'id': id_cuenta_bancaria, 'e': id_empresa},
    ).scalar()
    if not row:
        raise ValidationError({'id': ['Cuenta bancaria no encontrada']})
    sets = []
    params = {'id': id_cuenta_bancaria, 'e': id_empresa}
    if 'id_cuenta_contable' in payload:
        sets.append('id_cuenta_contable = :cta')
        params['cta'] = payload['id_cuenta_contable']
    if 'id_diario_contable' in payload:
        sets.append('id_diario_contable = :dia')
        params['dia'] = payload['id_diario_contable']
    if not sets:
        raise ValidationError({'campos': ['Nada que actualizar']})
    sets.append('updated_at = :now')
    params['now'] = datetime.utcnow()
    db.session.execute(
        text(f"UPDATE cuenta_bancaria SET {', '.join(sets)} WHERE id_cuenta_bancaria = :id AND id_empresa = :e"),
        params,
    )
    db.session.commit()
    return {'ok': True}
