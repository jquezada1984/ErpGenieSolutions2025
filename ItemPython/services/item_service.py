"""
Creación de ítem: normalización de payload, validación mínima, UUID en cuentas contables.
"""
from __future__ import annotations

import uuid
from decimal import Decimal, InvalidOperation
from typing import Any, Dict, Optional

from marshmallow import ValidationError

from schemas.item_schema import ItemCreateSchema
from repositories.item_repository import (
    create_item_row,
    update_item_row,
    fetch_id_tipo_comportamiento_by_codigo,
    fetch_tipo_item_codigo,
    tipo_comportamiento_row_exists,
)


def _uuid_opt(value: Any, field: str) -> Optional[str]:
    if value is None or value == "":
        return None
    s = str(value).strip()
    try:
        uuid.UUID(s)
    except ValueError as e:
        raise ValidationError({field: ["Debe ser un UUID válido"]}) from e
    return s


def _uuid_or_none(value: Optional[str]) -> Optional[str]:
    if not value or not str(value).strip():
        return None
    s = str(value).strip()
    try:
        uuid.UUID(s)
        return s
    except ValueError:
        return None


def _decimal_opt(value: Any, field: str) -> Optional[Decimal]:
    if value is None or value == "":
        return None
    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError) as e:
        raise ValidationError({field: ["Debe ser numérico"]}) from e


def _bool_opt(value: Any, default: Optional[bool] = None) -> Optional[bool]:
    if value is None or value == "":
        return default
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in ("1", "true", "yes", "si", "sí")
    return bool(value)


def _impuesto_id_opt(value: Any) -> Optional[str]:
    """Acepta UUID u otro identificador como texto; no valida UUID estricto."""
    if value is None or value == "":
        return None
    return str(value).strip() or None


def _int_opt(value: Any, field: str) -> Optional[int]:
    if value is None or value == "":
        return None
    try:
        return int(value)
    except (TypeError, ValueError) as e:
        raise ValidationError({field: ["Debe ser entero"]}) from e


