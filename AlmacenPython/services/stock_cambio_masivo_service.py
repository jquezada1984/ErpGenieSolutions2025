"""Reglas de negocio y unidad de trabajo para CAMBIO MASIVO DE STOCK v1."""

from __future__ import annotations

import uuid
from datetime import date, datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List, Optional, Tuple

from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from repositories.stock_cambio_masivo_repository import (
    actualizar_stock_cambio_masivo_negativo,
    actualizar_stock_cambio_masivo_positivo,
    bloquear_stocks_por_ids,
    buscar_cabecera_por_idempotencia,
    buscar_detalles_por_cabecera,
    insertar_cabecera_cambio_masivo,
    insertar_detalle_cambio_masivo,
    insertar_movimiento_cambio_masivo,
    resolver_stocks_lote,
)
from repositories.stock_inicial_repository import (
    buscar_almacen_por_empresa,
    buscar_item_por_empresa,
)
from schemas.stock_cambio_masivo_schema import StockCambioMasivoSchema
from utils.db import db


MODULO_ORIGEN = "CAMBIO_MASIVO_STOCK"
TIPO_MOVIMIENTO_POSITIVO = "AJUSTE_POSITIVO"
TIPO_MOVIMIENTO_NEGATIVO = "AJUSTE_NEGATIVO"
ESCALA_MONETARIA = Decimal("0.01")
CERO = Decimal("0.00")
CONSTRAINT_IDEMPOTENCIA_MOV = "uq_mov_inv_cambio_masivo_stock_idempotencia"
CONSTRAINT_IDEMPOTENCIA_CAB = "uq_cambio_masivo_stock_empresa_origen"


class ConflictoIdempotenciaCambioMasivoError(Exception):
    """La misma clave idempotente de CAMBIO MASIVO fue enviada con otra intención."""


class StockNoInicializadoCambioMasivoError(Exception):
    """CAMBIO MASIVO exige saldos previamente creados por STOCK INICIAL."""


class InvarianteSaldoInconsistenteCambioMasivoError(Exception):
    """El saldo no cumple disponible = fisico - reservado."""


class StockDisponibleInsuficienteCambioMasivoError(Exception):
    """CAMBIO MASIVO NEGATIVO: cantidad supera stock_disponible."""


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
    for nombre in (CONSTRAINT_IDEMPOTENCIA_MOV, CONSTRAINT_IDEMPOTENCIA_CAB):
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


def _decimal_saldo(valor: Any) -> Decimal:
    return Decimal(str(valor))


def _invariante_ok(saldo: Dict[str, Any]) -> bool:
    fisico = _decimal_saldo(saldo["stock_fisico"])
    reservado = _decimal_saldo(saldo["stock_reservado"])
    disponible = _decimal_saldo(saldo["stock_disponible"])
    return disponible == fisico - reservado


def _fecha_como_date(valor: Any) -> date:
    if isinstance(valor, datetime):
        return valor.date()
    if isinstance(valor, date):
        return valor
    return date.fromisoformat(str(valor)[:10])


def _tipo_movimiento_desde_ajuste(tipo_ajuste: str) -> str:
    if tipo_ajuste == "POSITIVO":
        return TIPO_MOVIMIENTO_POSITIVO
    return TIPO_MOVIMIENTO_NEGATIVO


def _detalles_intencion_ordenados(
    detalles: List[Dict[str, Any]],
) -> List[Tuple[str, str, Decimal]]:
    filas: List[Tuple[str, str, Decimal]] = []
    for detalle in detalles:
        filas.append(
            (
                str(detalle["id_item"]),
                str(detalle["tipo_ajuste"]).strip(),
                Decimal(str(detalle["cantidad"])),
            )
        )
    filas.sort(key=lambda x: x[0])
    return filas


def _intencion_coincide(
    cabecera: Dict[str, Any],
    detalles_persistidos: List[Dict[str, Any]],
    intent: Dict[str, Any],
) -> bool:
    if (
        str(cabecera["id_empresa"]) != intent["id_empresa"]
        or str(cabecera["id_almacen"]) != intent["id_almacen"]
        or str(cabecera["id_origen"]) != intent["id_origen"]
        or _fecha_como_date(cabecera["fecha_movimiento"]) != intent["fecha_movimiento"]
        or _texto_o_none(cabecera["referencia"]) != intent["referencia"]
        or _texto_o_none(cabecera["concepto"]) != intent["concepto"]
    ):
        return False

    esperado = _detalles_intencion_ordenados(intent["detalles"])
    actual = _detalles_intencion_ordenados(detalles_persistidos)
    return esperado == actual


def _respuesta_replay(
    cabecera: Dict[str, Any], detalles: List[Dict[str, Any]]
) -> Dict[str, Any]:
    return {
        "success": True,
        "message": "Cambio masivo de stock ya procesado (replay exitoso)",
        "data": {
            "estado_operacion": "YA_PROCESADO",
            "id_cambio_masivo_stock": cabecera["id_cambio_masivo_stock"],
            "cantidad_detalles": len(detalles),
            "cambio_masivo": _serializar_row(cabecera),
            "detalles": [_serializar_row(d) for d in detalles],
        },
    }


