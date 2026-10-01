"""
Casos de integración A–I contra PostgreSQL.

Requieren TEST_DATABASE_URL. Si no está definida, toda la suite se omite.
"""
from __future__ import annotations

import threading
from datetime import date
from unittest.mock import patch

import pytest
from sqlalchemy import text

pytestmark = pytest.mark.integration


def _detalle(desc='Línea', qty='1', precio='10.00', orden=1, id_item=None, id_tercero=None):
    d = {
        'descripcion': desc,
        'cantidad': qty,
        'precio_unitario': precio,
        'descuento': '0',
        'orden': orden,
        'impuesto_id': None,
    }
    if id_item:
        d['id_item'] = id_item
    return d


def test_a_create_valido(
    app, db_session, empresas, user_id, make_categoria, tracker, cleanup, fecha_test, anio_test,
):
    from services.gasto_service import crear_gasto

    emp_a, _ = empresas
    cat = make_categoria(emp_a)
    tracker['secuencias'].append((emp_a, anio_test))

    with app.app_context():
        data = crear_gasto(
            {
                'id_categoria_gasto': cat['id_categoria_gasto'],
                'fecha_gasto': fecha_test,
                'concepto': 'Integración A',
                'detalles': [
                    _detalle('L1', '1', '10', 1),
                    _detalle('L2', '2', '5.5', 2),
                ],
            },
            id_empresa=emp_a,
            user_id=user_id,
        )
        tracker['gastos'].append(data['id_gasto'])
        assert data['numero_gasto'].startswith(f'GAS-{anio_test}-')
        assert len(data['detalles']) == 2
        assert data['created_by'] == user_id
        assert data['updated_by'] == user_id
        assert data['estado_gasto'] == 'BORRADOR'


def test_b_rollback_despues_numero(
    app, db_session, empresas, user_id, make_categoria, tracker, cleanup, fecha_test, anio_test,
):
    """Fallo tras obtener numero_gasto → no gasto, no detalle, contador no avanza."""
    from repositories import gasto_repository as repo
    from services.calculo_gasto import calcular_lineas_y_cabecera

    emp_a, _ = empresas
    cat = make_categoria(emp_a)
    tracker['secuencias'].append((emp_a, anio_test))

    with app.app_context():
        before = db_session.session.execute(
            text(
                'SELECT ultimo_numero FROM gasto_secuencia '
                'WHERE id_empresa = :e AND anio = :a'
            ),
            {'e': emp_a, 'a': anio_test},
        ).fetchone()
        before_n = int(before[0]) if before else 0

        lineas, totales = calcular_lineas_y_cabecera(
            [_detalle()],
            {},
        )
        try:
            numero = repo.obtener_siguiente_numero_gasto(emp_a, fecha_test)
            assert numero.startswith(f'GAS-{anio_test}-')
            gasto = repo.create_gasto_cabecera(
                id_empresa=emp_a,
                numero_gasto=numero,
                payload={
                    'id_categoria_gasto': cat['id_categoria_gasto'],
                    'fecha_gasto': fecha_test,
                    'concepto': 'Rollback B',
                },
                totales=totales,
                user_id=user_id,
            )
            db_session.session.flush()
            raise RuntimeError('fallo forzado post-numeración')
            repo.add_detalles(str(gasto.id_gasto), lineas)  # pragma: no cover
            db_session.session.commit()  # pragma: no cover
        except RuntimeError:
            db_session.session.rollback()

        gastos = db_session.session.execute(
            text(
                "SELECT count(*) FROM gasto WHERE concepto = 'Rollback B' "
                'AND id_empresa = :e'
            ),
            {'e': emp_a},
        ).scalar()
        assert gastos == 0

        after = db_session.session.execute(
            text(
                'SELECT ultimo_numero FROM gasto_secuencia '
                'WHERE id_empresa = :e AND anio = :a'
            ),
            {'e': emp_a, 'a': anio_test},
        ).fetchone()
        after_n = int(after[0]) if after else 0
        assert after_n == before_n


