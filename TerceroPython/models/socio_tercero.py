from utils.db import db
import uuid

# Imports de referencia para asegurar registro de tablas relacionadas
from .socio import Socio
from .tercero import Tercero


class SocioTercero(db.Model):
    __tablename__ = 'socio_tercero'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_socio = db.Column(db.String(36), db.ForeignKey('socio.id_socio'), nullable=False)
    id_tercero = db.Column(db.String(36), db.ForeignKey('tercero.id_tercero'), nullable=False)
