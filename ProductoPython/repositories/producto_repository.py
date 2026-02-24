from typing import Optional
from sqlalchemy.exc import IntegrityError
from utils.db import db
from models.producto import Producto


def create_producto(payload: dict) -> Producto:
    """
    Espera que payload ya incluya id_empresa (inyectado desde JWT o contexto).
    """
    producto = Producto(**payload)
    db.session.add(producto)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise
    return producto


def update_producto(id_empresa, id_producto, data: dict) -> Optional[Producto]:
    """
    Actualiza solo si el producto pertenece a la empresa (multiempresa).
    """
    producto = (
        Producto.query
        .filter(Producto.id_empresa == id_empresa, Producto.id_producto == id_producto)
        .first()
    )
    if not producto:
        return None

    for k, v in data.items():
        setattr(producto, k, v)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise

    return producto


def delete_producto(id_empresa, id_producto) -> bool:
    """
    Elimina solo si el producto pertenece a la empresa (multiempresa).
    """
    producto = (
        Producto.query
        .filter(Producto.id_empresa == id_empresa, Producto.id_producto == id_producto)
        .first()
    )
    if not producto:
        return False

    db.session.delete(producto)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise

    return True
