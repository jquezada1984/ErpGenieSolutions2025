"""Strip / fuerza de scope_acceso (caller EMPRESA no puede crear GLOBAL)."""

from utils.usuario_scope import apply_scope_on_create, apply_scope_on_update


def test_create_caller_empresa_fuerza_empresa():
    out = apply_scope_on_create({'username': 'a', 'scope_acceso': 'GLOBAL'}, False)
    assert out['scope_acceso'] == 'EMPRESA'


def test_create_caller_global_conserva_global():
    out = apply_scope_on_create({'username': 'a', 'scope_acceso': 'GLOBAL'}, True)
    assert out['scope_acceso'] == 'GLOBAL'


def test_create_caller_global_default_empresa_si_falta():
    out = apply_scope_on_create({'username': 'a'}, True)
    assert out['scope_acceso'] == 'EMPRESA'


def test_update_caller_empresa_quita_scope():
    out = apply_scope_on_update({'nombre_completo': 'X', 'scope_acceso': 'GLOBAL'}, False)
    assert 'scope_acceso' not in out
    assert out['nombre_completo'] == 'X'


def test_update_caller_global_conserva_scope():
    out = apply_scope_on_update({'scope_acceso': 'GLOBAL'}, True)
    assert out['scope_acceso'] == 'GLOBAL'