def test_c_concurrencia(
    app, empresas, user_id, make_categoria, tracker, cleanup, fecha_test, anio_test,
):
    from services.gasto_service import crear_gasto

    emp_a, _ = empresas
    cat = make_categoria(emp_a)
    tracker['secuencias'].append((emp_a, anio_test))
    results = []
    errors = []

    def worker(idx):
        try:
            with app.app_context():
                data = crear_gasto(
                    {
                        'id_categoria_gasto': cat['id_categoria_gasto'],
                        'fecha_gasto': fecha_test,
                        'concepto': f'Concurrente {idx}',
                        'detalles': [_detalle(f'L{idx}')],
                    },
                    id_empresa=emp_a,
                    user_id=user_id,
                )
                results.append(data)
        except Exception as e:
            errors.append(e)

    t1 = threading.Thread(target=worker, args=(1,))
    t2 = threading.Thread(target=worker, args=(2,))
    t1.start()
    t2.start()
    t1.join()
    t2.join()

    assert not errors, f'Errores en concurrencia: {errors}'
    assert len(results) == 2
    nums = {r['numero_gasto'] for r in results}
    assert len(nums) == 2
    for r in results:
        tracker['gastos'].append(r['id_gasto'])


def test_d_multiempresa_categoria(
    app, empresas, user_id, make_categoria, tracker, cleanup, fecha_test, anio_test,
):
    from services.gasto_service import crear_gasto

    emp_a, emp_b = empresas
    cat_a = make_categoria(emp_a)
    tracker['secuencias'].append((emp_b, anio_test))

    with app.app_context():
        with pytest.raises(ValueError, match='categoría'):
            crear_gasto(
                {
                    'id_categoria_gasto': cat_a['id_categoria_gasto'],
                    'fecha_gasto': fecha_test,
                    'concepto': 'Cross cat',
                    'detalles': [_detalle()],
                },
                id_empresa=emp_b,
                user_id=user_id,
            )


def test_e_multiempresa_item(
    app, empresas, user_id, make_categoria, make_item, tracker, cleanup, fecha_test, anio_test,
):
    from services.gasto_service import crear_gasto

    emp_a, emp_b = empresas
    cat_b = make_categoria(emp_b)
    item_a = make_item(emp_a)
    tracker['secuencias'].append((emp_b, anio_test))

    with app.app_context():
        with pytest.raises(ValueError, match='ítems|items'):
            crear_gasto(
                {
                    'id_categoria_gasto': cat_b['id_categoria_gasto'],
                    'fecha_gasto': fecha_test,
                    'concepto': 'Cross item',
                    'detalles': [_detalle(id_item=item_a)],
                },
                id_empresa=emp_b,
                user_id=user_id,
            )


def test_f_multiempresa_tercero(
    app, empresas, user_id, make_categoria, make_tercero, tracker, cleanup, fecha_test, anio_test,
):
    from services.gasto_service import crear_gasto

    emp_a, emp_b = empresas
    cat_b = make_categoria(emp_b)
    ter_a = make_tercero(emp_a)
    tracker['secuencias'].append((emp_b, anio_test))

    with app.app_context():
        with pytest.raises(ValueError, match='tercero'):
            crear_gasto(
                {
                    'id_categoria_gasto': cat_b['id_categoria_gasto'],
                    'id_tercero': ter_a,
                    'fecha_gasto': fecha_test,
                    'concepto': 'Cross tercero',
                    'detalles': [_detalle()],
                },
                id_empresa=emp_b,
                user_id=user_id,
            )


