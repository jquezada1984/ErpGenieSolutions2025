import uuid

from sqlalchemy.sql import func

from utils.db import db
from models.pg_uuid import PGUUID


class CategoriaGasto(db.Model):
    __tablename__ = 'categoria_gasto'

    id_categoria_gasto = db.Column(
        PGUUID, primary_key=True, default=lambda: str(uuid.uuid4()),
    )
    id_empresa = db.Column(PGUUID, nullable=False)
    codigo = db.Column(db.String(20), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False,
    )
