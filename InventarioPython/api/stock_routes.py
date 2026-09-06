from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from services.stock_service import (
    crear_almacen,
    actualizar_almacen,
    upsert_saldo,
    crear_movimiento,
    crear_transferencia,
    completar_transferencia,
    crear_cambio_masivo,
    completar_cambio_masivo,
    cerrar_inventario,
    upsert_lote,
    stock_a_fecha,
    stock_reposicion,
    stock_valoracion_pmp,
)

stock_bp = Blueprint("stock_bp", __name__)


def _ctx():
    id_empresa = request.headers.get("X-Company-Id") or request.headers.get("x-company-id")
    user_id = request.headers.get("X-User-Id") or request.headers.get("x-user-id")
    return (id_empresa or "").strip(), (user_id or "").strip() or None


def _handle(fn, *args, **kwargs):
    try:
        res = fn(*args, **kwargs)
        code = 201 if request.method == "POST" and "completar" not in request.path and "cerrar" not in request.path else 200
        if "completar" in request.path or "cerrar" in request.path:
            code = 200
        return jsonify(res), code
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except LookupError as e:
        return jsonify({"success": False, "error": str(e) or "No encontrado"}), 404
    except IntegrityError as e:
        return jsonify({"success": False, "error": "Violación de integridad", "detail": str(e.orig if hasattr(e, "orig") else e)}), 409
    except SQLAlchemyError as e:
        msg = str(getattr(e, "orig", e))
        return jsonify({"success": False, "error": "Error de base de datos", "detail": msg}), 400
    except Exception as e:
        msg = str(e)
        # Errores RAISE EXCEPTION de PG suelen venir en el mensaje
        return jsonify({"success": False, "error": msg}), 400


@stock_bp.route("/almacen", methods=["POST", "OPTIONS"])
@stock_bp.route("/almacen/", methods=["POST", "OPTIONS"])
def post_almacen():
    if request.method == "OPTIONS":
        return "", 204
    id_empresa, user_id = _ctx()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa"}), 400
    return _handle(crear_almacen, body, id_empresa, user_id)


@stock_bp.route("/almacen/<uuid:id_almacen>", methods=["PUT", "OPTIONS"])
def put_almacen(id_almacen):
    if request.method == "OPTIONS":
        return "", 204
    id_empresa, user_id = _ctx()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa"}), 400
    return _handle(actualizar_almacen, str(id_almacen), body, id_empresa, user_id)


@stock_bp.route("/stock/saldo", methods=["POST", "OPTIONS"])
def post_saldo():
    if request.method == "OPTIONS":
        return "", 204
    id_empresa, user_id = _ctx()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa"}), 400
    return _handle(upsert_saldo, body, id_empresa, user_id)


@stock_bp.route("/stock/movimiento", methods=["POST", "OPTIONS"])
def post_movimiento():
    if request.method == "OPTIONS":
        return "", 204
    id_empresa, user_id = _ctx()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa"}), 400
    return _handle(crear_movimiento, body, id_empresa, user_id)


@stock_bp.route("/stock/transferencia", methods=["POST", "OPTIONS"])
def post_transferencia():
    if request.method == "OPTIONS":
        return "", 204
    id_empresa, user_id = _ctx()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa"}), 400
    return _handle(crear_transferencia, body, id_empresa, user_id)


@stock_bp.route("/stock/transferencia/<uuid:id_trf>/completar", methods=["POST", "OPTIONS"])
def post_transferencia_completar(id_trf):
    if request.method == "OPTIONS":
        return "", 204
    id_empresa, user_id = _ctx()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa"}), 400
    return _handle(completar_transferencia, str(id_trf), body, id_empresa, user_id)


@stock_bp.route("/stock/cambio-masivo", methods=["POST", "OPTIONS"])
def post_cambio_masivo():
    if request.method == "OPTIONS":
        return "", 204
    id_empresa, user_id = _ctx()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa"}), 400
    return _handle(crear_cambio_masivo, body, id_empresa, user_id)


@stock_bp.route("/stock/cambio-masivo/<uuid:id_cm>/completar", methods=["POST", "OPTIONS"])
def post_cambio_masivo_completar(id_cm):
    if request.method == "OPTIONS":
        return "", 204
    id_empresa, user_id = _ctx()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa"}), 400
    return _handle(completar_cambio_masivo, str(id_cm), id_empresa, user_id)


@stock_bp.route("/inventario/<uuid:id_inventario>/cerrar", methods=["POST", "OPTIONS"])
def post_inventario_cerrar(id_inventario):
    if request.method == "OPTIONS":
        return "", 204
    id_empresa, user_id = _ctx()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa"}), 400
    return _handle(cerrar_inventario, str(id_inventario), body, id_empresa, user_id)


@stock_bp.route("/stock/lote", methods=["POST", "OPTIONS"])
def post_lote():
    if request.method == "OPTIONS":
        return "", 204
    id_empresa, user_id = _ctx()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa"}), 400
    return _handle(upsert_lote, body, id_empresa, user_id)


@stock_bp.route("/stock/a-fecha", methods=["POST", "OPTIONS"])
def post_stock_a_fecha():
    if request.method == "OPTIONS":
        return "", 204
    id_empresa, _ = _ctx()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa"}), 400
    if not body.get("fecha"):
        return jsonify({"success": False, "error": "Falta fecha"}), 400
    return _handle(stock_a_fecha, body, id_empresa)


@stock_bp.route("/stock/reposicion", methods=["POST", "OPTIONS"])
def post_reposicion():
    if request.method == "OPTIONS":
        return "", 204
    id_empresa, _ = _ctx()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa"}), 400
    return _handle(stock_reposicion, body, id_empresa)


@stock_bp.route("/stock/valoracion-pmp", methods=["POST", "OPTIONS"])
def post_valoracion():
    if request.method == "OPTIONS":
        return "", 204
    id_empresa, _ = _ctx()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa"}), 400
    return _handle(stock_valoracion_pmp, body, id_empresa)
