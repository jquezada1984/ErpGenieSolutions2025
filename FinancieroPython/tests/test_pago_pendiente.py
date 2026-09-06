"""Pago: monto no puede superar pendiente de factura VALIDADA (mock DB)."""
from __future__ import annotations

from decimal import Decimal
from types import SimpleNamespace

import pytest
from marshmallow import ValidationError

from services import pago_service as ps


def test_validar_aplicaciones_rechaza_monto_mayor_que_pendiente(mocker):
    mocker.patch.object(
        ps,
        'db',
        SimpleNamespace(
            session=SimpleNamespace(
                execute=mocker.Mock(
                    return_value=SimpleNamespace(
                        mappings=lambda: SimpleNamespace(
                            first=lambda: {
                                'id_factura': 'f1',
                                'estado': 'VALIDADA',
                                'id_tercero': 't1',
                            }
                        )
                    )
                )
            )
        ),
    )
    mocker.patch.object(ps, '_pendiente_factura', return_value=Decimal('10.00'))

    with pytest.raises(ValidationError) as exc:
        ps._validar_aplicaciones(
            id_empresa='e1',
            id_tercero='t1',
            aplicaciones=[{'id_factura': 'f1', 'monto_aplicado': '15.00'}],
            es_cobro=True,
        )
    msg = str(exc.value.messages)
    assert 'supera pendiente' in msg


def test_validar_aplicaciones_acepta_monto_igual_pendiente(mocker):
    mocker.patch.object(
        ps,
        'db',
        SimpleNamespace(
            session=SimpleNamespace(
                execute=mocker.Mock(
                    return_value=SimpleNamespace(
                        mappings=lambda: SimpleNamespace(
                            first=lambda: {
                                'id_factura': 'f1',
                                'estado': 'VALIDADA',
                                'id_tercero': 't1',
                            }
                        )
                    )
                )
            )
        ),
    )
    mocker.patch.object(ps, '_pendiente_factura', return_value=Decimal('15.00'))

    total = ps._validar_aplicaciones(
        id_empresa='e1',
        id_tercero='t1',
        aplicaciones=[{'id_factura': 'f1', 'monto_aplicado': '15.00'}],
        es_cobro=True,
    )
    assert total == Decimal('15.00')
