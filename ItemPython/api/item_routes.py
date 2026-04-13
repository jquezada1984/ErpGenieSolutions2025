from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from services.item_service import servicio_crear_item, servicio_actualizar_item
from services.etiqueta_categoria_service import (
    servicio_cambiar_estado_etiqueta_categoria,
    servicio_crear_etiqueta_categoria,
    servicio_listar_etiqueta_categoria,
    servicio_actualizar_etiqueta_categoria,
)

item_bp = Blueprint("item_bp", __name__)


def _ctx_empresa_user():
    id_empresa = request.headers.get("X-Company-Id") or request.headers.get("x-company-id")
    user_id = request.headers.get("X-User-Id") or request.headers.get("x-user-id")
    return id_empresa, user_id


@item_bp.route("/item", methods=["POST", "OPTIONS"])
@item_bp.route("/item/", methods=["POST", "OPTIONS"])
def crear_item():
    if request.method == "OPTIONS":
        return "", 204

    id_empresa_hdr, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa_hdr or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa en body o header X-Company-Id"}), 400

    try:
        res = servicio_crear_item(body, id_empresa=id_empresa, user_id=user_id)
        return jsonify(res), 201
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except IntegrityError as e:
        return jsonify({"success": False, "error": "Violación de integridad en base de datos", "detail": str(e)}), 409
    except SQLAlchemyError as e:
        return jsonify({"success": False, "error": "Error de base de datos", "detail": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@item_bp.route("/item/<id_item>", methods=["PUT", "OPTIONS"])
@item_bp.route("/item/<id_item>/", methods=["PUT", "OPTIONS"])
def actualizar_item(id_item: str):
    if request.method == "OPTIONS":
        return "", 204

    id_empresa_hdr, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa_hdr or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa en body o header X-Company-Id"}), 400

    try:
        res = servicio_actualizar_item(body, id_item=id_item, id_empresa=id_empresa, user_id=user_id)
        return jsonify(res), 200
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except LookupError:
        return jsonify({"success": False, "error": "Ítem no encontrado o sin permiso para actualizarlo"}), 404
    except IntegrityError as e:
        return jsonify({"success": False, "error": "Violación de integridad en base de datos", "detail": str(e)}), 409
    except SQLAlchemyError as e:
        return jsonify({"success": False, "error": "Error de base de datos", "detail": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@item_bp.route("/item/etiqueta-categoria/<id_etiqueta_categoria>", methods=["PUT", "OPTIONS"])
def actualizar_etiqueta_categoria(id_etiqueta_categoria: str):
    """PUT: actualiza fila en public.item_etiqueta_categoria (misma empresa que body/header)."""
    if request.method == "OPTIONS":
        return "", 204

    id_empresa_hdr, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa_hdr or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa en body o header X-Company-Id"}), 400

    try:
        res = servicio_actualizar_etiqueta_categoria(
            body,
            id_etiqueta_categoria=id_etiqueta_categoria.strip(),
            id_empresa=id_empresa,
            user_id=user_id,
        )
        return jsonify(res), 200
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except LookupError:
        return jsonify({"success": False, "error": "Etiqueta/categoría no encontrada o sin permiso para actualizarla"}), 404
    except IntegrityError as e:
        return jsonify({"success": False, "error": "Violación de integridad en base de datos", "detail": str(e)}), 409
    except SQLAlchemyError as e:
        return jsonify({"success": False, "error": "Error de base de datos", "detail": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@item_bp.route(
    "/item/etiqueta-categoria/<id_etiqueta_categoria>/estado",
    methods=["PATCH", "OPTIONS"],
)
def cambiar_estado_etiqueta_categoria(id_etiqueta_categoria: str):
    """PATCH: actualiza solo estado (+ updated_at, updated_by) en public.item_etiqueta_categoria."""
    if request.method == "OPTIONS":
        return "", 204

    id_empresa_hdr, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}
    be = body.get("id_empresa")
    if be is not None and str(be).strip():
        id_empresa = str(be).strip()
    else:
        id_empresa = (id_empresa_hdr or "").strip() if id_empresa_hdr else ""
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa en body o header X-Company-Id"}), 400

    try:
        res = servicio_cambiar_estado_etiqueta_categoria(
            body,
            id_etiqueta_categoria=id_etiqueta_categoria.strip(),
            id_empresa=id_empresa,
            user_id=user_id,
        )
        return jsonify(res), 200
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except LookupError:
        return jsonify(
            {"success": False, "error": "Etiqueta/categoría no encontrada o sin permiso para actualizar el estado"}
        ), 404
    except IntegrityError as e:
        return jsonify({"success": False, "error": "Violación de integridad en base de datos", "detail": str(e)}), 409
    except SQLAlchemyError as e:
        return jsonify({"success": False, "error": "Error de base de datos", "detail": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@item_bp.route("/item/etiqueta-categoria", methods=["GET", "POST", "OPTIONS"])
def etiqueta_categoria():
    """GET: lista public.item_etiqueta_categoria. POST: inserta fila."""
    if request.method == "OPTIONS":
        return "", 204

    if request.method == "GET":
        id_empresa_hdr, _ = _ctx_empresa_user()
        id_empresa = (request.args.get("id_empresa") or id_empresa_hdr or "").strip()
        if not id_empresa:
            return jsonify({"success": True, "data": []}), 200

        try:
            data = servicio_listar_etiqueta_categoria(id_empresa)
            return jsonify({"success": True, "data": data}), 200
        except SQLAlchemyError as e:
            return jsonify({"success": False, "error": "Error de base de datos", "detail": str(e)}), 500
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    id_empresa_hdr, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa_hdr or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa en body o header X-Company-Id"}), 400

    try:
        res = servicio_crear_etiqueta_categoria(body, id_empresa=id_empresa, user_id=user_id)
        return jsonify(res), 201
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except IntegrityError as e:
        return jsonify({"success": False, "error": "Violación de integridad en base de datos", "detail": str(e)}), 409
    except SQLAlchemyError as e:
        return jsonify({"success": False, "error": "Error de base de datos", "detail": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
