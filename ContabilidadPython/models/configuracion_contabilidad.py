from utils.db import db
from sqlalchemy.sql import func

class ConfiguracionContabilidad(db.Model):
    __tablename__ = 'configuracion_contabilidad'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    empresa_id = db.Column(db.Integer, nullable=False)
    moneda_base_id = db.Column(db.Integer, nullable=False)
    formato_cuenta = db.Column(db.String(20), nullable=False, default='XXXX-XXXX-XXXX')
    separador_cuenta = db.Column(db.String(5), nullable=False, default='-')
    longitud_nivel = db.Column(db.Integer, nullable=False, default=4)
    usar_centavos = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
