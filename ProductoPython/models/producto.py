from utils.db import db
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func


class Producto(db.Model):
    __tablename__ = "producto"
    __table_args__ = {"schema": "public"}

    id_producto = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=db.text("gen_random_uuid()")
    )

    # ✅ NUEVO: multiempresa (en tu BD es uuid NOT NULL)
    id_empresa = db.Column(
        UUID(as_uuid=True),
        nullable=False,
        index=True
    )
    # Si tienes modelo Empresa, luego puedes poner ForeignKey:
    # db.ForeignKey("public.empresa.id_empresa")

    # ❗ Ya NO es unique global (ahora es unique compuesto en BD con id_empresa)
    producto_ref = db.Column(db.String(100), nullable=False)

    etiqueta = db.Column(db.String(100))
    estado_venta = db.Column(db.String(50))
    estado_compra = db.Column(db.String(50))
    estado = db.Column(db.Boolean, nullable=False, server_default=db.text("true"))
    descripcion = db.Column(db.Text)
    url_publica = db.Column(db.Text)
    naturaleza = db.Column(db.String(50))

    peso = db.Column(db.Numeric(10, 2))
    longitud = db.Column(db.Numeric(10, 2))
    anchura = db.Column(db.Numeric(10, 2))
    altura = db.Column(db.Numeric(10, 2))
    unidad_longitud = db.Column(db.String(10))

    superficie = db.Column(db.Numeric(10, 2))
    unidad_superficie = db.Column(db.String(10))

    volumen = db.Column(db.Numeric(10, 2))
    unidad_volumen = db.Column(db.String(10))

    nomenclatura_aduanera = db.Column(db.String(50))
    pais_origen = db.Column(db.String(100))
    provincia_origen = db.Column(db.String(100))

    nota_interna = db.Column(db.Text)

    precio_venta = db.Column(db.Numeric(12, 2))
    precio_minimo = db.Column(db.Numeric(12, 2))

    impuesto_id = db.Column(
        db.Integer,
        db.ForeignKey("public.impuestos.id"),
        nullable=True
    )

    contabilidad_venta = db.Column(db.String(20))
    contabilidad_exportacion = db.Column(db.String(20))
    contabilidad_compra = db.Column(db.String(20))
    contabilidad_importacion = db.Column(db.String(20))

    created_at = db.Column(
        db.DateTime,
        server_default=func.now(),
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    def __repr__(self):
        return f"<Producto {self.id_empresa} {self.producto_ref}>"
