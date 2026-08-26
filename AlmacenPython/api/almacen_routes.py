"""
Blueprint de Almacén — POST create + PUT update cabecera.

Health vive en app.py. Toggle estado → AlmacenNestJs (no aquí).
"""

from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
import logging

from services.almacen_service import servicio_crear_almacen, servicio_actualizar_almacen
from services.stock_transferencia_service import (
    ConflictoIdempotenciaTransferenciaError,
    InvarianteSaldoInconsistenteTransferenciaError,
    ReplayIncompletoTransferenciaError,
    StockDisponibleInsuficienteTransferenciaError,
    StockNoInicializadoTransferenciaError,
    servicio_crear_stock_transferencia,
)
from services.stock_cambio_masivo_service import (
    ConflictoIdempotenciaCambioMasivoError,
    InvarianteSaldoInconsistenteCambioMasivoError,
    StockDisponibleInsuficienteCambioMasivoError,
    StockNoInicializadoCambioMasivoError,
    servicio_crear_stock_cambio_masivo,
)
from services.stock_ajuste_service import (
    ConflictoIdempotenciaAjusteError,
    InvarianteSaldoInconsistenteAjusteError,
    StockDisponibleInsuficienteAjusteError,
    StockNoInicializadoAjusteError,
    servicio_crear_stock_ajuste,
)
from services.stock_entrada_service import (
    ConflictoIdempotenciaEntradaError,
    InvarianteSaldoInconsistenteError,
    StockNoInicializadoError,
    servicio_crear_stock_entrada,
)
from services.stock_salida_service import (
    ConflictoIdempotenciaSalidaError,
    InvarianteSaldoInconsistenteSalidaError,
    StockDisponibleInsuficienteError,
    StockNoInicializadoSalidaError,
    servicio_crear_stock_salida,
)
from services.stock_inicial_service import (
    ConflictoIdempotenciaError,
    StockYaInicializadoError,
    servicio_crear_stock_inicial,
)

almacen_bp = Blueprint("almacen_bp", __name__)
logger = logging.getLogger(__name__)


def _ctx_empresa_user():
    id_empresa = request.headers.get("X-Company-Id") or request.headers.get("x-company-id")
    user_id = request.headers.get("X-User-Id") or request.headers.get("x-user-id")
    return id_empresa, user_id


@almacen_bp.route("/almacen/stock-transferencia", methods=["POST", "OPTIONS"])
@almacen_bp.route("/almacen/stock-transferencia/", methods=["POST", "OPTIONS"])
def crear_stock_transferencia():
    """Writer aislado para transferencia inmediata entre dos almacenes."""
    if request.method == "OPTIONS":
        return "", 204

    id_empresa_hdr, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}

    try:
        res = servicio_crear_stock_transferencia(
            body,
            id_empresa_contexto=id_empresa_hdr,
            user_id=user_id,
        )
        return jsonify(res), 201 if res["data"]["estado_operacion"] == "CREADO" else 200
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except ConflictoIdempotenciaTransferenciaError as exc:
        return jsonify({"success": False, "error": "Conflicto de idempotencia", "detail": str(exc)}), 409
    except ReplayIncompletoTransferenciaError as exc:
        return jsonify({"success": False, "error": "Transferencia incompleta", "detail": str(exc)}), 409
    except StockNoInicializadoTransferenciaError as exc:
        return jsonify({"success": False, "error": "Stock no inicializado", "detail": str(exc)}), 409
    except InvarianteSaldoInconsistenteTransferenciaError as exc:
        return jsonify({"success": False, "error": "Saldo inconsistente", "detail": str(exc)}), 409
    except StockDisponibleInsuficienteTransferenciaError as exc:
        return jsonify(
            {"success": False, "error": "Stock disponible insuficiente", "detail": str(exc)}
        ), 409
    except IntegrityError:
        return jsonify({"success": False, "error": "Error de integridad en base de datos"}), 500
    except SQLAlchemyError as exc:
        logger.exception(
            "Error SQLAlchemy en stock-transferencia: %r",
            getattr(exc, "orig", exc),
        )
        return jsonify({"success": False, "error": "Error de base de datos"}), 500
    except Exception:
        return jsonify({"success": False, "error": "Error interno al crear transferencia de stock"}), 500


