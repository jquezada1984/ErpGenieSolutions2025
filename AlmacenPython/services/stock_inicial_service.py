"""Reglas de negocio y unidad de trabajo para STOCK INICIAL v1."""

from __future__ import annotations

import uuid
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, Optional

from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from repositories.stock_inicial_repository import (
    buscar_almacen_por_empresa,
    buscar_item_por_empresa,
    buscar_movimiento_por_idempotencia,
    buscar_stock_por_item_almacen,
    insertar_movimiento_stock_inicial,
    insertar_stock_inicial,
)
from schemas.stock_inicial_schema import StockInicialSchema
from utils.db import db


TIPO_MOVIMIENTO = "INICIAL"
MODULO_ORIGEN = "STOCK_INICIAL"
ESCALA_MONETARIA = Decimal("0.01")
CERO = Decimal("0.00")


class ConflictoIdempotenciaError(Exception):
    """La misma clave idempotente fue enviada con otra intención."""


class StockYaInicializadoError(Exception):
    """Ya existe saldo para el item y almacén solicitados."""


def _uuid_opcional(value: Optional[str]) -> Optional[str]:
    if value is None or not str(value).strip():
        return None
    try:
        return str(uuid.UUID(str(value).strip()))
    except ValueError:
        return None


def _texto_o_none(value: Any) -> Optional[str]:
    if value is None:
        return None
    value_normalizado = str(value).strip()
    return value_normalizado or None


def _nombre_constraint(exc: IntegrityError) -> Optional[str]:
    """Extrae el nombre de constraint de psycopg2/SQLAlchemy cuando está disponible."""
    orig = getattr(exc, "orig", None)
    diag = getattr(orig, "diag", None)
    constraint_name = getattr(diag, "constraint_name", None)
    if constraint_name:
        return str(constraint_name)

    # Fallback mínimo por si el driver no expone diag.
    mensaje = str(orig or exc)
    for nombre in (
        "uq_mov_inv_stock_inicial_idempotencia",
        "uq_stock_item_almacen",
        "stock_item_almacen_id_item_id_almacen_key",
    ):
        if nombre in mensaje:
            return nombre
    return None


