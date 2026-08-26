"""Reglas de negocio y unidad de trabajo para TRANSFERENCIA DE STOCK v1."""

from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List, Optional

from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from repositories.stock_inicial_repository import (
    buscar_almacen_por_empresa,
    buscar_item_por_empresa,
)
from repositories.stock_transferencia_repository import (
    actualizar_stock_transferencia_destino,
    actualizar_stock_transferencia_origen,
    bloquear_stock_par_transferencia,
    buscar_detalle_por_transferencia,
    buscar_movimientos_transferencia_por_idempotencia,
    buscar_transferencia_por_referencia,
    insertar_movimiento_transferencia,
    insertar_transferencia_detalle,
    insertar_transferencia_stock,
)
from schemas.stock_transferencia_schema import StockTransferenciaSchema
from utils.db import db


MODULO_ORIGEN = "TRANSFERENCIA_STOCK"
TIPO_MOVIMIENTO_SALIDA = "TRF_SALIDA"
TIPO_MOVIMIENTO_ENTRADA = "TRF_ENTRADA"
ESCALA_MONETARIA = Decimal("0.01")
CERO = Decimal("0.00")
CONSTRAINT_IDEMPOTENCIA = "uq_mov_inv_transferencia_stock_idempotencia"


class ConflictoIdempotenciaTransferenciaError(Exception):
    """La misma clave idempotente de TRANSFERENCIA fue enviada con otra intención."""


class ReplayIncompletoTransferenciaError(Exception):
    """Existe solo una pata de movimiento TRANSFERENCIA para la intención."""


class StockNoInicializadoTransferenciaError(Exception):
    """TRANSFERENCIA exige saldo inicializado en origen y destino."""


class InvarianteSaldoInconsistenteTransferenciaError(Exception):
    """El saldo no cumple disponible = fisico - reservado."""


class StockDisponibleInsuficienteTransferenciaError(Exception):
    """Origen sin stock_disponible suficiente para la transferencia."""


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


def _transferencia_ref(referencia: Optional[str], id_origen: str) -> str:
    ref = _texto_o_none(referencia)
    if ref:
        return ref[:100]
    fragmento = str(id_origen).replace("-", "")[:8]
    return f"TRF-{fragmento}"


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


def _movimiento_salida_coincide(movimiento: Dict[str, Any], intent: Dict[str, Any]) -> bool:
    return (
        str(movimiento["id_empresa"]) == intent["id_empresa"]
        and str(movimiento["id_item"]) == intent["id_item"]
        and str(movimiento["id_almacen"]) == intent["id_almacen_origen"]
        and str(movimiento["id_almacen_destino"]) == intent["id_almacen_destino"]
        and movimiento["tipo_movimiento"] == TIPO_MOVIMIENTO_SALIDA
        and movimiento["modulo_origen"] == MODULO_ORIGEN
        and Decimal(str(movimiento["cantidad"])) == intent["cantidad"]
        and movimiento["fecha_movimiento"] == intent["fecha_movimiento"]
        and _texto_o_none(movimiento["referencia"]) == intent["referencia"]
        and _texto_o_none(movimiento["concepto"]) == intent["concepto"]
    )


def _movimiento_entrada_coincide(movimiento: Dict[str, Any], intent: Dict[str, Any]) -> bool:
    return (
        str(movimiento["id_empresa"]) == intent["id_empresa"]
        and str(movimiento["id_item"]) == intent["id_item"]
        and str(movimiento["id_almacen"]) == intent["id_almacen_destino"]
        and str(movimiento["id_almacen_destino"]) == intent["id_almacen_origen"]
        and movimiento["tipo_movimiento"] == TIPO_MOVIMIENTO_ENTRADA
        and movimiento["modulo_origen"] == MODULO_ORIGEN
        and Decimal(str(movimiento["cantidad"])) == intent["cantidad"]
        and movimiento["fecha_movimiento"] == intent["fecha_movimiento"]
        and _texto_o_none(movimiento["referencia"]) == intent["referencia"]
        and _texto_o_none(movimiento["concepto"]) == intent["concepto"]
    )