def _evaluar_replay_cabecera(
    cabecera: Optional[Dict[str, Any]], intent: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    if cabecera is None:
        return None
    detalles = buscar_detalles_por_cabecera(cabecera["id_cambio_masivo_stock"])
    if not _intencion_coincide(cabecera, detalles, intent):
        raise ConflictoIdempotenciaCambioMasivoError(
            "La clave id_origen ya fue usada con otra intención"
        )
    return _respuesta_replay(cabecera, detalles)


def _costo_unitario_item(precio_compra: Any) -> Decimal:
    if precio_compra is None:
        return CERO
    return Decimal(str(precio_compra)).quantize(
        ESCALA_MONETARIA, rounding=ROUND_HALF_UP
    )


def servicio_crear_stock_cambio_masivo(
    raw: Dict[str, Any],
    *,
    id_empresa_contexto: Optional[str],
    user_id: Optional[str],
) -> Dict[str, Any]:
    """Aplica un lote de ajustes POSITIVO/NEGATIVO en una sola transacción."""
    if not id_empresa_contexto or not str(id_empresa_contexto).strip():
        raise ValidationError({"X-Company-Id": ["Header obligatorio"]})

    try:
        id_empresa_header = str(uuid.UUID(str(id_empresa_contexto).strip()))
    except ValueError as exc:
        raise ValidationError({"X-Company-Id": ["Debe ser UUID válido"]}) from exc

    data = StockCambioMasivoSchema().load(raw or {})
    detalles_raw = data["detalles"]
    detalles_intent: List[Dict[str, Any]] = []
    for detalle in detalles_raw:
        detalles_intent.append(
            {
                "id_item": str(detalle["id_item"]),
                "tipo_ajuste": str(detalle["tipo_ajuste"]).strip(),
                "cantidad": detalle["cantidad"],
            }
        )

    intent: Dict[str, Any] = {
        "id_empresa": str(data["id_empresa"]),
        "id_almacen": str(data["id_almacen"]),
        "id_origen": str(data["id_origen"]),
        "fecha_movimiento": data["fecha_movimiento"],
        "referencia": _texto_o_none(data.get("referencia")),
        "concepto": _texto_o_none(data.get("concepto")),
        "detalles": detalles_intent,
    }

    if intent["id_empresa"] != id_empresa_header:
        raise ValidationError({"id_empresa": ["No coincide con X-Company-Id"]})

    auditor = _uuid_opcional(user_id)

    try:
        almacen = buscar_almacen_por_empresa(intent["id_almacen"], intent["id_empresa"])
        if almacen is None:
            raise ValidationError({"id_almacen": ["Almacén no encontrado para la empresa"]})
        if almacen["estado"] is not True:
            raise ValidationError({"id_almacen": ["El almacén debe estar activo"]})

        cabecera_existente = buscar_cabecera_por_idempotencia(
            intent["id_empresa"], intent["id_origen"]
        )
        replay = _evaluar_replay_cabecera(cabecera_existente, intent)
        if replay is not None:
            return replay

        items_por_id: Dict[str, Dict[str, Any]] = {}
        for detalle in intent["detalles"]:
            id_item = detalle["id_item"]
            item = buscar_item_por_empresa(id_item, intent["id_empresa"])
            if item is None:
                raise ValidationError(
                    {"detalles": [f"Item {id_item} no encontrado para la empresa"]}
                )
            if item["estado"] is not True:
                raise ValidationError(
                    {"detalles": [f"El item {id_item} debe estar activo"]}
                )
            if item["inventariable"] is not True:
                raise ValidationError(
                    {"detalles": [f"El item {id_item} debe ser inventariable"]}
                )
            items_por_id[id_item] = item

        id_items = [d["id_item"] for d in intent["detalles"]]
        stocks_resueltos = resolver_stocks_lote(
            intent["id_empresa"], intent["id_almacen"], id_items
        )
        if len(stocks_resueltos) != len(id_items):
            raise StockNoInicializadoCambioMasivoError(
                "El stock debe ser inicializado antes de registrar un cambio masivo"
            )

        ids_stock = [str(s["id_stock_producto_almacen"]) for s in stocks_resueltos]
        stocks_bloqueados = bloquear_stocks_por_ids(ids_stock)
        if len(stocks_bloqueados) != len(ids_stock):
            raise StockNoInicializadoCambioMasivoError(
                "El stock debe ser inicializado antes de registrar un cambio masivo"
            )

        stock_por_item = {str(s["id_item"]): s for s in stocks_bloqueados}

        for saldo in stocks_bloqueados:
            if not _invariante_ok(saldo):
                raise InvarianteSaldoInconsistenteCambioMasivoError(
                    "El saldo no cumple stock_disponible = stock_fisico - stock_reservado"
                )

        for detalle in intent["detalles"]:
            if detalle["tipo_ajuste"] != "NEGATIVO":
                continue
            saldo = stock_por_item[detalle["id_item"]]
            if _decimal_saldo(saldo["stock_disponible"]) < detalle["cantidad"]:
                raise StockDisponibleInsuficienteCambioMasivoError(
                    "Stock disponible insuficiente para registrar el cambio masivo"
                )

        cabecera = insertar_cabecera_cambio_masivo(
            {
                "id_empresa": intent["id_empresa"],
                "id_almacen": intent["id_almacen"],
                "id_origen": intent["id_origen"],
                "fecha_movimiento": intent["fecha_movimiento"],
                "referencia": intent["referencia"],
                "concepto": intent["concepto"],
                "created_by": auditor,
                "updated_by": auditor,
            }
        )

        # Orden estable por id_item (no por orden HTTP) al persistir/aplicar.
        detalles_ordenados = sorted(intent["detalles"], key=lambda d: d["id_item"])
        detalles_insertados: List[Dict[str, Any]] = []
        for detalle in detalles_ordenados:
            detalles_insertados.append(
                insertar_detalle_cambio_masivo(
                    {
                        "id_cambio_masivo_stock": cabecera["id_cambio_masivo_stock"],
                        "id_item": detalle["id_item"],
                        "tipo_ajuste": detalle["tipo_ajuste"],
                        "cantidad": detalle["cantidad"],
                        "created_by": auditor,
                        "updated_by": auditor,
                    }
                )
            )

        stocks_actualizados: List[Dict[str, Any]] = []
        movimientos: List[Dict[str, Any]] = []

        for detalle_persistido, detalle_intent in zip(
            detalles_insertados, detalles_ordenados
        ):
            params_update = {
                "id_empresa": intent["id_empresa"],
                "id_item": detalle_intent["id_item"],
                "id_almacen": intent["id_almacen"],
                "cantidad": detalle_intent["cantidad"],
                "updated_by": auditor,
            }
            if detalle_intent["tipo_ajuste"] == "POSITIVO":
                saldo = actualizar_stock_cambio_masivo_positivo(params_update)
            else:
                saldo = actualizar_stock_cambio_masivo_negativo(params_update)
                if saldo is None:
                    raise StockDisponibleInsuficienteCambioMasivoError(
                        "Stock disponible insuficiente para registrar el cambio masivo"
                    )
            stocks_actualizados.append(saldo)

            costo_unitario = _costo_unitario_item(
                items_por_id[detalle_intent["id_item"]]["precio_compra"]
            )
            costo_total = (detalle_intent["cantidad"] * costo_unitario).quantize(
                ESCALA_MONETARIA, rounding=ROUND_HALF_UP
            )
            movimientos.append(
                insertar_movimiento_cambio_masivo(
                    {
                        "id_empresa": intent["id_empresa"],
                        "id_item": detalle_intent["id_item"],
                        "id_almacen": intent["id_almacen"],
                        "id_origen": detalle_persistido[
                            "id_cambio_masivo_stock_detalle"
                        ],
                        "tipo_movimiento": _tipo_movimiento_desde_ajuste(
                            detalle_intent["tipo_ajuste"]
                        ),
                        "cantidad": detalle_intent["cantidad"],
                        "fecha_movimiento": intent["fecha_movimiento"],
                        "referencia": intent["referencia"],
                        "concepto": intent["concepto"],
                        "costo_unitario": costo_unitario,
                        "costo_total": costo_total,
                        "updated_by": auditor,
                    }
                )
            )

        # Revalidación del conjunto bloqueado antes del COMMIT.
        stocks_finales = bloquear_stocks_por_ids(ids_stock)
        for saldo in stocks_finales:
            if not _invariante_ok(saldo):
                raise InvarianteSaldoInconsistenteCambioMasivoError(
                    "El saldo no cumple stock_disponible = stock_fisico - stock_reservado"
                )

        db.session.commit()
        return {
            "success": True,
            "message": "Cambio masivo de stock creado correctamente",
            "data": {
                "estado_operacion": "CREADO",
                "id_cambio_masivo_stock": cabecera["id_cambio_masivo_stock"],
                "cantidad_detalles": len(detalles_insertados),
                "cambio_masivo": _serializar_row(cabecera),
                "detalles": [_serializar_row(d) for d in detalles_insertados],
                "movimientos": [_serializar_row(m) for m in movimientos],
                "stocks": [_serializar_row(s) for s in stocks_actualizados],
            },
        }
    except IntegrityError as exc:
        db.session.rollback()
        constraint_name = _nombre_constraint(exc)

        try:
            cabecera_existente = buscar_cabecera_por_idempotencia(
                intent["id_empresa"], intent["id_origen"]
            )
            replay = _evaluar_replay_cabecera(cabecera_existente, intent)
            if replay is not None:
                return replay
        except Exception:
            db.session.rollback()
            raise

        db.session.rollback()
        if constraint_name in (
            CONSTRAINT_IDEMPOTENCIA_MOV,
            CONSTRAINT_IDEMPOTENCIA_CAB,
        ):
            raise ConflictoIdempotenciaCambioMasivoError(
                "La clave id_origen ya fue usada con otra intención"
            )
        raise
    except Exception:
        db.session.rollback()
        raise
