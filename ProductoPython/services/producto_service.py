from sqlalchemy.exc import IntegrityError
from marshmallow import ValidationError

from schemas.producto_schema import (
    ProductoCreateSchema,
    ProductoUpdateSchema,
    ProductoOutSchema,
)
from repositories.producto_repository import (
    create_producto,
    update_producto,
    delete_producto,
)

create_schema = ProductoCreateSchema()
update_schema = ProductoUpdateSchema()
out_schema = ProductoOutSchema()


def _is_unique_violation_producto_ref(e: IntegrityError) -> bool:
    orig = getattr(e, "orig", None)
    pgcode = getattr(orig, "pgcode", None)
    msg = str(orig).lower() if orig else str(e).lower()

    return (pgcode == "23505") and (
        "ux_producto_empresa_ref" in msg or "producto_ref" in msg
    )


def servicio_crear_producto(payload: dict):
    if not payload.get("id_empresa"):
        raise ValidationError({"id_empresa": ["id_empresa es obligatorio (se toma del token)."]})

    data = create_schema.load(payload)

    try:
        producto = create_producto(data)
    except IntegrityError as e:
        if _is_unique_violation_producto_ref(e):
            raise ValidationError(
                {"producto_ref": ["Ya existe un producto con esa referencia para esta empresa."]}
            )
        raise

    return out_schema.dump(producto)


def servicio_actualizar_producto(id_empresa, id_producto, payload: dict):
    data = update_schema.load(payload, partial=True)

    try:
        producto = update_producto(
            id_empresa=id_empresa,
            id_producto=id_producto,
            data=data,
        )
    except IntegrityError as e:
        if _is_unique_violation_producto_ref(e):
            raise ValidationError(
                {"producto_ref": ["Ya existe un producto con esa referencia para esta empresa."]}
            )
        raise

    if not producto:
        return None

    return out_schema.dump(producto)


def servicio_eliminar_producto(id_empresa, id_producto) -> bool:
    return delete_producto(id_empresa=id_empresa, id_producto=id_producto)