@almacen_bp.route("/almacen/stock-cambio-masivo", methods=["POST", "OPTIONS"])
@almacen_bp.route("/almacen/stock-cambio-masivo/", methods=["POST", "OPTIONS"])
def crear_stock_cambio_masivo():
    """Writer aislado para cambio masivo atómico (varios ajustes en un lote)."""
    if request.method == "OPTIONS":
        return "", 204

    id_empresa_hdr, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}

    try:
        res = servicio_crear_stock_cambio_masivo(
            body,
            id_empresa_contexto=id_empresa_hdr,
            user_id=user_id,
        )
        return jsonify(res), 201 if res["data"]["estado_operacion"] == "CREADO" else 200
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except ConflictoIdempotenciaCambioMasivoError as exc:
        return jsonify({"success": False, "error": "Conflicto de idempotencia", "detail": str(exc)}), 409
    except StockNoInicializadoCambioMasivoError as exc:
        return jsonify({"success": False, "error": "Stock no inicializado", "detail": str(exc)}), 409
    except InvarianteSaldoInconsistenteCambioMasivoError as exc:
        return jsonify({"success": False, "error": "Saldo inconsistente", "detail": str(exc)}), 409
    except StockDisponibleInsuficienteCambioMasivoError as exc:
        return jsonify(
            {"success": False, "error": "Stock disponible insuficiente", "detail": str(exc)}
        ), 409
    except IntegrityError:
        return jsonify({"success": False, "error": "Error de integridad en base de datos"}), 500
    except SQLAlchemyError as exc:
        logger.exception(
            "Error SQLAlchemy en stock-cambio-masivo: %r",
            getattr(exc, "orig", exc),
        )
        return jsonify({"success": False, "error": "Error de base de datos"}), 500
    except Exception:
        return jsonify({"success": False, "error": "Error interno al crear cambio masivo de stock"}), 500


@almacen_bp.route("/almacen/stock-ajuste", methods=["POST", "OPTIONS"])
@almacen_bp.route("/almacen/stock-ajuste/", methods=["POST", "OPTIONS"])
def crear_stock_ajuste():
    """Writer aislado para ajuste delta (positivo o negativo)."""
    if request.method == "OPTIONS":
        return "", 204

    id_empresa_hdr, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}

    try:
        res = servicio_crear_stock_ajuste(
            body,
            id_empresa_contexto=id_empresa_hdr,
            user_id=user_id,
        )
        return jsonify(res), 201 if res["data"]["estado_operacion"] == "CREADO" else 200
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except ConflictoIdempotenciaAjusteError as exc:
        return jsonify({"success": False, "error": "Conflicto de idempotencia", "detail": str(exc)}), 409
    except StockNoInicializadoAjusteError as exc:
        return jsonify({"success": False, "error": "Stock no inicializado", "detail": str(exc)}), 409
    except InvarianteSaldoInconsistenteAjusteError as exc:
        return jsonify({"success": False, "error": "Saldo inconsistente", "detail": str(exc)}), 409
    except StockDisponibleInsuficienteAjusteError as exc:
        return jsonify(
            {"success": False, "error": "Stock disponible insuficiente", "detail": str(exc)}
        ), 409
    except IntegrityError:
        return jsonify({"success": False, "error": "Error de integridad en base de datos"}), 500
    except SQLAlchemyError as exc:
        logger.exception(
            "Error SQLAlchemy en stock-ajuste: %r",
            getattr(exc, "orig", exc),
        )
        return jsonify({"success": False, "error": "Error de base de datos"}), 500
    except Exception:
        return jsonify({"success": False, "error": "Error interno al crear ajuste de stock"}), 500


@almacen_bp.route("/almacen/stock-salida", methods=["POST", "OPTIONS"])
@almacen_bp.route("/almacen/stock-salida/", methods=["POST", "OPTIONS"])
def crear_stock_salida():
    """Writer aislado para descontar stock disponible (salida libre)."""
    if request.method == "OPTIONS":
        return "", 204

    id_empresa_hdr, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}

    try:
        res = servicio_crear_stock_salida(
            body,
            id_empresa_contexto=id_empresa_hdr,
            user_id=user_id,
        )
        return jsonify(res), 201 if res["data"]["estado_operacion"] == "CREADO" else 200
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except ConflictoIdempotenciaSalidaError as exc:
        return jsonify({"success": False, "error": "Conflicto de idempotencia", "detail": str(exc)}), 409
    except StockNoInicializadoSalidaError as exc:
        return jsonify({"success": False, "error": "Stock no inicializado", "detail": str(exc)}), 409
    except InvarianteSaldoInconsistenteSalidaError as exc:
        return jsonify({"success": False, "error": "Saldo inconsistente", "detail": str(exc)}), 409
    except StockDisponibleInsuficienteError as exc:
        return jsonify(
            {"success": False, "error": "Stock disponible insuficiente", "detail": str(exc)}
        ), 409
    except IntegrityError:
        return jsonify({"success": False, "error": "Error de integridad en base de datos"}), 500
    except SQLAlchemyError as exc:
        logger.exception(
            "Error SQLAlchemy en stock-salida: %r",
            getattr(exc, "orig", exc),
        )
        return jsonify({"success": False, "error": "Error de base de datos"}), 500
    except Exception:
        return jsonify({"success": False, "error": "Error interno al crear salida de stock"}), 500