def _clasificar_movimientos(
    movimientos: List[Dict[str, Any]],
) -> tuple[Optional[Dict[str, Any]], Optional[Dict[str, Any]]]:
    salida = None
    entrada = None
    for movimiento in movimientos:
        tipo = str(movimiento["tipo_movimiento"])
        if tipo == TIPO_MOVIMIENTO_SALIDA:
            salida = movimiento
        elif tipo == TIPO_MOVIMIENTO_ENTRADA:
            entrada = movimiento
    return salida, entrada


def _evaluar_replay_movimientos(
    movimientos: List[Dict[str, Any]], intent: Dict[str, Any]
) -> tuple[Optional[Dict[str, Any]], Optional[Dict[str, Any]]]:
    count = len(movimientos)
    if count == 0:
        return None, None
    if count == 1:
        raise ReplayIncompletoTransferenciaError(
            "Transferencia incompleta: existe solo una pata de movimiento"
        )
    if count > 2:
        raise ConflictoIdempotenciaTransferenciaError(
            "La clave id_origen ya fue usada con otra intención"
        )

    salida, entrada = _clasificar_movimientos(movimientos)
    if salida is None or entrada is None:
        raise ConflictoIdempotenciaTransferenciaError(
            "La clave id_origen ya fue usada con otra intención"
        )
    if not _movimiento_salida_coincide(salida, intent):
        raise ConflictoIdempotenciaTransferenciaError(
            "La clave id_origen ya fue usada con otra intención"
        )
    if not _movimiento_entrada_coincide(entrada, intent):
        raise ConflictoIdempotenciaTransferenciaError(
            "La clave id_origen ya fue usada con otra intención"
        )
    return salida, entrada


def _stock_por_almacen(
    filas: List[Dict[str, Any]], id_almacen: str
) -> Optional[Dict[str, Any]]:
    for fila in filas:
        if str(fila["id_almacen"]) == id_almacen:
            return fila
    return None


def _respuesta_replay(
    intent: Dict[str, Any],
    movimiento_salida: Dict[str, Any],
    movimiento_entrada: Dict[str, Any],
) -> Dict[str, Any]:
    ref = _transferencia_ref(intent["referencia"], intent["id_origen"])
    transferencia = buscar_transferencia_por_referencia(
        intent["id_empresa"],
        ref,
        intent["id_almacen_origen"],
        intent["id_almacen_destino"],
    )
    detalle = (
        buscar_detalle_por_transferencia(transferencia["id_transferencia_stock"])
        if transferencia
        else None
    )

    stocks = bloquear_stock_par_transferencia(
        intent["id_empresa"],
        intent["id_item"],
        intent["id_almacen_origen"],
        intent["id_almacen_destino"],
    )
    db.session.rollback()

    stock_origen = _stock_por_almacen(stocks, intent["id_almacen_origen"])
    stock_destino = _stock_por_almacen(stocks, intent["id_almacen_destino"])

    return {
        "success": True,
        "message": "Transferencia de stock ya procesada (replay exitoso)",
        "data": {
            "estado_operacion": "YA_PROCESADO",
            "transferencia": _serializar_row(transferencia),
            "detalle": _serializar_row(detalle),
            "movimiento_salida": _serializar_row(movimiento_salida),
            "movimiento_entrada": _serializar_row(movimiento_entrada),
            "stock_origen": _serializar_row(stock_origen),
            "stock_destino": _serializar_row(stock_destino),
        },
    }


