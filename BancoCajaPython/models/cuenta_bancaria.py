from sqlalchemy.sql import func
import uuid

from utils.db import db

TIPOS_CUENTA_VALIDOS = ('ahorro', 'corriente', 'caja_efectivo')


class CuentaBancaria(db.Model):
    __tablename__ = 'cuenta_bancaria'

    id_cuenta_bancaria = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_empresa = db.Column(db.String(36), nullable=False)
    id_banco = db.Column(db.String(36), db.ForeignKey('banco.id_banco'), nullable=False)
    numero_cuenta = db.Column(db.String(50), nullable=False)
    tipo_cuenta = db.Column(db.String(20), nullable=False)
    id_moneda = db.Column(db.String(36), nullable=False)
    id_cuenta_contable = db.Column(db.String(36))
    saldo_inicial = db.Column(db.Numeric(15, 2), default=0)
    saldo_actual = db.Column(db.Numeric(15, 2), default=0)
    estado = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())
    created_by = db.Column(db.String(36))
    updated_by = db.Column(db.String(36))
    id_tercero = db.Column(db.String(36))
    referencia = db.Column(db.String(50))
    etiqueta_cuenta = db.Column(db.String(255))
    estado_cuenta = db.Column(db.String(20), default='abierta')
    id_pais = db.Column(db.String(36))
    id_provincia = db.Column(db.String(36))
    direccion_banco = db.Column(db.Text)
    web = db.Column(db.String(500))
    comentario = db.Column(db.Text)
    comentario_html = db.Column(db.Text)
    fecha_saldo_inicial = db.Column(db.Date)
    saldo_minimo_autorizado = db.Column(db.Numeric(15, 2), default=0)
    saldo_minimo_deseado = db.Column(db.Numeric(15, 2), default=0)
    iban = db.Column(db.String(50))
    bic_swift = db.Column(db.String(20))
    codigo_contable = db.Column(db.String(50))
