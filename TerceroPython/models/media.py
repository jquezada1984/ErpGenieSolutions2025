import uuid
from datetime import datetime

from utils.db import db


class Media(db.Model):
    __tablename__ = 'media'

    id_media = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    module = db.Column(db.String(50), nullable=False)
    module_id = db.Column(db.String(36), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    filename = db.Column(db.String(255))
    mimetype = db.Column(db.String(100))
    size = db.Column(db.Integer)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True))
