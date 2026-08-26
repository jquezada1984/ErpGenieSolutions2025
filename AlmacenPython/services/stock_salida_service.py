"""Reglas de negocio y unidad de trabajo para SALIDA DE STOCK v1 (libre)."""

from __future__ import annotations

import uuid
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, Optional

from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from repositories.stock_inicial_repository import (
    buscar_almacen_por_empresa,
    buscar_item_por_empresa,
)
from repositories.stock_salida_repository import (
    actualizar_stock_salida,
    bloquear_stock_salida,
    buscar_movimiento_salida_por_idempotencia,
    insertar_movimiento_salida,
)
from schemas.stock_salida_schema import StockSalidaSchema
from utils.db import db


TIPO_MOVIMIENTO = "SALIDA"
MODULO_ORIGEN = "SALIDA_STOCK"
ESCALA_MONETARIA = Decimal("0.01")
CERO = Decimal("0.00")
CONSTRAINT_IDEMPOTENCIA = "uq_mov_inv_salida_stock_idempotencia"


class ConflictoIdempotenciaSalidaError(Exception):
    """La misma clave idempotente de SALIDA fue enviada con otra intención."""


class StockNoInicializadoSalidaError(Exception):
    """SALIDA exige un saldo previamente creado por STOCK INICIAL."""


class InvarianteSaldoInconsistenteSalidaError(Exception):
    """El saldo bloqueado no cumple disponible = fisico - reservado."""


class StockDisponibleInsuficienteError(Exception):
    """La cantidad supera el stock_disponible (no el físico)."""


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
    orig = getattr(exc, "orig", None)
    diag = getattr(orig, "diag", None)
    constraint_name = getattr(diag, "constraint_name", None)
    if constraint_name:
        return str(constraint_name)

    mensaje = str(orig or exc)
    if CONSTRAINT_IDEMPOTENCIA in mensaje:
        return CONSTRAINT_IDEMPOTENCIA
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


def _decimal_saldo(valor: Any) -> Decimal:
    return Decimal(str(valor))


def _invariante_ok(saldo: Dict[str, Any]) -> bool:
    fisico = _decimal_saldo(saldo["stock_fisico"])
    reservado = _decimal_saldo(saldo["stock_reservado"])
    disponible = _decimal_saldo(saldo["stock_disponible"])
    return disponible == fisico - reservado


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
        raise ConflictoIdempotenciaSalidaError(
            "La clave id_origen ya fue usada con otra intención"
        )

    saldo = bloquear_stock_salida(
        intent["id_empresa"], intent["id_item"], intent["id_almacen"]
    )
    db.session.rollback()
    return {
        "success": True,
        "message": "Salida de stock ya procesada (replay exitoso)",
        "data": {
            "estado_operacion": "YA_PROCESADO",
            "movimiento": _serializar_row(movimiento),
            "stock": _serializar_row(saldo),
        },
    }


def servicio_crear_stock_salida(
    raw: Dict[str, Any],
    *,
    id_empresa_contexto: Optional[str],
    user_id: Optional[str],
) -> Dict[str, Any]:
    """Aplica SALIDA libre Q de forma atómica sobre un saldo ya inicializado."""
    if not id_empresa_contexto or not str(id_empresa_contexto).strip():
        raise ValidationError({"X-Company-Id": ["Header obligatorio"]})

    try:
        id_empresa_header = str(uuid.UUID(str(id_empresa_contexto).strip()))
    except ValueError as exc:
        raise ValidationError({"X-Company-Id": ["Debe ser UUID válido"]}) from exc

    data = StockSalidaSchema().load(raw or {})
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

        movimiento_existente = buscar_movimiento_salida_por_idempotencia(
            intent["id_empresa"], intent["id_origen"]
        )
        if movimiento_existente is not None:
            return _respuesta_replay(movimiento_existente, intent)

        saldo_bloqueado = bloquear_stock_salida(
            intent["id_empresa"], intent["id_item"], intent["id_almacen"]
        )
        if saldo_bloqueado is None:
            raise StockNoInicializadoSalidaError(
                "El stock debe ser inicializado antes de registrar una salida"
            )
        if not _invariante_ok(saldo_bloqueado):
            raise InvarianteSaldoInconsistenteSalidaError(
                "El saldo no cumple stock_disponible = stock_fisico - stock_reservado"
            )
        if _decimal_saldo(saldo_bloqueado["stock_disponible"]) < intent["cantidad"]:
            raise StockDisponibleInsuficienteError(
                "Stock disponible insuficiente para registrar la salida"
            )

        # Costo: misma regla mínima que STOCK INICIAL / ENTRADA (precio_compra).
        # No hay política FIFO/LIFO/promedio aprobada para SALIDA v1.
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

        saldo = actualizar_stock_salida(
            {
                "id_empresa": intent["id_empresa"],
                "id_item": intent["id_item"],
                "id_almacen": intent["id_almacen"],
                "cantidad": intent["cantidad"],
                "updated_by": auditor,
            }
        )
        if saldo is None:
            raise StockDisponibleInsuficienteError(
                "Stock disponible insuficiente para registrar la salida"
            )

        movimiento = insertar_movimiento_salida(
            {
                **intent,
                "costo_unitario": costo_unitario,
                "costo_total": costo_total,
                "updated_by": auditor,
            }
        )
        db.session.commit()
        return {
            "success": True,
            "message": "Salida de stock creada correctamente",
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
            movimiento_existente = buscar_movimiento_salida_por_idempotencia(
                intent["id_empresa"], intent["id_origen"]
            )
            if movimiento_existente is not None:
                return _respuesta_replay(movimiento_existente, intent)
        except Exception:
            db.session.rollback()
            raise

        db.session.rollback()
        if constraint_name == CONSTRAINT_IDEMPOTENCIA:
            raise ConflictoIdempotenciaSalidaError(
                "La clave id_origen ya fue usada con otra intención"
            )
        raise
    except Exception:
        db.session.rollback()
        raise
