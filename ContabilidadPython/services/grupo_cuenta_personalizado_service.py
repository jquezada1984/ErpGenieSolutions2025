from datetime import datetime
from typing import Dict, Any, List
from marshmallow import ValidationError
from utils.db import db
from models.grupo_cuenta_personalizado import GrupoCuentaPersonalizado, CuentaGrupoPersonalizado


def listar(id_empresa: str) -> List[Dict[str, Any]]:
    rows = GrupoCuentaPersonalizado.query.filter_by(id_empresa=id_empresa, estado=True).order_by(
        GrupoCuentaPersonalizado.posicion, GrupoCuentaPersonalizado.nombre
    ).all()
    return [_dump_grupo(r) for r in rows]


def crear(id_empresa: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    nombre = (payload.get('nombre') or '').strip()
    if not nombre:
        raise ValidationError({'nombre': ['Obligatorio']})
    row = GrupoCuentaPersonalizado(
        id_empresa=id_empresa,
        nombre=nombre,
        descripcion=payload.get('descripcion'),
        codigo=payload.get('codigo'),
        etiqueta=payload.get('etiqueta'),
        comentario=payload.get('comentario'),
        calculado=bool(payload.get('calculado', False)),
        formula=payload.get('formula'),
        posicion=int(payload.get('posicion') or 0),
        id_pais=payload.get('id_pais'),
    )
    db.session.add(row)
    db.session.commit()
    return _dump_grupo(row)


def actualizar(id_empresa: str, id_grupo: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    row = GrupoCuentaPersonalizado.query.filter_by(
        id_grupo_cuenta_personalizado=id_grupo, id_empresa=id_empresa
    ).first()
    if not row:
        raise ValidationError({'id': ['Grupo no encontrado']})
    for f in ('nombre', 'descripcion', 'codigo', 'etiqueta', 'comentario', 'formula', 'id_pais'):
        if f in payload:
            setattr(row, f, payload[f])
    if 'calculado' in payload:
        row.calculado = bool(payload['calculado'])
    if 'posicion' in payload:
        row.posicion = int(payload['posicion'])
    row.updated_at = datetime.utcnow()
    db.session.commit()
    return _dump_grupo(row)


def eliminar(id_empresa: str, id_grupo: str) -> Dict[str, Any]:
    row = GrupoCuentaPersonalizado.query.filter_by(
        id_grupo_cuenta_personalizado=id_grupo, id_empresa=id_empresa
    ).first()
    if not row:
        raise ValidationError({'id': ['Grupo no encontrado']})
    row.estado = False
    row.updated_at = datetime.utcnow()
    db.session.commit()
    return {'ok': True}


def asignar_cuentas(id_empresa: str, id_grupo: str, ids_cuentas: List[str]) -> Dict[str, Any]:
    grupo = GrupoCuentaPersonalizado.query.filter_by(
        id_grupo_cuenta_personalizado=id_grupo, id_empresa=id_empresa
    ).first()
    if not grupo:
        raise ValidationError({'id': ['Grupo no encontrado']})
    CuentaGrupoPersonalizado.query.filter_by(id_grupo_cuenta_personalizado=id_grupo).delete()
    for id_cuenta in ids_cuentas or []:
        db.session.add(CuentaGrupoPersonalizado(
            id_grupo_cuenta_personalizado=id_grupo,
            id_cuenta_contable=id_cuenta,
        ))
    db.session.commit()
    return _dump_grupo(grupo)


def _dump_grupo(r: GrupoCuentaPersonalizado) -> Dict[str, Any]:
    cuentas = CuentaGrupoPersonalizado.query.filter_by(id_grupo_cuenta_personalizado=r.id_grupo_cuenta_personalizado).all()
    return {
        'id_grupo_cuenta_personalizado': str(r.id_grupo_cuenta_personalizado),
        'id_empresa': str(r.id_empresa),
        'nombre': r.nombre,
        'descripcion': r.descripcion,
        'codigo': r.codigo,
        'etiqueta': r.etiqueta,
        'comentario': r.comentario,
        'calculado': r.calculado,
        'formula': r.formula,
        'posicion': r.posicion,
        'id_pais': r.id_pais,
        'estado': r.estado,
        'ids_cuentas_contables': [str(c.id_cuenta_contable) for c in cuentas],
    }
