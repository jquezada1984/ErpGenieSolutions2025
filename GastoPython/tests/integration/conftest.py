"""
Fixtures de integración PostgreSQL.

IMPORTANTE:
- Solo se activan si existe la variable de entorno TEST_DATABASE_URL.
- NUNCA usan DATABASE_URL (evitar producción accidental).
- Crean datos con UUID únicos y los limpian en teardown.
"""
from __future__ import annotations

import os
import uuid
from datetime import date

import pytest
from sqlalchemy import text


def pytest_configure(config):
    config.addinivalue_line(
        'markers', 'integration: tests contra PostgreSQL (requiere TEST_DATABASE_URL)'
    )


@pytest.fixture(scope='session')
def test_database_url():
    url = (os.environ.get('TEST_DATABASE_URL') or '').strip()
    if not url:
        pytest.skip(
            'TEST_DATABASE_URL no configurada — tests de integración omitidos '
            '(nunca se usa DATABASE_URL productiva automáticamente).'
        )
    # Seguridad: no permitir reutilizar silenciosamente DATABASE_URL
    prod = (os.environ.get('DATABASE_URL') or '').strip()
    if prod and url == prod and os.environ.get('ALLOW_TEST_ON_DATABASE_URL') != '1':
        pytest.skip(
            'TEST_DATABASE_URL coincide con DATABASE_URL. '
            'Para forzar (solo staging dedicado): ALLOW_TEST_ON_DATABASE_URL=1'
        )
    return url


@pytest.fixture(scope='session')
def app(test_database_url):
    os.environ['DATABASE_URL'] = test_database_url
    os.environ.setdefault('JWT_SECRET_KEY', 'test-secret-gasto-integration')
    os.environ.setdefault('DB_SSLMODE', os.environ.get('DB_SSLMODE', 'require'))

    from app import app as flask_app
    from utils.db import db

    flask_app.config['TESTING'] = True
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = test_database_url
    with flask_app.app_context():
        # Smoke: conectar
        db.session.execute(text('SELECT 1'))
        db.session.commit()
    yield flask_app


@pytest.fixture
def db_session(app):
    from utils.db import db

    with app.app_context():
        yield db
        db.session.rollback()


@pytest.fixture
def tracker():
    """Registra IDs creados por el test para cleanup."""
    data = {
        'gastos': [],
        'categorias': [],
        'terceros': [],
        'items': [],
        'secuencias': [],  # (id_empresa, anio)
    }
    return data


def _cleanup(db, tracker):
    """Borra solo lo creado por el test (orden FK-safe)."""
    for gid in tracker['gastos']:
        db.session.execute(
            text('DELETE FROM gasto_detalle WHERE id_gasto = :id'),
            {'id': gid},
        )
        db.session.execute(text('DELETE FROM gasto WHERE id_gasto = :id'), {'id': gid})
    for cid in tracker['categorias']:
        db.session.execute(
            text('DELETE FROM categoria_gasto WHERE id_categoria_gasto = :id'),
            {'id': cid},
        )
    for tid in tracker['terceros']:
        db.session.execute(text('DELETE FROM tercero WHERE id_tercero = :id'), {'id': tid})
    for iid in tracker['items']:
        db.session.execute(text('DELETE FROM item WHERE id_item = :id'), {'id': iid})
    for emp, anio in tracker['secuencias']:
        db.session.execute(
            text(
                'DELETE FROM gasto_secuencia WHERE id_empresa = :e AND anio = :a '
                'AND ultimo_numero = 0'
            ),
            {'e': emp, 'a': anio},
        )
        # Si el test dejó contadores >0 por gastos ya borrados, resetear fila de prueba
        db.session.execute(
            text(
                'DELETE FROM gasto_secuencia WHERE id_empresa = :e AND anio = :a'
            ),
            {'e': emp, 'a': anio},
        )
    db.session.commit()


@pytest.fixture
def cleanup(db_session, tracker):
    yield
    try:
        _cleanup(db_session, tracker)
    except Exception:
        db_session.session.rollback()
        raise


@pytest.fixture
def empresas(db_session):
    """Dos empresas existentes en la BD de testing."""
    rows = db_session.session.execute(
        text('SELECT id_empresa::text FROM empresa LIMIT 2')
    ).fetchall()
    if len(rows) < 2:
        pytest.skip('Se necesitan al menos 2 empresas en la BD de testing')
    return str(rows[0][0]), str(rows[1][0])


@pytest.fixture
def user_id(db_session):
    env_uid = (os.environ.get('TEST_USER_ID') or '').strip()
    if env_uid:
        return env_uid
    row = db_session.session.execute(
        text('SELECT id_usuario::text FROM usuario LIMIT 1')
    ).fetchone()
    if not row:
        pytest.skip('No hay usuario en BD de testing (o defina TEST_USER_ID)')
    return str(row[0])


@pytest.fixture
def make_categoria(db_session, tracker, cleanup):
    def _make(id_empresa: str, codigo: str | None = None, nombre: str | None = None):
        from services.categoria_gasto_service import crear_categoria

        suffix = uuid.uuid4().hex[:8]
        data = crear_categoria(
            {
                'codigo': codigo or f'T{suffix}'[:20],
                'nombre': nombre or f'Test Cat {suffix}',
                'descripcion': 'fixture integración',
            },
            id_empresa=id_empresa,
        )
        tracker['categorias'].append(data['id_categoria_gasto'])
        return data

    return _make


@pytest.fixture
def make_tercero(db_session, tracker, cleanup):
    def _make(id_empresa: str):
        tid = str(uuid.uuid4())
        db_session.session.execute(
            text(
                """
                INSERT INTO tercero (
                    id_tercero, id_empresa, nombre,
                    cliente_potencial, cliente, proveedor, estado
                ) VALUES (
                    :id, :emp, :nombre,
                    false, true, false, true
                )
                """
            ),
            {'id': tid, 'emp': id_empresa, 'nombre': f'Test Tercero {tid[:8]}'},
        )
        db_session.session.commit()
        tracker['terceros'].append(tid)
        return tid

    return _make


@pytest.fixture
def make_item(db_session, tracker, cleanup):
    """Clona FKs de catálogo desde un item existente hacia una empresa objetivo."""

    def _make(id_empresa: str):
        template = db_session.session.execute(
            text(
                """
                SELECT id_estado_venta::text, id_naturaleza_item::text,
                       COALESCE(producto_ref, 'REF') AS producto_ref
                FROM item
                LIMIT 1
                """
            )
        ).fetchone()
        if not template:
            pytest.skip('No hay item plantilla en BD de testing para clonar FKs')
        iid = str(uuid.uuid4())
        db_session.session.execute(
            text(
                """
                INSERT INTO item (
                    id_item, id_empresa, producto_ref, etiqueta, estado,
                    inventariable, id_estado_venta, id_naturaleza_item
                ) VALUES (
                    :id, :emp, :pref, :eti, true,
                    true, :est_v, :nat
                )
                """
            ),
            {
                'id': iid,
                'emp': id_empresa,
                'pref': f'TEST-{iid[:8]}',
                'eti': f'Item test {iid[:8]}',
                'est_v': template[0],
                'nat': template[1],
            },
        )
        db_session.session.commit()
        tracker['items'].append(iid)
        return iid

    return _make


@pytest.fixture
def anio_test():
    return 2099  # año artificial para no chocar con series reales 2026


@pytest.fixture
def fecha_test(anio_test):
    return date(anio_test, 1, 15)
