from typing import Any, Dict, Optional

from utils.db import db
from models.banco import Banco


def create_banco(payload: Dict[str, Any], user_id: Optional[str]) -> Banco:
    banco = Banco(
        nombre=(payload.get('nombre') or '').strip(),
        codigo=payload.get('codigo'),
        swift=payload.get('swift'),
        web=payload.get('web'),
        estado=bool(payload.get('estado', True)),
        created_by=user_id,
        updated_by=user_id,
    )
    db.session.add(banco)
    db.session.commit()
    return banco


def update_banco(id_banco: str, payload: Dict[str, Any], user_id: Optional[str]) -> Optional[Banco]:
    banco = Banco.query.filter_by(id_banco=id_banco).first()
    if not banco:
        return None
    for key in ('nombre', 'codigo', 'swift', 'web', 'estado'):
        if key in payload:
            setattr(banco, key, payload[key])
    banco.updated_by = user_id
    db.session.commit()
    return banco


def delete_banco(id_banco: str) -> bool:
    banco = Banco.query.filter_by(id_banco=id_banco).first()
    if not banco:
        return False
    banco.estado = False
    db.session.commit()
    return True
