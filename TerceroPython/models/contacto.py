from datetime import datetime
from utils.db import db
import uuid


class Contacto(db.Model):
    """Modelo para contacto_direccion (contactos asociados a tercero)."""
    __tablename__ = 'contacto_direccion'

    id_contacto = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_tercero = db.Column(db.String(36), db.ForeignKey('tercero.id_tercero'), nullable=False)

    apellidos_etiqueta = db.Column(db.String(150))
    nombre = db.Column(db.String(150))
    titulo_cortesia = db.Column(db.String(50))
    puesto_trabajo = db.Column(db.String(150))
    direccion = db.Column(db.Text)
    codigo_postal = db.Column(db.String(20))
    poblacion = db.Column(db.String(100))
    id_pais = db.Column(db.String(36), db.ForeignKey('pais.id_pais'))
    provincia = db.Column(db.String(100))
    telefono_trabajo = db.Column(db.String(30))
    telefono_particular = db.Column(db.String(30))
    movil = db.Column(db.String(30))
    fax = db.Column(db.String(30))
    correo = db.Column(db.String(150))
    visibilidad = db.Column(db.String(50))
    fecha_nacimiento = db.Column(db.Date)
    alerta_cumpleanos = db.Column(db.Boolean, nullable=False, default=False)
    estado = db.Column(db.Boolean, nullable=False, default=True)

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.current_timestamp()
    )
    updated_at = db.Column(
        db.DateTime,
        onupdate=datetime.utcnow
    )
