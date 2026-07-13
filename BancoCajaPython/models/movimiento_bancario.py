from sqlalchemy.sql import func

import uuid



from utils.db import db

from models.pg_uuid import PGUUID





class MovimientoBancario(db.Model):

    __tablename__ = 'movimiento_bancario'



    id_movimiento_bancario = db.Column(

        PGUUID,

        primary_key=True,

        default=lambda: str(uuid.uuid4()),

    )

    id_empresa = db.Column(PGUUID, nullable=False)

    id_cuenta_bancaria = db.Column(

        PGUUID, db.ForeignKey('cuenta_bancaria.id_cuenta_bancaria'), nullable=False,

    )

    fecha_movimiento = db.Column(db.Date, nullable=False)

    numero_documento = db.Column(db.String(100))

    concepto = db.Column(db.Text)

    tipo_movimiento = db.Column(db.String(30))

    monto = db.Column(db.Numeric(15, 2), nullable=False)

    saldo_anterior = db.Column(db.Numeric(15, 2))

    saldo_nuevo = db.Column(db.Numeric(15, 2))

    conciliado = db.Column(db.Boolean, default=False, nullable=False)

    id_conciliacion_bancaria = db.Column(PGUUID)

    id_asiento_contable = db.Column(PGUUID)

    id_transferencia_bancaria = db.Column(

        PGUUID, db.ForeignKey('transferencia_bancaria.id_transferencia_bancaria'),

    )

    id_movimiento_reversado = db.Column(PGUUID)

    created_at = db.Column(db.DateTime, server_default=func.now())

