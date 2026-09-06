"""stock_service propaga id_empresa al SP (mock)."""
from __future__ import annotations

from services import stock_service


def test_crear_almacen_pasa_id_empresa(mocker):
    sp = mocker.patch('services.stock_service.sp_repo.sp_almacen_crear', return_value={'id': 'a1'})
    out = stock_service.crear_almacen(
        {'almacen_ref': 'ALM-1', 'nombre': 'Principal'},
        id_empresa='emp-ctx',
        user_id='user-1',
    )
    assert out['success'] is True
    kwargs = sp.call_args[0][0]
    assert kwargs['p_id_empresa'] == 'emp-ctx'
    assert kwargs['p_almacen_ref'] == 'ALM-1'
    assert kwargs['p_user_id'] == 'user-1'


def test_actualizar_almacen_mapea_params(mocker):
    sp = mocker.patch(
        'services.stock_service.sp_repo.sp_almacen_actualizar',
        return_value={'ok': True},
    )
    stock_service.actualizar_almacen(
        'alm-9',
        {'almacen_ref': 'R', 'nombre': 'N', 'estado': True, 'id_pais': ''},
        id_empresa='emp-1',
        user_id='u1',
    )
    p = sp.call_args[0][0]
    assert p['p_id_empresa'] == 'emp-1'
    assert p['p_id_almacen'] == 'alm-9'
    assert p['p_id_pais'] is None


def test_upsert_saldo_pasa_id_empresa(mocker):
    sp = mocker.patch(
        'services.stock_service.sp_repo.sp_stock_saldo_upsert',
        return_value={},
    )
    stock_service.upsert_saldo(
        {'id_item': 'i1', 'id_almacen': 'a1', 'stock_fisico': 3},
        id_empresa='emp-s',
        user_id=None,
    )
    assert sp.call_args[0][0]['p_id_empresa'] == 'emp-s'
    assert sp.call_args[0][0]['p_stock_fisico'] == 3


def test_crear_movimiento_pasa_id_empresa(mocker):
    sp = mocker.patch(
        'services.stock_service.sp_repo.sp_movimiento_inventario_crear',
        return_value={'id_mov': 'm1'},
    )
    stock_service.crear_movimiento(
        {
            'id_item': 'item-1',
            'id_almacen': 'alm-1',
            'tipo_movimiento': 'ENTRADA',
            'cantidad': 5,
        },
        id_empresa='emp-xyz',
        user_id=None,
    )
    params = sp.call_args[0][0]
    assert params['p_id_empresa'] == 'emp-xyz'
    assert params['p_id_item'] == 'item-1'
    assert params['p_user_id'] is None


def test_crear_transferencia_mapea_lineas(mocker):
    sp = mocker.patch(
        'services.stock_service.sp_repo.sp_transferencia_stock_crear',
        return_value={'id': 't1'},
    )
    lineas = [{'id_item': 'i1', 'cantidad': 2}]
    stock_service.crear_transferencia(
        {
            'transferencia_ref': 'TR-1',
            'id_almacen_origen': 'a1',
            'id_almacen_destino': 'a2',
            'detalles': lineas,
        },
        id_empresa='emp-t',
        user_id='u',
    )
    p = sp.call_args[0][0]
    assert p['p_id_empresa'] == 'emp-t'
    assert p['p_lineas'] == lineas
    assert p['p_transferencia_ref'] == 'TR-1'


def test_completar_transferencia(mocker):
    sp = mocker.patch(
        'services.stock_service.sp_repo.sp_transferencia_stock_completar',
        return_value={},
    )
    stock_service.completar_transferencia('tr-1', {}, id_empresa='emp-1', user_id='u')
    p = sp.call_args[0][0]
    assert p['p_id_transferencia_stock'] == 'tr-1'
    assert p['p_costo_unitario'] == 0


def test_crear_cambio_masivo(mocker):
    sp = mocker.patch(
        'services.stock_service.sp_repo.sp_cambio_masivo_crear',
        return_value={'id': 'cm1'},
    )
    stock_service.crear_cambio_masivo(
        {'id_almacen': 'a1', 'lineas': [{'id_item': 'i', 'cantidad': 1}]},
        id_empresa='emp-cm',
        user_id='u',
    )
    assert sp.call_args[0][0]['p_id_empresa'] == 'emp-cm'


def test_completar_cambio_masivo_publica_rabbit(mocker):
    mocker.patch(
        'services.stock_service.sp_repo.sp_cambio_masivo_completar',
        return_value={'movimientos': [{'id': 1}]},
    )
    pub = mocker.patch('services.rabbit_publisher.publish_ajuste_inventario')
    stock_service.completar_cambio_masivo('cm-1', id_empresa='emp-1', user_id='u')
    pub.assert_called_once()
    assert pub.call_args.kwargs['id_empresa'] == 'emp-1'
    assert pub.call_args.kwargs['id_cambio_masivo_stock'] == 'cm-1'


def test_cerrar_inventario_publica_rabbit(mocker):
    mocker.patch(
        'services.stock_service.sp_repo.sp_inventario_cerrar',
        return_value={'movimientos': [{'id': 2}]},
    )
    pub = mocker.patch('services.rabbit_publisher.publish_ajuste_inventario')
    stock_service.cerrar_inventario(
        'inv-1',
        {'lineas': []},
        id_empresa='emp-1',
        user_id='u',
    )
    assert pub.call_args.kwargs['modulo_origen'] == 'AJUSTE_STOCK'


def test_upsert_lote(mocker):
    sp = mocker.patch(
        'services.stock_service.sp_repo.sp_lote_serie_upsert',
        return_value={},
    )
    stock_service.upsert_lote(
        {'id_item': 'i', 'id_almacen': 'a', 'codigo_lote_serie': ' L1 '},
        id_empresa='emp-1',
        user_id='u',
    )
    assert sp.call_args[0][0]['p_codigo_lote_serie'] == 'L1'


def test_stock_a_fecha_pasa_id_empresa(mocker):
    sp = mocker.patch(
        'services.stock_service.sp_repo.sp_stock_a_fecha',
        return_value=[],
    )
    stock_service.stock_a_fecha({'fecha': '2026-09-01'}, id_empresa='emp-99')
    assert sp.call_args[0][0]['p_id_empresa'] == 'emp-99'


def test_stock_reposicion_y_valoracion(mocker):
    r = mocker.patch(
        'services.stock_service.sp_repo.sp_stock_reposicion',
        return_value=None,
    )
    v = mocker.patch(
        'services.stock_service.sp_repo.sp_stock_valoracion_pmp',
        return_value=[{'item': 1}],
    )
    out_r = stock_service.stock_reposicion({}, id_empresa='emp-1')
    out_v = stock_service.stock_valoracion_pmp({'id_almacen': 'a1'}, id_empresa='emp-1')
    assert out_r['data'] == []
    assert out_v['data'] == [{'item': 1}]
    assert r.call_args[0][0]['p_id_empresa'] == 'emp-1'
    assert v.call_args[0][0]['p_id_almacen'] == 'a1'


def test_empty_to_none():
    from utils.sp import empty_to_none

    assert empty_to_none(None) is None
    assert empty_to_none('') is None
    assert empty_to_none('  ') is None
    assert empty_to_none('uuid') == 'uuid'