def normalize_item_payload(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Alias habituales del front / otros módulos → nombres de columna reales."""
    d = dict(raw)
    if d.get("nombre") and not d.get("etiqueta"):
        d["etiqueta"] = (d.get("nombre") or "").strip()
    codigo_raw = d.get("codigo")
    if codigo_raw is not None and str(codigo_raw).strip() and not d.get("producto_ref"):
        d["producto_ref"] = str(codigo_raw).strip()
    if "largo" in d and d.get("longitud") in (None, ""):
        d["longitud"] = d["largo"]
    if "ancho" in d and d.get("anchura") in (None, ""):
        d["anchura"] = d["ancho"]
    if d.get("nota_privada") is not None and d.get("nota_interna") in (None, ""):
        d["nota_interna"] = d["nota_privada"]
    if d.get("precio_venta_minimo") is not None and d.get("precio_minimo") in (None, ""):
        d["precio_minimo"] = d["precio_venta_minimo"]
    if d.get("unidad_medida") and not d.get("id_unidad_medida"):
        d["id_unidad_medida"] = d["unidad_medida"]
    if d.get("unidad_peso") and not d.get("id_unidad_peso"):
        d["id_unidad_peso"] = d["unidad_peso"]
    if d.get("unidad_dimension") and not d.get("id_unidad_longitud"):
        d["id_unidad_longitud"] = d["unidad_dimension"]
    if d.get("unidad_superficie") and not d.get("id_unidad_superficie"):
        d["id_unidad_superficie"] = d["unidad_superficie"]
    if d.get("unidad_volumen") and not d.get("id_unidad_volumen"):
        d["id_unidad_volumen"] = d["unidad_volumen"]
    if d.get("stock_minimo") is not None and d.get("stock_minimo_alerta") in (None, ""):
        d["stock_minimo_alerta"] = d["stock_minimo"]
    if d.get("id_pais_origen") and not d.get("id_pais"):
        d["id_pais"] = d["id_pais_origen"]
    if d.get("id_provincia_origen") and not d.get("id_provincia"):
        d["id_provincia"] = d["id_provincia_origen"]
    if d.get("naturaleza_producto") and not d.get("id_naturaleza_item"):
        d["id_naturaleza_item"] = d["naturaleza_producto"]
    return d


def build_item_row(
    payload: Dict[str, Any],
    *,
    id_empresa: str,
    user_id: Optional[str],
) -> Dict[str, Any]:
    p = normalize_item_payload(payload)

    producto_ref = (
        (p.get("producto_ref") or p.get("codigo") or p.get("nombre") or p.get("etiqueta") or "")
        .strip()
    )
    if not producto_ref:
        raise ValidationError(
            {"producto_ref": ["producto_ref es obligatorio (puede venir como producto_ref, codigo o nombre)"]}
        )
    etiqueta = (p.get("etiqueta") or p.get("nombre") or producto_ref).strip() or None

    row: Dict[str, Any] = {
        "id_item": _uuid_opt(p.get("id_item"), "id_item") if p.get("id_item") else None,
        "id_empresa": id_empresa,
        "producto_ref": producto_ref,
        "etiqueta": etiqueta,
        "estado": _bool_opt(p.get("estado"), True),
        "descripcion": (p.get("descripcion") or "").strip() or None,
        "url_publica": (p.get("url_publica") or "").strip() or None,
        "peso": _decimal_opt(p.get("peso"), "peso"),
        "longitud": _decimal_opt(p.get("longitud"), "longitud"),
        "anchura": _decimal_opt(p.get("anchura"), "anchura"),
        "altura": _decimal_opt(p.get("altura"), "altura"),
        "superficie": _decimal_opt(p.get("superficie"), "superficie"),
        "volumen": _decimal_opt(p.get("volumen"), "volumen"),
        "nomenclatura_aduanera": (p.get("nomenclatura_aduanera") or "").strip() or None,
        "nota_interna": (p.get("nota_interna") or "").strip() or None,
        "precio_venta": _decimal_opt(p.get("precio_venta"), "precio_venta"),
        "precio_minimo": _decimal_opt(p.get("precio_minimo"), "precio_minimo"),
        "impuesto_id": _impuesto_id_opt(p.get("impuesto_id")),
        "created_at": None,
        "updated_at": None,
        "inventariable": _bool_opt(p.get("inventariable"), True),
        "duration_value": _int_opt(p.get("duration_value"), "duration_value"),
        "mandatory_periods": _bool_opt(p.get("mandatory_periods"), False),
        "created_by": _uuid_or_none(user_id),
        "updated_by": _uuid_or_none(user_id),
        "id_pais": _uuid_opt(p.get("id_pais"), "id_pais"),
        "id_provincia": _uuid_opt(p.get("id_provincia"), "id_provincia"),
        "poblacion": (p.get("poblacion") or "").strip() or None,
        "id_unidad_medida": _uuid_opt(p.get("id_unidad_medida"), "id_unidad_medida"),
        "id_unidad_peso": _uuid_opt(p.get("id_unidad_peso"), "id_unidad_peso"),
        "id_unidad_longitud": _uuid_opt(p.get("id_unidad_longitud"), "id_unidad_longitud"),
        "id_unidad_superficie": _uuid_opt(p.get("id_unidad_superficie"), "id_unidad_superficie"),
        "id_unidad_volumen": _uuid_opt(p.get("id_unidad_volumen"), "id_unidad_volumen"),
        "codigo_barras": (p.get("codigo_barras") or "").strip() or None,
        "precio_compra": _decimal_opt(p.get("precio_compra"), "precio_compra"),
        "stock_minimo_alerta": _decimal_opt(p.get("stock_minimo_alerta"), "stock_minimo_alerta"),
        "stock_deseado": _decimal_opt(p.get("stock_deseado"), "stock_deseado"),
        "id_almacen_defecto": _uuid_opt(p.get("id_almacen_defecto"), "id_almacen_defecto"),
        "id_categoria_item": _uuid_opt(p.get("id_categoria_item"), "id_categoria_item"),
        "id_estado_venta": _uuid_opt(p.get("id_estado_venta"), "id_estado_venta"),
        "id_estado_compra": _uuid_opt(p.get("id_estado_compra"), "id_estado_compra"),
        "id_tipo_control_caducidad": _uuid_opt(
            p.get("id_tipo_control_caducidad"), "id_tipo_control_caducidad"
        ),
        "id_tipo_item": _uuid_opt(p.get("id_tipo_item"), "id_tipo_item"),
        "id_duration_unit": _uuid_opt(p.get("id_duration_unit"), "id_duration_unit"),
        "id_tipo_control_inventario": _uuid_opt(
            p.get("id_tipo_control_inventario"), "id_tipo_control_inventario"
        ),
        "id_naturaleza_item": _uuid_opt(p.get("id_naturaleza_item"), "id_naturaleza_item"),
        "id_tipo_comportamiento": _uuid_opt(
            p.get("id_tipo_comportamiento"), "id_tipo_comportamiento"
        ),
        "id_cuenta_venta": _uuid_opt(
            p.get("id_cuenta_venta") or p.get("cuenta_venta"), "id_cuenta_venta"
        ),
        "id_cuenta_venta_intracomunitaria": _uuid_opt(
            p.get("id_cuenta_venta_intracomunitaria") or p.get("cuenta_venta_intracomunitaria"),
            "id_cuenta_venta_intracomunitaria",
        ),
        "id_cuenta_venta_exportacion": _uuid_opt(
            p.get("id_cuenta_venta_exportacion") or p.get("cuenta_venta_exportacion"),
            "id_cuenta_venta_exportacion",
        ),
        "id_cuenta_compra": _uuid_opt(p.get("id_cuenta_compra") or p.get("cuenta_compra"), "id_cuenta_compra"),
        "id_cuenta_compra_intracomunitaria": _uuid_opt(
            p.get("id_cuenta_compra_intracomunitaria") or p.get("cuenta_compra_intracomunitaria"),
            "id_cuenta_compra_intracomunitaria",
        ),
        "id_cuenta_compra_importacion": _uuid_opt(
            p.get("id_cuenta_compra_importacion") or p.get("cuenta_compra_importacion"),
            "id_cuenta_compra_importacion",
        ),
    }

    return row


def _apply_tipo_comportamiento_servicio_por_tipo_item(row: Dict[str, Any]) -> None:
    """Si el ítem es SERVICE y no viene id_tipo_comportamiento, asigna catálogo SERVICIO."""
    if row.get("id_tipo_comportamiento"):
        return
    id_ti = row.get("id_tipo_item")
    if not id_ti:
        return
    codigo_ti = fetch_tipo_item_codigo(str(id_ti))
    if codigo_ti == "SERVICE":
        sid = fetch_id_tipo_comportamiento_by_codigo("SERVICIO")
        if sid:
            row["id_tipo_comportamiento"] = sid


def _validar_tipo_comportamiento_catalogo(id_tc: Optional[str]) -> None:
    if not id_tc:
        return
    if not tipo_comportamiento_row_exists(str(id_tc)):
        raise ValidationError(
            {"id_tipo_comportamiento": ["No existe en catálogo o está inactivo"]}
        )


def servicio_crear_item(
    payload: Dict[str, Any],
    *,
    id_empresa: str,
    user_id: Optional[str],
) -> Dict[str, Any]:
    if not id_empresa or not str(id_empresa).strip():
        raise ValidationError({"id_empresa": ["Empresa obligatoria"]})
    try:
        uuid.UUID(str(id_empresa).strip())
    except ValueError as e:
        raise ValidationError({"id_empresa": ["id_empresa debe ser UUID"]}) from e

    # Mantener compatibilidad con payloads legacy: primero normaliza aliases y luego valida por schema.
    normalized_payload = normalize_item_payload(payload)
    normalized_payload["id_empresa"] = str(id_empresa).strip()
    schema_data = ItemCreateSchema().load(normalized_payload)

    row = build_item_row(schema_data, id_empresa=str(id_empresa).strip(), user_id=user_id)
    _apply_tipo_comportamiento_servicio_por_tipo_item(row)
    _validar_tipo_comportamiento_catalogo(row.get("id_tipo_comportamiento"))

    required_errors: Dict[str, list[str]] = {}
    if not row.get("id_estado_venta"):
        required_errors["id_estado_venta"] = ["id_estado_venta es obligatorio"]
    if not row.get("id_naturaleza_item"):
        required_errors["id_naturaleza_item"] = ["id_naturaleza_item es obligatorio"]
    if row.get("estado") is None:
        required_errors["estado"] = ["estado es obligatorio"]
    if row.get("inventariable") is None:
        required_errors["inventariable"] = ["inventariable es obligatorio"]
    if required_errors:
        raise ValidationError(required_errors)

    new_id = create_item_row(row)
    return {
        "success": True,
        "message": "Ítem creado",
        "id_item": new_id,
    }


def servicio_actualizar_item(
    payload: Dict[str, Any],
    *,
    id_item: str,
    id_empresa: str,
    user_id: Optional[str],
) -> Dict[str, Any]:
    if not id_item or not str(id_item).strip():
        raise ValidationError({"id_item": ["Identificador de ítem obligatorio"]})
    try:
        uuid.UUID(str(id_item).strip())
    except ValueError as e:
        raise ValidationError({"id_item": ["id_item debe ser UUID"]}) from e

    if not id_empresa or not str(id_empresa).strip():
        raise ValidationError({"id_empresa": ["Empresa obligatoria"]})
    try:
        uuid.UUID(str(id_empresa).strip())
    except ValueError as e:
        raise ValidationError({"id_empresa": ["id_empresa debe ser UUID"]}) from e

    merged = dict(payload)
    merged["id_item"] = str(id_item).strip()

    row = build_item_row(merged, id_empresa=str(id_empresa).strip(), user_id=user_id)
    row["id_item"] = str(id_item).strip()
    row["id_empresa"] = str(id_empresa).strip()
    _apply_tipo_comportamiento_servicio_por_tipo_item(row)
    _validar_tipo_comportamiento_catalogo(row.get("id_tipo_comportamiento"))

    n = update_item_row(row)
    if n == 0:
        raise LookupError("item_not_found")

    return {
        "success": True,
        "message": "Ítem actualizado",
        "id_item": str(id_item).strip(),
    }
