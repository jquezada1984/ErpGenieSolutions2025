from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from services.producto_service import (
    servicio_crear_producto,
    servicio_actualizar_producto,
    servicio_eliminar_producto,
)

producto_bp = Blueprint("producto_bp", __name__)


def _empresa_id_or_400(prefer: str = "header"):
    """
    Sin JWT:
    - Preferimos header: x-empresa-id
    - Fallback: querystring ?id_empresa=
    - Para POST también puedes mandarlo en JSON (ver crear_producto)
    """
    empresa_id = None

    if prefer == "header":
        empresa_id = request.headers.get("x-empresa-id") or request.headers.get("X-Empresa-Id")

    if not empresa_id:
        empresa_id = request.args.get("id_empresa")

    if not empresa_id:
        return None, (jsonify({"success": False, "error": "id_empresa es obligatorio (header x-empresa-id o query ?id_empresa=)"}), 400)

    return empresa_id, None


@producto_bp.route("/producto", methods=["POST"])
def crear_producto():
    payload = request.get_json() or {}

    # Para POST: id_empresa desde JSON (o acepta header/query si prefieres)
    empresa_id = payload.get("id_empresa") or request.headers.get("x-empresa-id") or request.args.get("id_empresa")
    if not empresa_id:
        return jsonify({"success": False, "error": "id_empresa es obligatorio (envíalo en JSON o header x-empresa-id)"}), 400

    payload["id_empresa"] = empresa_id  # 🔒 obligatorio por tu BD

    try:
        res = servicio_crear_producto(payload)
        return jsonify({"success": True, "data": res}), 201
    except ValidationError as ve:
        return jsonify({"success": False, "error": ve.messages}), 400
    except IntegrityError as ie:
        return jsonify({"success": False, "error": "Error de integridad", "details": str(ie)}), 409
    except Exception as e:
        return jsonify({"success": False, "error": "Error interno", "details": str(e)}), 500


@producto_bp.route("/producto/<uuid:id_producto>", methods=["PUT", "PATCH"])
def actualizar_producto(id_producto):
    # Obtener id_empresa: header > query > obtenerlo del producto desde BD
    empresa_id = request.headers.get("x-empresa-id") or request.headers.get("X-Empresa-Id")
    
    if not empresa_id:
        empresa_id = request.args.get("id_empresa")
    
    # Si no viene id_empresa, obtenerlo consultando el producto desde BD
    if not empresa_id:
        from models.producto import Producto
        producto_existente = Producto.query.filter(Producto.id_producto == id_producto).first()
        if not producto_existente:
            return jsonify({"success": False, "error": "Producto no encontrado"}), 404
        empresa_id = str(producto_existente.id_empresa)

    payload = request.get_json() or {}
    payload.pop("id_empresa", None)  # 🔒 no permitir cambiar empresa

    try:
        res = servicio_actualizar_producto(id_empresa=empresa_id, id_producto=id_producto, payload=payload)
        if not res:
            return jsonify({"success": False, "error": "No encontrado"}), 404
        return jsonify({"success": True, "data": res})
    except ValidationError as ve:
        return jsonify({"success": False, "error": ve.messages}), 400
    except IntegrityError as ie:
        return jsonify({"success": False, "error": "Error de integridad", "details": str(ie)}), 409
    except Exception as e:
        return jsonify({"success": False, "error": "Error interno", "details": str(e)}), 500


@producto_bp.route("/producto/<uuid:id_producto>", methods=["DELETE"])
def eliminar_producto(id_producto):
    empresa_id, err = _empresa_id_or_400(prefer="header")
    if err:
        return err

    try:
        ok = servicio_eliminar_producto(id_empresa=empresa_id, id_producto=id_producto)
        if not ok:
            return jsonify({"success": False, "error": "No encontrado"}), 404
        return jsonify({"success": True, "data": {"deleted": True}})
    except Exception as e:
        return jsonify({"success": False, "error": "Error interno", "details": str(e)}), 500
