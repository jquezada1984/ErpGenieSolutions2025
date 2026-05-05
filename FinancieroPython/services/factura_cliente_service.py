from sqlalchemy import text
from marshmallow import ValidationError
from utils.db import db
from models.factura import Factura
from schemas.factura_cliente_schema import CrearFacturaClienteBorradorSchema


def _scalar_one(session, sql, params):
    return session.execute(text(sql), params).fetchone()


def crear_factura_cliente_borrador(id_empresa: str, payload: dict) -> dict:
    schema = CrearFacturaClienteBorradorSchema()
    data = schema.load(payload)

    session = db.session

    row = _scalar_one(
        session,
        'SELECT 1 FROM tercero WHERE id_tercero = CAST(:t AS uuid) AND id_empresa = CAST(:e AS uuid)',
        {'t': str(data['id_tercero']), 'e': id_empresa},
    )
    if not row:
        raise ValidationError({'id_tercero': ['Tercero no existe o no pertenece a la empresa.']})

    if data.get('id_condicion_pago'):
        r = _scalar_one(
            session,
            'SELECT 1 FROM condicion_pago_catalogo WHERE id_condicion_pago = CAST(:id AS uuid)',
            {'id': str(data['id_condicion_pago'])},
        )
        if not r:
            raise ValidationError({'id_condicion_pago': ['Condición de pago inválida.']})

    if data.get('id_forma_pago'):
        r = _scalar_one(
            session,
            'SELECT 1 FROM forma_pago_catalogo WHERE id_forma_pago = CAST(:id AS uuid)',
            {'id': str(data['id_forma_pago'])},
        )
        if not r:
            raise ValidationError({'id_forma_pago': ['Forma de pago inválida.']})

    if data.get('id_cuenta_bancaria'):
        r = _scalar_one(
            session,
            'SELECT 1 FROM cuenta_bancaria WHERE id_cuenta_bancaria = CAST(:c AS uuid) AND id_empresa = CAST(:e AS uuid)',
            {'c': str(data['id_cuenta_bancaria']), 'e': id_empresa},
        )
        if not r:
            raise ValidationError({'id_cuenta_bancaria': ['Cuenta bancaria inválida para la empresa.']})

    if data.get('id_moneda'):
        r = _scalar_one(
            session,
            'SELECT 1 FROM moneda WHERE id_moneda = CAST(:id AS uuid)',
            {'id': str(data['id_moneda'])},
        )
        if not r:
            raise ValidationError({'id_moneda': ['Divisa inválida.']})

    categorias = data.get('categorias') or []
    if not isinstance(categorias, list):
        categorias = []

    factura = Factura(
        id_empresa=id_empresa,
        numero_factura=None,
        tipo_factura=data['tipo_factura'],
        id_tercero=str(data['id_tercero']),
        fecha_factura=data['fecha_factura'],
        fecha_vencimiento=data.get('fecha_vencimiento'),
        subtotal=None,
        total_impuestos=0,
        total_descuentos=0,
        total_factura=None,
        estado='BORRADOR',
        id_condicion_pago=str(data['id_condicion_pago']) if data.get('id_condicion_pago') else None,
        id_forma_pago=str(data['id_forma_pago']) if data.get('id_forma_pago') else None,
        id_cuenta_bancaria=str(data['id_cuenta_bancaria']) if data.get('id_cuenta_bancaria') else None,
        origen=data.get('origen'),
        id_proyecto=str(data['id_proyecto']) if data.get('id_proyecto') else None,
        categorias=categorias,
        plantilla_documento=data.get('plantilla_documento') or 'crabe',
        id_moneda=str(data['id_moneda']) if data.get('id_moneda') else None,
        nota_publica=data.get('nota_publica'),
        nota_privada=data.get('nota_privada'),
    )

    session.add(factura)
    session.commit()

    return {
        'id_factura': factura.id_factura,
        'estado': factura.estado,
        'numero_factura': factura.numero_factura,
    }
