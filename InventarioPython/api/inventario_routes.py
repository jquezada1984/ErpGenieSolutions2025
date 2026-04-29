from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from services.inventario_service import (
    servicio_crear_inventario,
    servicio_actualizar_estado_inventario,
)

inventario_bp = Blueprint("inventario_bp", __name__)


def _ctx_empresa_user():
    id_empresa = request.headers.get("X-Company-Id") or request.headers.get("x-company-id")
    user_id = request.headers.get("X-User-Id") or request.headers.get("x-user-id")
    return id_empresa, user_id


@inventario_bp.route("/inventario", methods=["POST", "OPTIONS"])
@inventario_bp.route("/inventario/", methods=["POST", "OPTIONS"])
def crear_inventario():
    if request.method == "OPTIONS":
        return "", 204

    id_empresa_hdr, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}
    id_empresa = (body.get("id_empresa") or id_empresa_hdr or "").strip()
    if not id_empresa:
        return jsonify({"success": False, "error": "Falta id_empresa en body o header X-Company-Id"}), 400

    try:
        res = servicio_crear_inventario(body, id_empresa=id_empresa, user_id=user_id)
        return jsonify(res), 201
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except ValueError as e:
        if str(e) == "inventario_ref_duplicado":
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Ya existe un inventario con esa referencia para esta empresa.",
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


@inventario_bp.route("/inventario/estado", methods=["PATCH", "OPTIONS"])
@inventario_bp.route("/inventario/estado/", methods=["PATCH", "OPTIONS"])
def actualizar_estado_inventario():
    if request.method == "OPTIONS":
        return "", 204

    _, user_id = _ctx_empresa_user()
    body = request.get_json(silent=True) or {}

    try:
        res = servicio_actualizar_estado_inventario(body, user_id=user_id)
        return jsonify(res), 200
    except ValidationError as ve:
        return jsonify({"success": False, "errors": ve.messages}), 400
    except LookupError:
        return jsonify({"success": False, "error": "Inventario no encontrado"}), 404
    except IntegrityError as e:
        return jsonify({"success": False, "error": "Violación de integridad en base de datos", "detail": str(e)}), 409
    except SQLAlchemyError as e:
        return jsonify({"success": False, "error": "Error de base de datos", "detail": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
