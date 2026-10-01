"""Servicio de escritura de gasto + detalle (transacción única)."""
from decimal import Decimal
from typing import Any, Dict, List, Optional, Set

from marshmallow import ValidationError

from utils.db import db
from models.categoria_gasto import CategoriaGasto
from models.refs import TerceroRef, ItemRef, ImpuestoRef
from schemas.gasto_schema import GastoCreateSchema, GastoUpdateSchema, GastoOutSchema
from services.calculo_gasto import calcular_lineas_y_cabecera
from repositories import gasto_repository as repo


out_schema = GastoOutSchema()


def _validate_categoria(id_categoria_gasto: str, id_empresa: str) -> CategoriaGasto:
    cat = CategoriaGasto.query.filter_by(
        id_categoria_gasto=str(id_categoria_gasto),
        id_empresa=str(id_empresa),
    ).first()
    if not cat:
        raise ValueError('La categoría no existe o no pertenece a la empresa')
    if not cat.estado:
        raise ValueError('La categoría está inactiva')
    return cat


def _validate_tercero(id_tercero: Optional[str], id_empresa: str) -> None:
    if not id_tercero:
        return
    tercero = TerceroRef.query.filter_by(
        id_tercero=str(id_tercero),
        id_empresa=str(id_empresa),
    ).first()
    if not tercero:
        raise ValueError('El tercero no existe o no pertenece a la empresa')


def _validate_items(detalles: List[Dict[str, Any]], id_empresa: str) -> None:
    item_ids: Set[str] = set()
    for ln in detalles:
        if ln.get('id_item'):
            item_ids.add(str(ln['id_item']))
    if not item_ids:
        return
    existentes = ItemRef.query.filter(
        ItemRef.id_item.in_(list(item_ids)),
        ItemRef.id_empresa == str(id_empresa),
    ).all()
    ok = {str(i.id_item) for i in existentes}
    if any(iid not in ok for iid in item_ids):
        raise ValueError('Uno o más ítems no existen o no pertenecen a la empresa')


def _load_tasas(detalles: List[Dict[str, Any]]) -> Dict[int, Decimal]:
    ids: Set[int] = set()
    for ln in detalles:
        if ln.get('impuesto_id') is not None:
            ids.add(int(ln['impuesto_id']))
    if not ids:
        return {}
    rows = ImpuestoRef.query.filter(ImpuestoRef.id.in_(list(ids))).all()
    found = {int(r.id): Decimal(str(r.tasa)) for r in rows}
    missing = ids - set(found.keys())
    if missing:
        raise ValueError(f'impuesto_id no encontrado: {sorted(missing)}')
    return found


def _dump_gasto(gasto) -> Dict[str, Any]:
    # Asegura detalles cargados
    _ = list(gasto.detalles)
    return out_schema.dump(gasto)


def crear_gasto(
    data: Dict[str, Any],
    id_empresa: str,
    user_id: str,
) -> Dict[str, Any]:
    if not user_id:
        raise ValueError('user_id es obligatorio para crear gasto')

    payload = GastoCreateSchema().load(data or {})
    detalles_in = payload['detalles']

    _validate_categoria(str(payload['id_categoria_gasto']), id_empresa)
    _validate_tercero(
        str(payload['id_tercero']) if payload.get('id_tercero') else None,
        id_empresa,
    )
    _validate_items(detalles_in, id_empresa)
    tasas = _load_tasas(detalles_in)

    try:
        lineas_calc, totales = calcular_lineas_y_cabecera(detalles_in, tasas)
    except ValueError as e:
        raise ValidationError(str(e)) from e

    # TX única: numeración + cabecera + detalles (sin commit en repositories)
    try:
        numero = repo.obtener_siguiente_numero_gasto(
            id_empresa=id_empresa,
            fecha_gasto=payload['fecha_gasto'],
        )
        gasto = repo.create_gasto_cabecera(
            id_empresa=id_empresa,
            numero_gasto=numero,
            payload=payload,
            totales=totales,
            user_id=user_id,
        )
        db.session.flush()
        repo.add_detalles(str(gasto.id_gasto), lineas_calc)
        db.session.commit()
        db.session.refresh(gasto)
        return _dump_gasto(gasto)
    except Exception:
        db.session.rollback()
        raise


def actualizar_gasto(
    id_gasto: str,
    data: Dict[str, Any],
    id_empresa: str,
    user_id: str,
) -> Optional[Dict[str, Any]]:
    """Solo gastos en BORRADOR de la misma empresa. Reemplaza todos los detalles."""
    if not user_id:
        raise ValueError('user_id es obligatorio para actualizar gasto')

    gasto = repo.get_gasto_by_id_empresa(id_gasto, id_empresa)
    if not gasto:
        return None

    if str(gasto.estado_gasto).upper() != 'BORRADOR':
        raise ValueError(
            f'Solo se puede editar un gasto en BORRADOR (actual: {gasto.estado_gasto})'
        )

    created_by_original = gasto.created_by

    payload = GastoUpdateSchema().load(data or {})
    detalles_in = payload['detalles']

    _validate_categoria(str(payload['id_categoria_gasto']), id_empresa)
    _validate_tercero(
        str(payload['id_tercero']) if payload.get('id_tercero') else None,
        id_empresa,
    )
    _validate_items(detalles_in, id_empresa)
    tasas = _load_tasas(detalles_in)

    try:
        lineas_calc, totales = calcular_lineas_y_cabecera(detalles_in, tasas)
    except ValueError as e:
        raise ValidationError(str(e)) from e

    try:
        gasto.id_tercero = str(payload['id_tercero']) if payload.get('id_tercero') else None
        gasto.id_categoria_gasto = str(payload['id_categoria_gasto'])
        gasto.tipo_documento = (
            str(payload['tipo_documento']).strip() if payload.get('tipo_documento') else None
        ) or None
        gasto.numero_documento = (
            str(payload['numero_documento']).strip() if payload.get('numero_documento') else None
        ) or None
        gasto.fecha_gasto = payload['fecha_gasto']
        gasto.fecha_vencimiento = payload.get('fecha_vencimiento')
        gasto.concepto = str(payload['concepto']).strip()
        gasto.observacion = (
            str(payload['observacion']).strip() if payload.get('observacion') else None
        ) or None
        gasto.subtotal = totales['subtotal']
        gasto.descuento = totales['descuento']
        gasto.impuesto = totales['impuesto']
        gasto.total = totales['total']
        gasto.updated_by = str(user_id)
        # numero_gasto, estado_gasto y created_by no cambian en update
        gasto.created_by = created_by_original

        repo.replace_detalles(gasto, lineas_calc)
        db.session.commit()
        db.session.refresh(gasto)
        return _dump_gasto(gasto)
    except Exception:
        db.session.rollback()
        raise
