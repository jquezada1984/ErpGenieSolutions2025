from utils.db import db

class Impuesto(db.Model):
    __tablename__ = "impuestos"
    __table_args__ = {"schema": "public"}

    id = db.Column(db.Integer, primary_key=True)
