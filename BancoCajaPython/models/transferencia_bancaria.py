from sqlalchemy.sql import func

import uuid



from utils.db import db

from models.pg_uuid import PGUUID





class TransferenciaBancaria(db.Model):

    __tablename__ = 'transferencia_bancaria'



    id_transferencia_bancaria = db.Column(

        PGUUID,

        primary_key=True,

        default=lambda: str(uuid.uuid4()),

    )

    id_empresa = db.Column(PGUUID, nullable=False)

    id_cuenta_origen = db.Column(

        PGUUID, db.ForeignKey('cuenta_bancaria.id_cuenta_bancaria'), nullable=False,

    )

    id_cuenta_destino = db.Column(

        PGUUID, db.ForeignKey('cuenta_bancaria.id_cuenta_bancaria'), nullable=False,

    )

    fecha_movimiento = db.Column(db.Date, nullable=False)

    numero_documento = db.Column(db.String(100))

    concepto = db.Column(db.Text)

    tipo_movimiento = db.Column(db.String(30), nullable=False, default='transferencia_bancaria')

    monto = db.Column(db.Numeric(15, 2), nullable=False)

    estado = db.Column(db.Boolean, default=True, nullable=False)

    id_asiento_contable = db.Column(PGUUID)

    created_by = db.Column(PGUUID)

    updated_by = db.Column(PGUUID)

    created_at = db.Column(db.DateTime, server_default=func.now())

    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())

