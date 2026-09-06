"""Tests de procesar_evento con HTTP mockeado."""
from __future__ import annotations

import pytest

import worker


def test_factura_validada_llama_procesar_factura(mocker):
    post = mocker.patch.object(worker, '_post', return_value={'ok': True})
    worker.procesar_evento(
        {
            'event': 'financiero.factura.validada',
            'id_empresa': 'emp-1',
            'id_factura': 'fac-1',
            'tipo': 'cliente',
        }
    )
    post.assert_called_once_with(
        '/api/transferencia-contable/procesar-factura',
        'emp-1',
        {'id_factura': 'fac-1', 'tipo': 'cliente'},
    )


def test_pago_registrado(mocker):
    post = mocker.patch.object(worker, '_post', return_value={})
    worker.procesar_evento(
        {
            'event': 'financiero.pago.registrado',
            'id_empresa': 'emp-1',
            'id_pago': 'pago-1',
        }
    )
    post.assert_called_once_with(
        '/api/transferencia-contable/procesar-pago',
        'emp-1',
        {'id_pago': 'pago-1'},
    )


def test_ajuste_inventario(mocker):
    post = mocker.patch.object(worker, '_post', return_value={'asiento': 1})
    worker.procesar_evento(
        {
            'event': 'inventario.ajuste.registrado',
            'id_empresa': 'emp-1',
            'id_origen': 'inv-9',
            'movimientos': [{'id': 1}],
            'modulo_origen': 'AJUSTE_STOCK',
        }
    )
    post.assert_called_once()
    args = post.call_args
    assert args[0][0] == '/api/transferencia-contable/procesar-ajuste-inventario'
    assert args[0][1] == 'emp-1'
    assert args[0][2]['id_origen'] == 'inv-9'


def test_sin_id_empresa_falla():
    with pytest.raises(ValueError, match='id_empresa'):
        worker.procesar_evento({'event': 'financiero.factura.validada', 'id_factura': 'x'})


def test_evento_ignorado_no_llama_http(mocker):
    post = mocker.patch.object(worker, '_post')
    worker.procesar_evento({'event': 'otro.evento', 'id_empresa': 'emp-1'})
    post.assert_not_called()


def test_ajuste_sin_id_origen_falla(mocker):
    mocker.patch.object(worker, '_post')
    with pytest.raises(ValueError, match='id_origen'):
        worker.procesar_evento(
            {'event': 'inventario.ajuste.registrado', 'id_empresa': 'emp-1'}
        )


def test_pago_sin_id_pago_falla(mocker):
    mocker.patch.object(worker, '_post')
    with pytest.raises(ValueError, match='id_pago'):
        worker.procesar_evento(
            {'event': 'financiero.pago.registrado', 'id_empresa': 'emp-1'}
        )


def test_factura_sin_id_factura_falla(mocker):
    mocker.patch.object(worker, '_post')
    with pytest.raises(ValueError, match='id_factura'):
        worker.procesar_evento(
            {'event': 'financiero.factura.validada', 'id_empresa': 'emp-1'}
        )


def test_post_ok(mocker):
    resp = mocker.Mock(status_code=200, content=b'{"ok":true}')
    resp.json.return_value = {'ok': True}
    mocker.patch.object(worker.requests, 'post', return_value=resp)
    assert worker._post('/api/x', 'emp-1', {'a': 1}) == {'ok': True}


def test_post_error_http(mocker):
    resp = mocker.Mock(status_code=500, content=b'err', text='boom')
    mocker.patch.object(worker.requests, 'post', return_value=resp)
    with pytest.raises(RuntimeError, match='500'):
        worker._post('/api/x', 'emp-1', {})


def test_on_message_ack(mocker):
    mocker.patch.object(worker, 'procesar_evento')
    channel = mocker.Mock()
    method = mocker.Mock(delivery_tag=7)
    body = b'{"event":"x","id_empresa":"e1"}'
    worker.on_message(channel, method, None, body)
    channel.basic_ack.assert_called_once_with(delivery_tag=7)


def test_on_message_nack_si_falla(mocker):
    mocker.patch.object(worker, 'procesar_evento', side_effect=RuntimeError('x'))
    channel = mocker.Mock()
    method = mocker.Mock(delivery_tag=9)
    worker.on_message(channel, method, None, b'{}')
    channel.basic_nack.assert_called_once_with(delivery_tag=9, requeue=False)
