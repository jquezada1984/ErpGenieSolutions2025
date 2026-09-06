"""Contrato de mapeo utils.sp: wrappers llaman SELECT sp_* y parsean JSON (DB mock)."""
from __future__ import annotations

import json

import pytest

from utils import sp as sp_mod


class _FakeResult:
    def __init__(self, row):
        self._row = row

    def fetchone(self):
        return self._row


@pytest.fixture
def fake_db(mocker):
    session = mocker.Mock()
    session.commit = mocker.Mock()
    session.rollback = mocker.Mock()
    mocker.patch.object(sp_mod.db, 'session', session)
    return session


def test_exec_select_json_parsea_str_json(fake_db):
    fake_db.execute.return_value = _FakeResult((json.dumps({'id': 'a1'}),))
    out = sp_mod._exec_select_json('SELECT sp_x(:p)', {'p': '1'})
    assert out == {'id': 'a1'}
    fake_db.commit.assert_called_once()


def test_exec_select_json_dict_y_list(fake_db):
    fake_db.execute.return_value = _FakeResult(({'ok': True},))
    assert sp_mod._exec_select_json('SELECT 1', {}) == {'ok': True}
    fake_db.execute.return_value = _FakeResult(([1, 2],))
    assert sp_mod._exec_select_json('SELECT 1', {}) == [1, 2]


def test_exec_select_json_serializa_dict_params(fake_db):
    fake_db.execute.return_value = _FakeResult(('plain',))
    sp_mod._exec_select_json('SELECT 1', {'p_lineas': [{'a': 1}], 'p_x': 'y'})
    bind = fake_db.execute.call_args[0][1]
    assert json.loads(bind['p_lineas']) == [{'a': 1}]
    assert bind['p_x'] == 'y'


def test_exec_select_json_none_empty_row_rollback(fake_db):
    fake_db.execute.return_value = _FakeResult((None,))
    assert sp_mod._exec_select_json('SELECT 1', {}) is None

    fake_db.execute.return_value = _FakeResult(None)
    assert sp_mod._exec_select_json('SELECT 1', {}) is None

    fake_db.execute.side_effect = RuntimeError('db down')
    with pytest.raises(RuntimeError):
        sp_mod._exec_select_json('SELECT 1', {})
    fake_db.rollback.assert_called()


def _minimal_params():
    return {
        'p_id_empresa': 'emp-1',
        'p_almacen_ref': 'R',
        'p_nombre': 'N',
        'p_descripcion': None,
        'p_direccion': None,
        'p_codigo_postal': None,
        'p_poblacion': None,
        'p_id_pais': None,
        'p_id_provincia': None,
        'p_telefono': None,
        'p_fax': None,
        'p_user_id': None,
        'p_id_almacen': 'a1',
        'p_estado': True,
        'p_id_item': 'i1',
        'p_stock_fisico': 1,
        'p_stock_reservado': 0,
        'p_stock_alerta': 0,
        'p_stock_deseado': 0,
        'p_tipo_movimiento': 'ENTRADA',
        'p_cantidad': 1,
        'p_costo_unitario': 0,
        'p_fecha_movimiento': None,
        'p_referencia': None,
        'p_concepto': None,
        'p_modulo_origen': None,
        'p_id_origen': None,
        'p_id_almacen_destino': None,
        'p_id_lote_serie': None,
        'p_permitir_negativo': False,
        'p_transferencia_ref': 'T',
        'p_id_almacen_origen': 'a1',
        'p_fecha_transferencia': None,
        'p_observacion': None,
        'p_lineas': [],
        'p_id_transferencia_stock': 't1',
        'p_id_cambio_masivo_stock': 'c1',
        'p_id_inventario': 'inv1',
        'p_codigo_lote_serie': 'L1',
        'p_fecha_limite_venta': None,
        'p_fecha_caducidad': None,
        'p_cantidad_actual': 0,
        'p_fecha': '2026-09-01',
    }


def test_todos_wrappers_invocan_sp_nombrado(fake_db):
    """Contrato: cada wrapper usa SELECT sp_<nombre>(...) con p_id_empresa."""
    p = _minimal_params()
    calls = [
        (sp_mod.sp_almacen_crear, 'sp_almacen_crear'),
        (sp_mod.sp_almacen_actualizar, 'sp_almacen_actualizar'),
        (sp_mod.sp_stock_saldo_upsert, 'sp_stock_saldo_upsert'),
        (sp_mod.sp_movimiento_inventario_crear, 'sp_movimiento_inventario_crear'),
        (sp_mod.sp_transferencia_stock_crear, 'sp_transferencia_stock_crear'),
        (sp_mod.sp_transferencia_stock_completar, 'sp_transferencia_stock_completar'),
        (sp_mod.sp_cambio_masivo_crear, 'sp_cambio_masivo_crear'),
        (sp_mod.sp_cambio_masivo_completar, 'sp_cambio_masivo_completar'),
        (sp_mod.sp_inventario_cerrar, 'sp_inventario_cerrar'),
        (sp_mod.sp_lote_serie_upsert, 'sp_lote_serie_upsert'),
        (sp_mod.sp_stock_a_fecha, 'sp_stock_a_fecha'),
        (sp_mod.sp_stock_reposicion, 'sp_stock_reposicion'),
        (sp_mod.sp_stock_valoracion_pmp, 'sp_stock_valoracion_pmp'),
    ]
    for fn, name in calls:
        fake_db.execute.reset_mock()
        fake_db.execute.return_value = _FakeResult(({'ok': True},))
        assert fn(p) == {'ok': True}
        sql = str(fake_db.execute.call_args[0][0])
        assert name in sql
        assert fake_db.execute.call_args[0][1]['p_id_empresa'] == 'emp-1'