def servicio_crear_stock_transferencia(
    raw: Dict[str, Any],
    *,
    id_empresa_contexto: Optional[str],
    user_id: Optional[str],
) -> Dict[str, Any]:
    """Aplica TRANSFERENCIA inmediata Q de forma atómica entre dos almacenes."""
    if not id_empresa_contexto or not str(id_empresa_contexto).strip():
        raise ValidationError({"X-Company-Id": ["Header obligatorio"]})

    try:
        id_empresa_header = str(uuid.UUID(str(id_empresa_contexto).strip()))
    except ValueError as exc:
        raise ValidationError({"X-Company-Id": ["Debe ser UUID válido"]}) from exc

    data = StockTransferenciaSchema().load(raw or {})
    intent = {
        "id_empresa": str(data["id_empresa"]),
        "id_item": str(data["id_item"]),
        "id_almacen_origen": str(data["id_almacen_origen"]),
        "id_almacen_destino": str(data["id_almacen_destino"]),
        "id_origen": str(data["id_origen"]),
        "cantidad": data["cantidad"],
        "fecha_movimiento": data["fecha_movimiento"],
        "referencia": _texto_o_none(data.get("referencia")),
        "concepto": _texto_o_none(data.get("concepto")),
    }

    if intent["id_empresa"] != id_empresa_header:
        raise ValidationError({"id_empresa": ["No coincide con X-Company-Id"]})

    auditor = _uuid_opcional(user_id)
    transferencia_ref = _transferencia_ref(intent["referencia"], intent["id_origen"])
    fecha_transferencia = datetime.combine(intent["fecha_movimiento"], datetime.min.time())

    try:
        item = buscar_item_por_empresa(intent["id_item"], intent["id_empresa"])
        if item is None:
            raise ValidationError({"id_item": ["Item no encontrado para la empresa"]})
        if item["estado"] is not True:
            raise ValidationError({"id_item": ["El item debe estar activo"]})
        if item["inventariable"] is not True:
            raise ValidationError({"id_item": ["El item debe ser inventariable"]})

        almacen_origen = buscar_almacen_por_empresa(
            intent["id_almacen_origen"], intent["id_empresa"]
        )
        if almacen_origen is None:
            raise ValidationError(
                {"id_almacen_origen": ["Almacén origen no encontrado para la empresa"]}
            )
        if almacen_origen["estado"] is not True:
            raise ValidationError({"id_almacen_origen": ["El almacén origen debe estar activo"]})

        almacen_destino = buscar_almacen_por_empresa(
            intent["id_almacen_destino"], intent["id_empresa"]
        )
        if almacen_destino is None:
            raise ValidationError(
                {"id_almacen_destino": ["Almacén destino no encontrado para la empresa"]}
            )
        if almacen_destino["estado"] is not True:
            raise ValidationError(
                {"id_almacen_destino": ["El almacén destino debe estar activo"]}
            )

        movimientos_existentes = buscar_movimientos_transferencia_por_idempotencia(
            intent["id_empresa"], intent["id_origen"]
        )
        replay = _evaluar_replay_movimientos(movimientos_existentes, intent)
        if replay[0] is not None and replay[1] is not None:
            return _respuesta_replay(intent, replay[0], replay[1])

        stocks_bloqueados = bloquear_stock_par_transferencia(
            intent["id_empresa"],
            intent["id_item"],
            intent["id_almacen_origen"],
            intent["id_almacen_destino"],
        )
        stock_origen = _stock_por_almacen(stocks_bloqueados, intent["id_almacen_origen"])
        stock_destino = _stock_por_almacen(stocks_bloqueados, intent["id_almacen_destino"])

        if stock_origen is None:
            raise StockNoInicializadoTransferenciaError(
                "El stock debe ser inicializado en el almacén origen antes de transferir"
            )
        if stock_destino is None:
            raise StockNoInicializadoTransferenciaError(
                "El stock debe ser inicializado en el almacén destino antes de transferir"
            )
        if not _invariante_ok(stock_origen) or not _invariante_ok(stock_destino):
            raise InvarianteSaldoInconsistenteTransferenciaError(
                "El saldo no cumple stock_disponible = stock_fisico - stock_reservado"
            )
        if _decimal_saldo(stock_origen["stock_disponible"]) < intent["cantidad"]:
            raise StockDisponibleInsuficienteTransferenciaError(
                "Stock disponible insuficiente para realizar la transferencia"
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
            "cantidad": intent["cantidad"],
            "updated_by": auditor,
        }

        stock_origen = actualizar_stock_transferencia_origen(
            {**params_update, "id_almacen": intent["id_almacen_origen"]}
        )
        if stock_origen is None:
            raise StockDisponibleInsuficienteTransferenciaError(
                "Stock disponible insuficiente para realizar la transferencia"
            )

        stock_destino = actualizar_stock_transferencia_destino(
            {**params_update, "id_almacen": intent["id_almacen_destino"]}
        )

        if not _invariante_ok(stock_origen) or not _invariante_ok(stock_destino):
            raise InvarianteSaldoInconsistenteTransferenciaError(
                "El saldo no cumple stock_disponible = stock_fisico - stock_reservado"
            )

        transferencia = insertar_transferencia_stock(
            {
                "id_empresa": intent["id_empresa"],
                "transferencia_ref": transferencia_ref,
                "id_almacen_origen": intent["id_almacen_origen"],
                "id_almacen_destino": intent["id_almacen_destino"],
                "fecha_transferencia": fecha_transferencia,
                "observacion": intent["concepto"],
                "created_by": auditor,
                "updated_by": auditor,
            }
        )

        detalle = insertar_transferencia_detalle(
            {
                "id_transferencia_stock": transferencia["id_transferencia_stock"],
                "id_item": intent["id_item"],
                "cantidad": intent["cantidad"],
                "created_by": auditor,
                "updated_by": auditor,
            }
        )

        params_movimiento = {
            "id_empresa": intent["id_empresa"],
            "id_item": intent["id_item"],
            "cantidad": intent["cantidad"],
            "costo_unitario": costo_unitario,
            "costo_total": costo_total,
            "fecha_movimiento": intent["fecha_movimiento"],
            "referencia": intent["referencia"],
            "concepto": intent["concepto"],
            "id_origen": intent["id_origen"],
            "updated_by": auditor,
        }

        movimiento_salida = insertar_movimiento_transferencia(
            {
                **params_movimiento,
                "tipo_movimiento": TIPO_MOVIMIENTO_SALIDA,
                "id_almacen": intent["id_almacen_origen"],
                "id_almacen_destino": intent["id_almacen_destino"],
            }
        )
        movimiento_entrada = insertar_movimiento_transferencia(
            {
                **params_movimiento,
                "tipo_movimiento": TIPO_MOVIMIENTO_ENTRADA,
                "id_almacen": intent["id_almacen_destino"],
                "id_almacen_destino": intent["id_almacen_origen"],
            }
        )

        db.session.commit()
        return {
            "success": True,
            "message": "Transferencia de stock creada correctamente",
            "data": {
                "estado_operacion": "CREADO",
                "transferencia": _serializar_row(transferencia),
                "detalle": _serializar_row(detalle),
                "movimiento_salida": _serializar_row(movimiento_salida),
                "movimiento_entrada": _serializar_row(movimiento_entrada),
                "stock_origen": _serializar_row(stock_origen),
                "stock_destino": _serializar_row(stock_destino),
            },
        }
    except IntegrityError as exc:
        db.session.rollback()
        constraint_name = _nombre_constraint(exc)

        try:
            movimientos_existentes = buscar_movimientos_transferencia_por_idempotencia(
                intent["id_empresa"], intent["id_origen"]
            )
            replay = _evaluar_replay_movimientos(movimientos_existentes, intent)
            if replay[0] is not None and replay[1] is not None:
                return _respuesta_replay(intent, replay[0], replay[1])
        except Exception:
            db.session.rollback()
            raise

        db.session.rollback()
        if constraint_name == CONSTRAINT_IDEMPOTENCIA:
            raise ConflictoIdempotenciaTransferenciaError(
                "La clave id_origen ya fue usada con otra intención"
            )
        raise
    except Exception:
        db.session.rollback()
        raise
