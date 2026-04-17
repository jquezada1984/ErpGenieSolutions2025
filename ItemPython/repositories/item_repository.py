"""
Inserción en tabla public.item (nombres de columna alineados con BD).
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict

from typing import Optional

from sqlalchemy import text

from utils.db import db
from models.item import Item


TIPO_ITEM_CODIGO_SQL = text(
    """
    SELECT codigo FROM public.tipo_item_catalogo
    WHERE id_tipo_item = CAST(:id AS uuid) AND estado = true
    LIMIT 1
    """
)

TIPO_ITEM_ID_BY_CODIGO_SQL = text(
    """
    SELECT id_tipo_item::text
    FROM public.tipo_item_catalogo
    WHERE UPPER(TRIM(codigo)) = UPPER(TRIM(:codigo))
      AND COALESCE(estado, true) = true
    ORDER BY orden NULLS LAST, codigo
    LIMIT 1
    """
)

NATURALEZA_FIRST_ACTIVO_SQL = text(
    """
    SELECT id_naturaleza_item::text
    FROM public.naturaleza_item_catalogo
    WHERE COALESCE(estado, true) = true
    ORDER BY orden NULLS LAST, codigo
    LIMIT 1
    """
)

ESTADO_COMPRA_FIRST_ACTIVO_SQL = text(
    """
    SELECT id_estado_compra::text
    FROM public.estado_compra_item
    WHERE COALESCE(estado, true) = true
    ORDER BY orden NULLS LAST, codigo
    LIMIT 1
    """
)

TIPO_CTRL_INV_FIRST_ACTIVO_SQL = text(
    """
    SELECT id_tipo_control_inventario::text
    FROM public.tipo_control_inventario_item
    WHERE COALESCE(estado, true) = true
    ORDER BY orden NULLS LAST, codigo
    LIMIT 1
    """
)

TIPO_CTRL_CAD_FIRST_ACTIVO_SQL = text(
    """
    SELECT id_tipo_control_caducidad::text
    FROM public.tipo_control_caducidad_item
    WHERE COALESCE(estado, true) = true
    ORDER BY orden NULLS LAST, codigo
    LIMIT 1
    """
)

COMPORTAMIENTO_BY_CODIGO_SQL = text(
    """
    SELECT id_tipo_comportamiento FROM public.tipo_comportamiento_item
    WHERE codigo = :codigo AND estado = true
    ORDER BY orden ASC NULLS LAST
    LIMIT 1
    """
)

COMPORTAMIENTO_EXISTS_SQL = text(
    """
    SELECT 1 FROM public.tipo_comportamiento_item
    WHERE id_tipo_comportamiento = CAST(:id AS uuid) AND estado = true
    LIMIT 1
    """
)


def fetch_tipo_item_codigo(id_tipo_item: str) -> Optional[str]:
    row = db.session.execute(TIPO_ITEM_CODIGO_SQL, {"id": id_tipo_item}).fetchone()
    if not row or row[0] is None:
        return None
    return str(row[0]).strip() or None


def fetch_id_tipo_item_by_codigo(codigo: str) -> Optional[str]:
    """UUID de tipo_item_catalogo por codigo (ej. PRODUCT, SERVICE)."""
    if not codigo or not str(codigo).strip():
        return None
    row = db.session.execute(
        TIPO_ITEM_ID_BY_CODIGO_SQL, {"codigo": str(codigo).strip()}
    ).fetchone()
    if not row or row[0] is None:
        return None
    return str(row[0]).strip() or None


def fetch_first_id_naturaleza_item_activo() -> Optional[str]:
    row = db.session.execute(NATURALEZA_FIRST_ACTIVO_SQL).fetchone()
    if not row or row[0] is None:
        return None
    return str(row[0]).strip() or None


def fetch_first_id_estado_compra_activo() -> Optional[str]:
    row = db.session.execute(ESTADO_COMPRA_FIRST_ACTIVO_SQL).fetchone()
    if not row or row[0] is None:
        return None
    return str(row[0]).strip() or None


def fetch_first_id_tipo_control_inventario_activo() -> Optional[str]:
    row = db.session.execute(TIPO_CTRL_INV_FIRST_ACTIVO_SQL).fetchone()
    if not row or row[0] is None:
        return None
    return str(row[0]).strip() or None


def fetch_first_id_tipo_control_caducidad_activo() -> Optional[str]:
    row = db.session.execute(TIPO_CTRL_CAD_FIRST_ACTIVO_SQL).fetchone()
    if not row or row[0] is None:
        return None
    return str(row[0]).strip() or None


def fetch_id_tipo_comportamiento_by_codigo(codigo: str) -> Optional[str]:
    row = db.session.execute(COMPORTAMIENTO_BY_CODIGO_SQL, {"codigo": codigo}).fetchone()
    if not row or row[0] is None:
        return None
    return str(row[0])


def tipo_comportamiento_row_exists(id_tipo_comportamiento: str) -> bool:
    row = db.session.execute(
        COMPORTAMIENTO_EXISTS_SQL, {"id": id_tipo_comportamiento}
    ).fetchone()
    return row is not None


def fetch_item_row_for_merge(id_item: str, id_empresa: str) -> Optional[Dict[str, Any]]:
    """
    Lee la fila actual de public.item para un PUT parcial seguro:
    las claves que el front no envía conservan su valor en BD (no se pisan con NULL).
    """
    item = Item.query.filter_by(
        id_item=str(id_item).strip(),
        id_empresa=str(id_empresa).strip(),
    ).first()
    if item is None:
        return None
    return {c.name: getattr(item, c.name) for c in Item.__table__.columns}


INSERT_SQL = text(
    """
    INSERT INTO public.item (
        id_item,
        id_empresa,
        producto_ref,
        etiqueta,
        estado,
        descripcion,
        url_publica,
        peso,
        longitud,
        anchura,
        altura,
        superficie,
        volumen,
        nomenclatura_aduanera,
        nota_interna,
        precio_venta,
        precio_minimo,
        impuesto_id,
        created_at,
        updated_at,
        inventariable,
        duration_value,
        mandatory_periods,
        created_by,
        updated_by,
        id_pais,
        id_provincia,
        poblacion,
        id_unidad_medida,
        id_unidad_peso,
        id_unidad_longitud,
        id_unidad_superficie,
        id_unidad_volumen,
        codigo_barras,
        precio_compra,
        stock_minimo_alerta,
        stock_deseado,
        id_almacen_defecto,
        id_categoria_item,
        id_estado_venta,
        id_estado_compra,
        id_tipo_control_caducidad,
        id_tipo_item,
        id_duration_unit,
        id_tipo_control_inventario,
        id_naturaleza_item,
        id_tipo_comportamiento,
        id_cuenta_venta,
        id_cuenta_venta_intracomunitaria,
        id_cuenta_venta_exportacion,
        id_cuenta_compra,
        id_cuenta_compra_intracomunitaria,
        id_cuenta_compra_importacion
    ) VALUES (
        :id_item,
        :id_empresa,
        :producto_ref,
        :etiqueta,
        :estado,
        :descripcion,
        :url_publica,
        :peso,
        :longitud,
        :anchura,
        :altura,
        :superficie,
        :volumen,
        :nomenclatura_aduanera,
        :nota_interna,
        :precio_venta,
        :precio_minimo,
        :impuesto_id,
        :created_at,
        :updated_at,
        :inventariable,
        :duration_value,
        :mandatory_periods,
        :created_by,
        :updated_by,
        :id_pais,
        :id_provincia,
        :poblacion,
        :id_unidad_medida,
        :id_unidad_peso,
        :id_unidad_longitud,
        :id_unidad_superficie,
        :id_unidad_volumen,
        :codigo_barras,
        :precio_compra,
        :stock_minimo_alerta,
        :stock_deseado,
        :id_almacen_defecto,
        :id_categoria_item,
        :id_estado_venta,
        :id_estado_compra,
        :id_tipo_control_caducidad,
        :id_tipo_item,
        :id_duration_unit,
        :id_tipo_control_inventario,
        :id_naturaleza_item,
        :id_tipo_comportamiento,
        :id_cuenta_venta,
        :id_cuenta_venta_intracomunitaria,
        :id_cuenta_venta_exportacion,
        :id_cuenta_compra,
        :id_cuenta_compra_intracomunitaria,
        :id_cuenta_compra_importacion
    )
    """
)


def create_item_row(row: Dict[str, Any]) -> str:
    """
    Crea una fila con ORM SQLAlchemy (migración controlada solo para creación).
    Mantiene contrato de salida (id_item) y transacción equivalente.
    """
    now = datetime.now(timezone.utc)
    try:
        item = Item(
            id_item=str(row.get("id_item") or str(uuid.uuid4())),
            id_empresa=row.get("id_empresa"),
            producto_ref=row.get("producto_ref"),
            etiqueta=row.get("etiqueta"),
            estado=row.get("estado") if row.get("estado") is not None else True,
            descripcion=row.get("descripcion"),
            url_publica=row.get("url_publica"),
            peso=row.get("peso"),
            longitud=row.get("longitud"),
            anchura=row.get("anchura"),
            altura=row.get("altura"),
            superficie=row.get("superficie"),
            volumen=row.get("volumen"),
            nomenclatura_aduanera=row.get("nomenclatura_aduanera"),
            nota_interna=row.get("nota_interna"),
            precio_venta=row.get("precio_venta"),
            precio_minimo=row.get("precio_minimo"),
            impuesto_id=row.get("impuesto_id"),
            created_at=row.get("created_at") or now,
            updated_at=row.get("updated_at") or now,
            inventariable=row.get("inventariable") if row.get("inventariable") is not None else True,
            duration_value=row.get("duration_value"),
            mandatory_periods=row.get("mandatory_periods") if row.get("mandatory_periods") is not None else False,
            created_by=row.get("created_by"),
            updated_by=row.get("updated_by"),
            id_pais=row.get("id_pais"),
            id_provincia=row.get("id_provincia"),
            poblacion=row.get("poblacion"),
            id_unidad_medida=row.get("id_unidad_medida"),
            id_unidad_peso=row.get("id_unidad_peso"),
            id_unidad_longitud=row.get("id_unidad_longitud"),
            id_unidad_superficie=row.get("id_unidad_superficie"),
            id_unidad_volumen=row.get("id_unidad_volumen"),
            codigo_barras=row.get("codigo_barras"),
            precio_compra=row.get("precio_compra"),
            stock_minimo_alerta=row.get("stock_minimo_alerta"),
            stock_deseado=row.get("stock_deseado"),
            id_almacen_defecto=row.get("id_almacen_defecto"),
            id_categoria_item=row.get("id_categoria_item"),
            id_estado_venta=row.get("id_estado_venta"),
            id_estado_compra=row.get("id_estado_compra"),
            id_tipo_control_caducidad=row.get("id_tipo_control_caducidad"),
            id_tipo_item=row.get("id_tipo_item"),
            id_duration_unit=row.get("id_duration_unit"),
            id_tipo_control_inventario=row.get("id_tipo_control_inventario"),
            id_naturaleza_item=row.get("id_naturaleza_item"),
            id_tipo_comportamiento=row.get("id_tipo_comportamiento"),
            id_cuenta_venta=row.get("id_cuenta_venta"),
            id_cuenta_venta_intracomunitaria=row.get("id_cuenta_venta_intracomunitaria"),
            id_cuenta_venta_exportacion=row.get("id_cuenta_venta_exportacion"),
            id_cuenta_compra=row.get("id_cuenta_compra"),
            id_cuenta_compra_intracomunitaria=row.get("id_cuenta_compra_intracomunitaria"),
            id_cuenta_compra_importacion=row.get("id_cuenta_compra_importacion"),
        )
        db.session.add(item)
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise
    return str(item.id_item)


UPDATE_SQL = text(
    """
    UPDATE public.item SET
        id_empresa = :id_empresa,
        producto_ref = :producto_ref,
        etiqueta = :etiqueta,
        estado = :estado,
        descripcion = :descripcion,
        url_publica = :url_publica,
        peso = :peso,
        longitud = :longitud,
        anchura = :anchura,
        altura = :altura,
        superficie = :superficie,
        volumen = :volumen,
        nomenclatura_aduanera = :nomenclatura_aduanera,
        nota_interna = :nota_interna,
        precio_venta = :precio_venta,
        precio_minimo = :precio_minimo,
        impuesto_id = :impuesto_id,
        inventariable = :inventariable,
        duration_value = :duration_value,
        mandatory_periods = :mandatory_periods,
        updated_at = :updated_at,
        updated_by = :updated_by,
        id_pais = :id_pais,
        id_provincia = :id_provincia,
        poblacion = :poblacion,
        id_unidad_medida = :id_unidad_medida,
        id_unidad_peso = :id_unidad_peso,
        id_unidad_longitud = :id_unidad_longitud,
        id_unidad_superficie = :id_unidad_superficie,
        id_unidad_volumen = :id_unidad_volumen,
        codigo_barras = :codigo_barras,
        precio_compra = :precio_compra,
        stock_minimo_alerta = :stock_minimo_alerta,
        stock_deseado = :stock_deseado,
        id_almacen_defecto = :id_almacen_defecto,
        id_categoria_item = :id_categoria_item,
        id_estado_venta = :id_estado_venta,
        id_estado_compra = :id_estado_compra,
        id_tipo_control_caducidad = :id_tipo_control_caducidad,
        id_tipo_item = :id_tipo_item,
        id_duration_unit = :id_duration_unit,
        id_tipo_control_inventario = :id_tipo_control_inventario,
        id_naturaleza_item = :id_naturaleza_item,
        id_tipo_comportamiento = :id_tipo_comportamiento,
        id_cuenta_venta = :id_cuenta_venta,
        id_cuenta_venta_intracomunitaria = :id_cuenta_venta_intracomunitaria,
        id_cuenta_venta_exportacion = :id_cuenta_venta_exportacion,
        id_cuenta_compra = :id_cuenta_compra,
        id_cuenta_compra_intracomunitaria = :id_cuenta_compra_intracomunitaria,
        id_cuenta_compra_importacion = :id_cuenta_compra_importacion
    WHERE id_item = CAST(:id_item AS uuid)
      AND id_empresa = CAST(:id_empresa AS uuid)
    """
)


_UPDATE_PARAM_KEYS = (
    "id_item",
    "id_empresa",
    "producto_ref",
    "etiqueta",
    "estado",
    "descripcion",
    "url_publica",
    "peso",
    "longitud",
    "anchura",
    "altura",
    "superficie",
    "volumen",
    "nomenclatura_aduanera",
    "nota_interna",
    "precio_venta",
    "precio_minimo",
    "impuesto_id",
    "inventariable",
    "duration_value",
    "mandatory_periods",
    "updated_at",
    "updated_by",
    "id_pais",
    "id_provincia",
    "poblacion",
    "id_unidad_medida",
    "id_unidad_peso",
    "id_unidad_longitud",
    "id_unidad_superficie",
    "id_unidad_volumen",
    "codigo_barras",
    "precio_compra",
    "stock_minimo_alerta",
    "stock_deseado",
    "id_almacen_defecto",
    "id_categoria_item",
    "id_estado_venta",
    "id_estado_compra",
    "id_tipo_control_caducidad",
    "id_tipo_item",
    "id_duration_unit",
    "id_tipo_control_inventario",
    "id_naturaleza_item",
    "id_tipo_comportamiento",
    "id_cuenta_venta",
    "id_cuenta_venta_intracomunitaria",
    "id_cuenta_venta_exportacion",
    "id_cuenta_compra",
    "id_cuenta_compra_intracomunitaria",
    "id_cuenta_compra_importacion",
)


def update_item_row(row: Dict[str, Any]) -> int:
    """
    Actualiza la fila indicada. Aísla por id_item + id_empresa (mismo criterio que el alta).
    No modifica created_at ni created_by.
    """
    now = datetime.now(timezone.utc)
    params = {k: row.get(k) for k in _UPDATE_PARAM_KEYS}
    params["updated_at"] = now
    try:
        result = db.session.execute(UPDATE_SQL, params)
        db.session.commit()
        return int(result.rowcount or 0)
    except Exception:
        db.session.rollback()
        raise