def _serializar_row(row: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if row is None:
        return None

    serializado: Dict[str, Any] = {}
    for clave, valor in row.items():
        if isinstance(valor, Decimal):
            serializado[clave] = format(valor, "f")
        elif hasattr(valor, "isoformat"):
            serializado[clave] = valor.isoformat()
        else:
            serializado[clave] = valor
    return serializado


def _intencion_coincide(movimiento: Dict[str, Any], intent: Dict[str, Any]) -> bool:
    return (
        str(movimiento["id_empresa"]) == intent["id_empresa"]
        and str(movimiento["id_item"]) == intent["id_item"]
        and str(movimiento["id_almacen"]) == intent["id_almacen"]
        and Decimal(str(movimiento["cantidad"])) == intent["cantidad"]
        and movimiento["fecha_movimiento"] == intent["fecha_movimiento"]
        and _texto_o_none(movimiento["referencia"]) == intent["referencia"]
        and _texto_o_none(movimiento["concepto"]) == intent["concepto"]
        and movimiento["tipo_movimiento"] == TIPO_MOVIMIENTO
        and movimiento["modulo_origen"] == MODULO_ORIGEN
    )


def _respuesta_replay(movimiento: Dict[str, Any], intent: Dict[str, Any]) -> Dict[str, Any]:
    if not _intencion_coincide(movimiento, intent):
        raise ConflictoIdempotenciaError("La clave id_origen ya fue usada con otra intención")

    saldo = buscar_stock_por_item_almacen(intent["id_item"], intent["id_almacen"])
    db.session.rollback()
    return {
        "success": True,
        "message": "Stock inicial ya procesado (replay exitoso)",
        "data": {
            "estado_operacion": "YA_PROCESADO",
            "movimiento": _serializar_row(movimiento),
            "stock": _serializar_row(saldo),
        },
    }


def servicio_crear_stock_inicial(
    raw: Dict[str, Any],
    *,
    id_empresa_contexto: Optional[str],
    user_id: Optional[str],
) -> Dict[str, Any]:
    """Crea de forma atómica el movimiento INICIAL y su único saldo asociado."""
    if not id_empresa_contexto or not str(id_empresa_contexto).strip():
        raise ValidationError({"X-Company-Id": ["Header obligatorio"]})

    try:
        id_empresa_header = str(uuid.UUID(str(id_empresa_contexto).strip()))
    except ValueError as exc:
        raise ValidationError({"X-Company-Id": ["Debe ser UUID válido"]}) from exc

    data = StockInicialSchema().load(raw or {})
    intent = {
        "id_empresa": str(data["id_empresa"]),
        "id_item": str(data["id_item"]),
        "id_almacen": str(data["id_almacen"]),
        "id_origen": str(data["id_origen"]),
        "cantidad": data["cantidad"],
        "fecha_movimiento": data["fecha_movimiento"],
        "referencia": _texto_o_none(data.get("referencia")),
        "concepto": _texto_o_none(data.get("concepto")),
    }

    if intent["id_empresa"] != id_empresa_header:
        raise ValidationError({"id_empresa": ["No coincide con X-Company-Id"]})

    auditor = _uuid_opcional(user_id)

    try:
        item = buscar_item_por_empresa(intent["id_item"], intent["id_empresa"])
        if item is None:
            raise ValidationError({"id_item": ["Item no encontrado para la empresa"]})
        if item["estado"] is not True:
            raise ValidationError({"id_item": ["El item debe estar activo"]})
        if item["inventariable"] is not True:
            raise ValidationError({"id_item": ["El item debe ser inventariable"]})

        almacen = buscar_almacen_por_empresa(intent["id_almacen"], intent["id_empresa"])
        if almacen is None:
            raise ValidationError({"id_almacen": ["Almacén no encontrado para la empresa"]})
        if almacen["estado"] is not True:
            raise ValidationError({"id_almacen": ["El almacén debe estar activo"]})

        movimiento_existente = buscar_movimiento_por_idempotencia(
            intent["id_empresa"], intent["id_origen"]
        )
        if movimiento_existente is not None:
            return _respuesta_replay(movimiento_existente, intent)

        saldo_existente = buscar_stock_por_item_almacen(
            intent["id_item"], intent["id_almacen"]
        )
        if saldo_existente is not None:
            raise StockYaInicializadoError("El stock para item y almacén ya fue inicializado")

        precio_compra = item["precio_compra"]
        costo_unitario = (
            CERO
            if precio_compra is None
            else Decimal(str(precio_compra)).quantize(
                ESCALA_MONETARIA, rounding=ROUND_HALF_UP
            )
        )
        costo_total = (intent["cantidad"] * costo_unitario).quantize(
            ESCALA_MONETARIA, rounding=ROUND_HALF_UP
        )

        movimiento = insertar_movimiento_stock_inicial(
            {
                **intent,
                "costo_unitario": costo_unitario,
                "costo_total": costo_total,
                "updated_by": auditor,
            }
        )
        saldo = insertar_stock_inicial(
            {
                **intent,
                "stock_fisico": intent["cantidad"],
                "stock_reservado": CERO,
                "stock_virtual": CERO,
                "created_by": auditor,
                "updated_by": auditor,
            }
        )
        db.session.commit()
        return {
            "success": True,
            "message": "Stock inicial creado correctamente",
            "data": {
                "estado_operacion": "CREADO",
                "movimiento": _serializar_row(movimiento),
                "stock": _serializar_row(saldo),
            },
        }
    except IntegrityError as exc:
        db.session.rollback()
        constraint_name = _nombre_constraint(exc)

        try:
            movimiento_existente = buscar_movimiento_por_idempotencia(
                intent["id_empresa"], intent["id_origen"]
            )
            if movimiento_existente is not None:
                return _respuesta_replay(movimiento_existente, intent)

            saldo_existente = buscar_stock_por_item_almacen(
                intent["id_item"], intent["id_almacen"]
            )
            if (
                saldo_existente is not None
                or constraint_name in {"uq_stock_item_almacen", "stock_item_almacen_id_item_id_almacen_key"}
            ):
                raise StockYaInicializadoError(
                    "El stock para item y almacén ya fue inicializado"
                )
        except Exception:
            db.session.rollback()
            raise

        db.session.rollback()
        raise
    except Exception:
        db.session.rollback()
        raise