def test_g_update_atomico_rollback_detalles(
    app, db_session, empresas, user_id, make_categoria, tracker, cleanup, fecha_test, anio_test,
):
    from services.gasto_service import crear_gasto, actualizar_gasto

    emp_a, _ = empresas
    cat = make_categoria(emp_a)
    tracker['secuencias'].append((emp_a, anio_test))

    with app.app_context():
        created = crear_gasto(
            {
                'id_categoria_gasto': cat['id_categoria_gasto'],
                'fecha_gasto': fecha_test,
                'concepto': 'Update atómico',
                'detalles': [
                    _detalle('Orig1', '1', '10', 1),
                    _detalle('Orig2', '1', '20', 2),
                ],
            },
            id_empresa=emp_a,
            user_id=user_id,
        )
        gid = created['id_gasto']
        tracker['gastos'].append(gid)
        orig_ids = {d['id_gasto_detalle'] for d in created['detalles']}
        assert len(orig_ids) == 2

        with patch(
            'repositories.gasto_repository.add_detalles',
            side_effect=RuntimeError('fallo replace'),
        ):
            with pytest.raises(RuntimeError, match='fallo replace'):
                actualizar_gasto(
                    gid,
                    {
                        'id_categoria_gasto': cat['id_categoria_gasto'],
                        'fecha_gasto': fecha_test,
                        'concepto': 'Update atómico',
                        'detalles': [_detalle('Nuevo', '1', '99', 1)],
                    },
                    id_empresa=emp_a,
                    user_id=user_id,
                )

        rows = db_session.session.execute(
            text(
                'SELECT id_gasto_detalle::text, descripcion FROM gasto_detalle '
                'WHERE id_gasto = :g ORDER BY orden'
            ),
            {'g': gid},
        ).fetchall()
        assert len(rows) == 2
        assert {r[0] for r in rows} == orig_ids
        assert {r[1] for r in rows} == {'Orig1', 'Orig2'}


def test_h_secuencias_por_empresa(
    app, db_session, empresas, user_id, make_categoria, tracker, cleanup,
):
    from services.gasto_service import crear_gasto

    emp_a, emp_b = empresas
    anio = 2094
    fecha = date(anio, 6, 1)
    cat_a = make_categoria(emp_a)
    cat_b = make_categoria(emp_b)
    tracker['secuencias'].extend([(emp_a, anio), (emp_b, anio)])

    with app.app_context():
        for emp in (emp_a, emp_b):
            db_session.session.execute(
                text('DELETE FROM gasto_secuencia WHERE id_empresa = :e AND anio = :a'),
                {'e': emp, 'a': anio},
            )
        db_session.session.commit()

        ga = crear_gasto(
            {
                'id_categoria_gasto': cat_a['id_categoria_gasto'],
                'fecha_gasto': fecha,
                'concepto': 'Seq A',
                'detalles': [_detalle()],
            },
            id_empresa=emp_a,
            user_id=user_id,
        )
        gb = crear_gasto(
            {
                'id_categoria_gasto': cat_b['id_categoria_gasto'],
                'fecha_gasto': fecha,
                'concepto': 'Seq B',
                'detalles': [_detalle()],
            },
            id_empresa=emp_b,
            user_id=user_id,
        )
        tracker['gastos'].extend([ga['id_gasto'], gb['id_gasto']])
        assert ga['numero_gasto'] == f'GAS-{anio}-000001'
        assert gb['numero_gasto'] == f'GAS-{anio}-000001'
        assert ga['id_empresa'] != gb['id_empresa']


def test_i_secuencias_por_anio(
    app, db_session, empresas, user_id, make_categoria, tracker, cleanup,
):
    from services.gasto_service import crear_gasto

    emp_a, _ = empresas
    y1, y2 = 2096, 2097
    cat = make_categoria(emp_a)
    tracker['secuencias'].extend([(emp_a, y1), (emp_a, y2)])

    with app.app_context():
        for y in (y1, y2):
            db_session.session.execute(
                text('DELETE FROM gasto_secuencia WHERE id_empresa = :e AND anio = :a'),
                {'e': emp_a, 'a': y},
            )
        db_session.session.commit()

        g1 = crear_gasto(
            {
                'id_categoria_gasto': cat['id_categoria_gasto'],
                'fecha_gasto': date(y1, 3, 1),
                'concepto': 'Año 1',
                'detalles': [_detalle()],
            },
            id_empresa=emp_a,
            user_id=user_id,
        )
        g2 = crear_gasto(
            {
                'id_categoria_gasto': cat['id_categoria_gasto'],
                'fecha_gasto': date(y2, 3, 1),
                'concepto': 'Año 2',
                'detalles': [_detalle()],
            },
            id_empresa=emp_a,
            user_id=user_id,
        )
        tracker['gastos'].extend([g1['id_gasto'], g2['id_gasto']])
        assert g1['numero_gasto'] == f'GAS-{y1}-000001'
        assert g2['numero_gasto'] == f'GAS-{y2}-000001'