@almacen_bp.route("/almacen/stock-entrada", methods=["POST", "OPTIONS"])
@almacen_bp.route("/almacen/stock-entrada/", methods=["POST", "OPTIONS"])
def crear_stock_entrada():
    """Writer aislado para incrementar un saldo ya inicializado."""
    if request.method == "OPTIONS":
        return "", 204

    id_empresa_hdr, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}

    try:
        res = servicio_crear_stock_entrada(
            body,
            id_empresa_contexto=id_empresa_hdr,
            user_id=user_id,
        )
        return jsonify(res), 201 if res["data"]["estado_operacion"] == "CREADO" else 200
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except ConflictoIdempotenciaEntradaError as exc:
        return jsonify({"success": False, "error": "Conflicto de idempotencia", "detail": str(exc)}), 409
    except StockNoInicializadoError as exc:
        return jsonify({"success": False, "error": "Stock no inicializado", "detail": str(exc)}), 409
    except InvarianteSaldoInconsistenteError as exc:
        return jsonify({"success": False, "error": "Saldo inconsistente", "detail": str(exc)}), 409
    except IntegrityError:
        return jsonify({"success": False, "error": "Error de integridad en base de datos"}), 500
    except SQLAlchemyError as exc:
        logger.exception(
            "Error SQLAlchemy en stock-entrada: %r",
            getattr(exc, "orig", exc),
        )
        return jsonify({"success": False, "error": "Error de base de datos"}), 500
    except Exception:
        return jsonify({"success": False, "error": "Error interno al crear entrada de stock"}), 500


@almacen_bp.route("/almacen/stock-inicial", methods=["POST", "OPTIONS"])
@almacen_bp.route("/almacen/stock-inicial/", methods=["POST", "OPTIONS"])
def crear_stock_inicial():
    """Writer aislado para la primera y única inicialización de un saldo."""
    if request.method == "OPTIONS":
        return "", 204

    id_empresa_hdr, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}

    try:
        res = servicio_crear_stock_inicial(
            body,
            id_empresa_contexto=id_empresa_hdr,
            user_id=user_id,
        )
        return jsonify(res), 201 if res["data"]["estado_operacion"] == "CREADO" else 200
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except ConflictoIdempotenciaError as exc:
        return jsonify({"success": False, "error": "Conflicto de idempotencia", "detail": str(exc)}), 409
    except StockYaInicializadoError as exc:
        return jsonify({"success": False, "error": "Stock ya inicializado", "detail": str(exc)}), 409
    except IntegrityError:
        return jsonify({"success": False, "error": "Error de integridad en base de datos"}), 500
    except SQLAlchemyError:
        return jsonify({"success": False, "error": "Error de base de datos"}), 500
    except Exception:
        return jsonify({"success": False, "error": "Error interno al crear stock inicial"}), 500


@almacen_bp.route("/almacen", methods=["POST", "OPTIONS"])
@almacen_bp.route("/almacen/", methods=["POST", "OPTIONS"])
def crear_almacen():
    if request.method == "OPTIONS":
        return "", 204

    id_empresa_hdr, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}

    try:
        res = servicio_crear_almacen(
            body,
            id_empresa_contexto=id_empresa_hdr,
            user_id=user_id,
        )
        return jsonify(res), 201
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except ValueError as e:
        if str(e) == "almacen_ref_duplicado":
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Ya existe un almacén con esa referencia para esta empresa.",
                    }
                ),
                409,
            )
        return jsonify({"success": False, "error": str(e)}), 400
    except IntegrityError as e:
        return jsonify({"success": False, "error": "Violación de integridad en base de datos", "detail": str(e)}), 409
    except SQLAlchemyError as e:
        return jsonify({"success": False, "error": "Error de base de datos", "detail": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@almacen_bp.route("/almacen/<uuid:id_almacen>", methods=["PUT", "OPTIONS"])
@almacen_bp.route("/almacen/<uuid:id_almacen>/", methods=["PUT", "OPTIONS"])
def actualizar_almacen(id_almacen):
    if request.method == "OPTIONS":
        return "", 204

    id_empresa_hdr, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}
    id_str = str(id_almacen)

    try:
        res = servicio_actualizar_almacen(
            id_str,
            body,
            id_empresa_contexto=id_empresa_hdr,
            user_id=user_id,
        )
        return jsonify(res), 200
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except LookupError:
        return jsonify({"success": False, "error": "Almacén no encontrado"}), 404
    except ValueError as e:
        if str(e) == "almacen_ref_duplicado":
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Ya existe un almacén con esa referencia para esta empresa.",
                    }
                ),
                409,
            )
        return jsonify({"success": False, "error": str(e)}), 400
    except IntegrityError as e:
        return jsonify({"success": False, "error": "Violación de integridad en base de datos", "detail": str(e)}), 409
    except SQLAlchemyError as e:
        return jsonify({"success": False, "error": "Error de base de datos", "detail": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
