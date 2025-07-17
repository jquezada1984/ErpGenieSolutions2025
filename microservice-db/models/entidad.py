from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Entidad(db.Model):
    __tablename__ = 'entidad'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False) 