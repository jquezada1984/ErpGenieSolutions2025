from utils.db import db
from sqlalchemy.sql import func

class TerceroRib(db.Model):
    __tablename__ = 'tercero_rib'
    id_rib = db.Column(db.Integer, primary_key=True)
    fk_tercero = db.Column(db.Integer, db.ForeignKey('tercero.id_tercero', ondelete='CASCADE'), nullable=False)
    datec = db.Column(db.DateTime, server_default=func.now())
    tms = db.Column(db.DateTime, server_default=func.now())
    label = db.Column(db.String(30))
    bank = db.Column(db.String(255))
    code_banque = db.Column(db.String(7))
    code_guichet = db.Column(db.String(6))
    number = db.Column(db.String(255))
    cle_rib = db.Column(db.String(5))
    bic = db.Column(db.String(11))
    iban_prefix = db.Column(db.String(34))
    domiciliation = db.Column(db.String(255)) 