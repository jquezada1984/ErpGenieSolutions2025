from datetime import date
from typing import Any, Dict, List, Optional

from sqlalchemy import text

from utils.db import db
from models.gasto import Gasto
from models.gasto_detalle import GastoDetalle


def get_gasto_by_id_empresa(id_gasto: str, id_empresa: str) -> Optional[Gasto]:
    return Gasto.query.filter_by(
        id_gasto=str(id_gasto),
        id_empresa=str(id_empresa),
    ).first()


def obtener_siguiente_numero_gasto(id_empresa: str, fecha_gasto: date) -> str:
    """Debe ejecutarse dentro de la misma TX SQLAlchemy que el INSERT de gasto."""
    row = db.session.execute(
        text(
            'SELECT public.obtener_siguiente_numero_gasto(:id_empresa, :fecha) '
            'AS numero_gasto'
        ),
        {'id_empresa': str(id_empresa), 'fecha': fecha_gasto},
    ).mappings().first()
    if not row or not row.get('numero_gasto'):
        raise RuntimeError('No se pudo obtener numero_gasto desde PostgreSQL')
    return str(row['numero_gasto'])


def create_gasto_cabecera(
    *,
    id_empresa: str,
    numero_gasto: str,
    payload: Dict[str, Any],
    totales: Dict[str, Any],
    user_id: str,
) -> Gasto:
    """Solo add(); el commit lo controla el service (misma TX que numeración + detalles)."""
    if not user_id:
        raise ValueError('user_id es obligatorio')
    uid = str(user_id)
    gasto = Gasto(
        id_empresa=str(id_empresa),
        numero_gasto=numero_gasto,
        id_tercero=str(payload['id_tercero']) if payload.get('id_tercero') else None,
        id_categoria_gasto=str(payload['id_categoria_gasto']),
        tipo_documento=(str(payload['tipo_documento']).strip() if payload.get('tipo_documento') else None) or None,
        numero_documento=(str(payload['numero_documento']).strip() if payload.get('numero_documento') else None) or None,
        fecha_gasto=payload['fecha_gasto'],
        fecha_vencimiento=payload.get('fecha_vencimiento'),
        concepto=str(payload['concepto']).strip(),
        observacion=(str(payload['observacion']).strip() if payload.get('observacion') else None) or None,
        subtotal=totales['subtotal'],
        descuento=totales['descuento'],
        impuesto=totales['impuesto'],
        total=totales['total'],
        estado_gasto='BORRADOR',
        estado=True,
        created_by=uid,
        updated_by=uid,
    )
    db.session.add(gasto)
    return gasto


def add_detalles(id_gasto: str, lineas: List[Dict[str, Any]]) -> List[GastoDetalle]:
    created: List[GastoDetalle] = []
    for idx, ln in enumerate(lineas):
        orden = int(ln.get('orden') or (idx + 1))
        det = GastoDetalle(
            id_gasto=str(id_gasto),
            id_item=str(ln['id_item']) if ln.get('id_item') else None,
            impuesto_id=int(ln['impuesto_id']) if ln.get('impuesto_id') is not None else None,
            descripcion=str(ln['descripcion']).strip(),
            cantidad=ln['cantidad'],
            precio_unitario=ln['precio_unitario'],
            descuento=ln['descuento'],
            subtotal=ln['subtotal'],
            valor_impuesto=ln['valor_impuesto'],
            total=ln['total'],
            orden=orden,
            estado=True,
        )
        db.session.add(det)
        created.append(det)
    return created


def replace_detalles(gasto: Gasto, lineas: List[Dict[str, Any]]) -> List[GastoDetalle]:
    GastoDetalle.query.filter_by(id_gasto=str(gasto.id_gasto)).delete(
        synchronize_session=False,
    )
    return add_detalles(str(gasto.id_gasto), lineas)
