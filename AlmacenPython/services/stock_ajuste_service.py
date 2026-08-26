"""Reglas de negocio y unidad de trabajo para AJUSTE DE STOCK v1 (delta)."""

from __future__ import annotations

import uuid
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, Optional

from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from repositories.stock_ajuste_repository import (
    actualizar_stock_ajuste_negativo,
    actualizar_stock_ajuste_positivo,
    bloquear_stock_ajuste,
    buscar_movimiento_ajuste_por_idempotencia,
    insertar_movimiento_ajuste,
)
from repositories.stock_inicial_repository import (
    buscar_almacen_por_empresa,
    buscar_item_por_empresa,
)
from schemas.stock_ajuste_schema import StockAjusteSchema
from utils.db import db


MODULO_ORIGEN = "AJUSTE_STOCK"
TIPO_MOVIMIENTO_POSITIVO = "AJUSTE_POSITIVO"
TIPO_MOVIMIENTO_NEGATIVO = "AJUSTE_NEGATIVO"
ESCALA_MONETARIA = Decimal("0.01")
CERO = Decimal("0.00")
CONSTRAINT_IDEMPOTENCIA = "uq_mov_inv_ajuste_stock_idempotencia"


class ConflictoIdempotenciaAjusteError(Exception):
    """La misma clave idempotente de AJUSTE fue enviada con otra intención."""


class StockNoInicializadoAjusteError(Exception):
    """AJUSTE exige un saldo previamente creado por STOCK INICIAL."""


class InvarianteSaldoInconsistenteAjusteError(Exception):
    """El saldo no cumple disponible = fisico - reservado."""


class StockDisponibleInsuficienteAjusteError(Exception):
    """AJUSTE NEGATIVO: cantidad supera stock_disponible."""


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


def _tipo_ajuste_desde_movimiento(tipo_movimiento: str) -> Optional[str]:
    if tipo_movimiento == TIPO_MOVIMIENTO_POSITIVO:
        return "POSITIVO"
    if tipo_movimiento == TIPO_MOVIMIENTO_NEGATIVO:
        return "NEGATIVO"
    return None


def _tipo_movimiento_desde_ajuste(tipo_ajuste: str) -> str:
    if tipo_ajuste == "POSITIVO":
        return TIPO_MOVIMIENTO_POSITIVO
    return TIPO_MOVIMIENTO_NEGATIVO


def _intencion_coincide(movimiento: Dict[str, Any], intent: Dict[str, Any]) -> bool:
    tipo_ajuste_mov = _tipo_ajuste_desde_movimiento(str(movimiento["tipo_movimiento"]))
    return (
        str(movimiento["id_empresa"]) == intent["id_empresa"]
        and str(movimiento["id_item"]) == intent["id_item"]
        and str(movimiento["id_almacen"]) == intent["id_almacen"]
        and tipo_ajuste_mov == intent["tipo_ajuste"]
        and Decimal(str(movimiento["cantidad"])) == intent["cantidad"]
        and movimiento["fecha_movimiento"] == intent["fecha_movimiento"]
        and _texto_o_none(movimiento["referencia"]) == intent["referencia"]
        and _texto_o_none(movimiento["concepto"]) == intent["concepto"]
        and movimiento["modulo_origen"] == MODULO_ORIGEN
    )


def _respuesta_replay(movimiento: Dict[str, Any], intent: Dict[str, Any]) -> Dict[str, Any]:
    if not _intencion_coincide(movimiento, intent):
        raise ConflictoIdempotenciaAjusteError(
            "La clave id_origen ya fue usada con otra intención"
        )

    saldo = bloquear_stock_ajuste(
        intent["id_empresa"], intent["id_item"], intent["id_almacen"]
    )
    db.session.rollback()
    return {
        "success": True,
        "message": "Ajuste de stock ya procesado (replay exitoso)",
        "data": {
            "estado_operacion": "YA_PROCESADO",
            "movimiento": _serializar_row(movimiento),
            "stock": _serializar_row(saldo),
        },
    }


