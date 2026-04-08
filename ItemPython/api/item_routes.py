from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from services.item_service import servicio_crear_item, servicio_actualizar_item

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
