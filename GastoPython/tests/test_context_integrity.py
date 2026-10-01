"""Tests unitarios: contexto, IntegrityError mapping, auditoría create/update."""
import uuid
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest
from sqlalchemy.exc import IntegrityError

from utils.context import require_user_id, resolve_id_empresa
from utils.integrity import map_integrity_error


VALID_USER = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
VALID_EMPRESA = '11111111-2222-3333-4444-555555555555'


def test_require_user_id_faltante():
    with pytest.raises(ValueError, match='Falta X-User-Id'):
        require_user_id(None)
    with pytest.raises(ValueError, match='Falta X-User-Id'):
        require_user_id('')
    with pytest.raises(ValueError, match='Falta X-User-Id'):
        require_user_id('   ')


def test_require_user_id_invalido():
    with pytest.raises(ValueError, match='UUID'):
        require_user_id('no-es-uuid')
    with pytest.raises(ValueError, match='UUID'):
        require_user_id('12345')


def test_require_user_id_valido():
    assert require_user_id(VALID_USER) == VALID_USER
    assert require_user_id(VALID_USER.upper()) == VALID_USER.upper()


def _fake_integrity(pgcode: str, constraint_name: str | None = None) -> IntegrityError:
    diag = SimpleNamespace(constraint_name=constraint_name)
    orig = SimpleNamespace(pgcode=pgcode, diag=diag)
    return IntegrityError('stmt', {}, orig)


def test_map_integrity_categoria_codigo():
    status, msg = map_integrity_error(
        _fake_integrity('23505', 'categoria_gasto_empresa_codigo_unique')
    )
    assert status == 409
    assert 'código' in msg.lower()


def test_map_integrity_categoria_nombre():
    status, msg = map_integrity_error(
        _fake_integrity('23505', 'categoria_gasto_empresa_nombre_unique')
    )
    assert status == 409
    assert 'nombre' in msg.lower()


def test_map_integrity_numero_gasto():
    status, msg = map_integrity_error(
        _fake_integrity('23505', 'gasto_empresa_numero_unique')
    )
    assert status == 409
    assert 'numeración' in msg.lower() or 'numero_gasto' in msg.lower()


def test_map_integrity_fk_y_check():
    status_fk, msg_fk = map_integrity_error(_fake_integrity('23503', 'gasto_id_tercero_fkey'))
    assert status_fk == 400
    assert 'foránea' in msg_fk.lower() or 'referencia' in msg_fk.lower()

    status_ck, msg_ck = map_integrity_error(_fake_integrity('23514', 'gasto_total_check'))
    assert status_ck == 400
    assert 'restricción' in msg_ck.lower() or 'validación' in msg_ck.lower()


def test_map_integrity_no_expone_sql():
    # Incluso si el orig tuviera texto sensible, el mensaje cliente es fijo
    orig = SimpleNamespace(
        pgcode='23505',
        diag=SimpleNamespace(constraint_name='gasto_empresa_numero_unique'),
        args=('DETAIL: Key (password)=(secret) already exists',),
    )
    exc = IntegrityError('INSERT INTO secreto', {'pwd': 'x'}, orig)
    status, msg = map_integrity_error(exc)
    assert status == 409
    assert 'secret' not in msg
    assert 'INSERT' not in msg
    assert 'password' not in msg.lower()


def test_resolve_empresa_sigue_igual():
    assert resolve_id_empresa(VALID_EMPRESA, {'id_empresa': 'other'}, 'EMPRESA') == VALID_EMPRESA


@patch('services.gasto_service.repo')
@patch('services.gasto_service.db')
@patch('services.gasto_service._load_tasas', return_value={})
@patch('services.gasto_service._validate_items')
@patch('services.gasto_service._validate_tercero')
@patch('services.gasto_service._validate_categoria')
def test_update_preserva_created_by_y_setea_updated_by(
    _cat, _ter, _items, _tasas, mock_db, mock_repo,
):
    from services.gasto_service import actualizar_gasto

    creator = str(uuid.uuid4())
    updater = str(uuid.uuid4())
    cat_id = str(uuid.uuid4())

    gasto = MagicMock()
    gasto.estado_gasto = 'BORRADOR'
    gasto.created_by = creator
    gasto.detalles = []
    mock_repo.get_gasto_by_id_empresa.return_value = gasto
    mock_repo.replace_detalles.return_value = []

    body = {
        'id_categoria_gasto': cat_id,
        'fecha_gasto': '2026-07-26',
        'concepto': 'Edit',
        'detalles': [
            {
                'descripcion': 'L1',
                'cantidad': '1',
                'precio_unitario': '10',
                'descuento': '0',
                'orden': 1,
            }
        ],
    }

    with patch('services.gasto_service._dump_gasto', return_value={'ok': True}):
        actualizar_gasto(str(uuid.uuid4()), body, VALID_EMPRESA, updater)

    assert gasto.created_by == creator
    assert gasto.updated_by == updater
    mock_db.session.commit.assert_called_once()