def servicio_crear_stock_ajuste(
    raw: Dict[str, Any],
    *,
    id_empresa_contexto: Optional[str],
    user_id: Optional[str],
) -> Dict[str, Any]:
    """Aplica AJUSTE delta Q de forma atómica sobre un saldo ya inicializado."""
    if not id_empresa_contexto or not str(id_empresa_contexto).strip():
        raise ValidationError({"X-Company-Id": ["Header obligatorio"]})

    try:
        id_empresa_header = str(uuid.UUID(str(id_empresa_contexto).strip()))
    except ValueError as exc:
        raise ValidationError({"X-Company-Id": ["Debe ser UUID válido"]}) from exc

    data = StockAjusteSchema().load(raw or {})
    tipo_ajuste = str(data["tipo_ajuste"]).strip()
    intent = {
        "id_empresa": str(data["id_empresa"]),
        "id_item": str(data["id_item"]),
        "id_almacen": str(data["id_almacen"]),
        "id_origen": str(data["id_origen"]),
        "tipo_ajuste": tipo_ajuste,
        "cantidad": data["cantidad"],
        "fecha_movimiento": data["fecha_movimiento"],
        "referencia": _texto_o_none(data.get("referencia")),
        "concepto": _texto_o_none(data.get("concepto")),
    }

    if intent["id_empresa"] != id_empresa_header:
        raise ValidationError({"id_empresa": ["No coincide con X-Company-Id"]})

    auditor = _uuid_opcional(user_id)
    tipo_movimiento = _tipo_movimiento_desde_ajuste(tipo_ajuste)

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

        movimiento_existente = buscar_movimiento_ajuste_por_idempotencia(
            intent["id_empresa"], intent["id_origen"]
        )
        if movimiento_existente is not None:
            return _respuesta_replay(movimiento_existente, intent)

        saldo_bloqueado = bloquear_stock_ajuste(
            intent["id_empresa"], intent["id_item"], intent["id_almacen"]
        )
        if saldo_bloqueado is None:
            raise StockNoInicializadoAjusteError(
                "El stock debe ser inicializado antes de registrar un ajuste"
            )
        if not _invariante_ok(saldo_bloqueado):
            raise InvarianteSaldoInconsistenteAjusteError(
                "El saldo no cumple stock_disponible = stock_fisico - stock_reservado"
            )

        if tipo_ajuste == "NEGATIVO":
            if _decimal_saldo(saldo_bloqueado["stock_disponible"]) < intent["cantidad"]:
                raise StockDisponibleInsuficienteAjusteError(
                    "Stock disponible insuficiente para registrar el ajuste negativo"
                )

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

        params_update = {
            "id_empresa": intent["id_empresa"],
            "id_item": intent["id_item"],
            "id_almacen": intent["id_almacen"],
            "cantidad": intent["cantidad"],
            "updated_by": auditor,
        }
        if tipo_ajuste == "POSITIVO":
            saldo = actualizar_stock_ajuste_positivo(params_update)
        else:
            saldo = actualizar_stock_ajuste_negativo(params_update)
            if saldo is None:
                raise StockDisponibleInsuficienteAjusteError(
                    "Stock disponible insuficiente para registrar el ajuste negativo"
                )

        if not _invariante_ok(saldo):
            raise InvarianteSaldoInconsistenteAjusteError(
                "El saldo no cumple stock_disponible = stock_fisico - stock_reservado"
            )

        movimiento = insertar_movimiento_ajuste(
            {
                "id_empresa": intent["id_empresa"],
                "id_item": intent["id_item"],
                "id_almacen": intent["id_almacen"],
                "id_origen": intent["id_origen"],
                "tipo_movimiento": tipo_movimiento,
                "cantidad": intent["cantidad"],
                "fecha_movimiento": intent["fecha_movimiento"],
                "referencia": intent["referencia"],
                "concepto": intent["concepto"],
                "costo_unitario": costo_unitario,
                "costo_total": costo_total,
                "updated_by": auditor,
            }
        )
        db.session.commit()
        return {
            "success": True,
            "message": "Ajuste de stock creado correctamente",
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
            movimiento_existente = buscar_movimiento_ajuste_por_idempotencia(
                intent["id_empresa"], intent["id_origen"]
            )
            if movimiento_existente is not None:
                return _respuesta_replay(movimiento_existente, intent)
        except Exception:
            db.session.rollback()
            raise

        db.session.rollback()
        if constraint_name == CONSTRAINT_IDEMPOTENCIA:
            raise ConflictoIdempotenciaAjusteError(
                "La clave id_origen ya fue usada con otra intención"
            )
        raise
    except Exception:
        db.session.rollback()
        raise
