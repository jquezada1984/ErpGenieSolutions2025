"""Asientos manuales: crear, aprobar y reversar (diario OD / operaciones varias)."""
from __future__ import annotations

import uuid
from datetime import date, datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List, Optional

from marshmallow import ValidationError
from sqlalchemy import text
from utils.db import db


def _money(v: Any) -> Decimal:
    return Decimal(str(v or 0)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def _periodo_cerrado(id_empresa: str, fecha: date) -> bool:
    row = db.session.execute(
        text(
            """SELECT 1 FROM periodo_contable
               WHERE id_empresa = :e AND estado = 'CERRADO'
                 AND fecha_inicio <= :f AND fecha_fin >= :f
               LIMIT 1"""
        ),
        {'e': id_empresa, 'f': fecha},
    ).scalar()
    return bool(row)


def _diario(id_empresa: str, id_diario: str) -> Optional[Dict[str, Any]]:
    row = db.session.execute(
        text(
            """SELECT id_diario_contable, codigo, nombre
               FROM diario_contable
               WHERE id_empresa = :e AND id_diario_contable = :d AND estado = true
               LIMIT 1"""
        ),
        {'e': id_empresa, 'd': id_diario},
    ).mappings().first()
    return dict(row) if row else None


def _cuenta_activa(id_empresa: str, id_cuenta: str) -> bool:
    row = db.session.execute(
        text(
            """SELECT 1
               FROM cuenta_contable c
               INNER JOIN plan_contable p ON p.id_plan_contable = c.id_plan_contable
               WHERE c.id_cuenta_contable = :c
                 AND c.estado = true
                 AND COALESCE(c.permite_movimientos, true) = true
                 AND p.id_empresa = :e
                 AND p.estado = true
               LIMIT 1"""
        ),
        {'c': id_cuenta, 'e': id_empresa},
    ).scalar()
    return bool(row)


def _siguiente_numero(id_empresa: str, prefijo: str, fecha: date) -> str:
    count = db.session.execute(
        text(
            """SELECT COUNT(*) FROM asiento_contable
               WHERE id_empresa = :e AND EXTRACT(YEAR FROM fecha_asiento) = :y"""
        ),
        {'e': id_empresa, 'y': fecha.year},
    ).scalar() or 0
    return f'{prefijo}-{fecha.year}-{str(int(count) + 1).zfill(6)}'


def _asiento_out(id_asiento: str) -> Dict[str, Any]:
    cab = db.session.execute(
        text(
            """SELECT a.*, d.codigo AS codigo_diario, d.nombre AS nombre_diario
               FROM asiento_contable a
               LEFT JOIN diario_contable d ON d.id_diario_contable = a.id_diario_contable
               WHERE a.id_asiento_contable = :id"""
        ),
        {'id': id_asiento},
    ).mappings().first()
    if not cab:
        raise ValidationError({'id': ['Asiento no encontrado']})
    movs = db.session.execute(
        text(
            """SELECT m.*, c.codigo AS codigo_cuenta, c.nombre AS nombre_cuenta
               FROM movimiento_contable m
               INNER JOIN cuenta_contable c ON c.id_cuenta_contable = m.id_cuenta_contable
               WHERE m.id_asiento_contable = :id
               ORDER BY m.orden"""
        ),
        {'id': id_asiento},
    ).mappings().all()
    out = dict(cab)
    for k in ('id_asiento_contable', 'id_empresa', 'id_diario_contable', 'reversed_entry_id',
              'id_usuario_creacion', 'id_usuario_aprobacion'):
        if out.get(k) is not None:
            out[k] = str(out[k])
    if out.get('fecha_asiento'):
        out['fecha_asiento'] = str(out['fecha_asiento'])
    out['total_debe'] = float(out.get('total_debe') or 0)
    out['total_haber'] = float(out.get('total_haber') or 0)
    out['movimientos'] = [
        {
            'id_movimiento_contable': str(m['id_movimiento_contable']),
            'id_cuenta_contable': str(m['id_cuenta_contable']),
            'codigo_cuenta': m.get('codigo_cuenta'),
            'nombre_cuenta': m.get('nombre_cuenta'),
            'concepto': m.get('concepto'),
            'debe': float(m.get('debe') or 0),
            'haber': float(m.get('haber') or 0),
            'orden': int(m.get('orden') or 0),
        }
        for m in movs
    ]
    return out


def crear_asiento_manual(
    id_empresa: str,
    payload: Dict[str, Any],
    id_usuario: Optional[str] = None,
) -> Dict[str, Any]:
    id_diario = (payload.get('id_diario_contable') or '').strip()
    concepto = (payload.get('concepto') or '').strip()
    referencia = (payload.get('referencia') or '').strip() or None
    fecha_raw = payload.get('fecha_asiento')
    estado = (payload.get('estado') or 'APROBADO').strip().upper()
    lineas = payload.get('movimientos') or payload.get('lineas') or []

    if not id_diario:
        raise ValidationError({'id_diario_contable': ['Requerido']})
    if not concepto:
        raise ValidationError({'concepto': ['Requerido']})
    if not fecha_raw:
        raise ValidationError({'fecha_asiento': ['Requerido']})
    if estado not in ('BORRADOR', 'APROBADO'):
        raise ValidationError({'estado': ['Debe ser BORRADOR o APROBADO']})
    if not isinstance(lineas, list) or len(lineas) < 2:
        raise ValidationError({'movimientos': ['Se requieren al menos 2 líneas']})

    try:
        if isinstance(fecha_raw, date):
            fecha = fecha_raw
        else:
            fecha = date.fromisoformat(str(fecha_raw)[:10])
    except ValueError as exc:
        raise ValidationError({'fecha_asiento': ['Fecha inválida']}) from exc

    diario = _diario(id_empresa, id_diario)
    if not diario:
        raise ValidationError({'id_diario_contable': ['Diario no encontrado o inactivo']})

    if _periodo_cerrado(id_empresa, fecha):
        raise ValidationError({'fecha_asiento': ['El periodo contable está cerrado para esa fecha']})

    total_debe = Decimal('0.00')
    total_haber = Decimal('0.00')
    movs_norm: List[Dict[str, Any]] = []
    for i, lin in enumerate(lineas):
        id_cta = str(lin.get('id_cuenta_contable') or '').strip()
        if not id_cta:
            raise ValidationError({'movimientos': [f'Línea {i + 1}: falta cuenta']})
        if not _cuenta_activa(id_empresa, id_cta):
            raise ValidationError({'movimientos': [f'Línea {i + 1}: cuenta inválida']})
        debe = _money(lin.get('debe'))
        haber = _money(lin.get('haber'))
        if debe < 0 or haber < 0:
            raise ValidationError({'movimientos': [f'Línea {i + 1}: montos no pueden ser negativos']})
        if (debe > 0 and haber > 0) or (debe == 0 and haber == 0):
            raise ValidationError(
                {'movimientos': [f'Línea {i + 1}: indique debe o haber (solo uno, > 0)']}
            )
        total_debe += debe
        total_haber += haber
        movs_norm.append(
            {
                'id_cuenta_contable': id_cta,
                'concepto': (lin.get('concepto') or concepto).strip(),
                'debe': debe,
                'haber': haber,
                'orden': int(lin.get('orden') or i + 1),
            }
        )

    if total_debe != total_haber:
        raise ValidationError(
            {
                'movimientos': [
                    f'Asiento descuadrado: debe={total_debe} haber={total_haber}'
                ]
            }
        )
    if total_debe <= 0:
        raise ValidationError({'movimientos': ['El total del asiento debe ser mayor a cero']})

    id_asiento = str(uuid.uuid4())
    numero = _siguiente_numero(id_empresa, str(diario['codigo']), fecha)
    ahora = datetime.utcnow()

    db.session.execute(
        text(
            """INSERT INTO asiento_contable
               (id_asiento_contable, id_empresa, id_diario_contable, numero_asiento,
                fecha_asiento, concepto, referencia, total_debe, total_haber, estado,
                id_usuario_creacion, id_usuario_aprobacion, fecha_aprobacion, created_at, updated_at)
               VALUES (:id, :emp, :dia, :num, :fec, :con, :ref, :td, :th, :est,
                       :uc, :ua, :fa, :ca, :ua2)"""
        ),
        {
            'id': id_asiento,
            'emp': id_empresa,
            'dia': id_diario,
            'num': numero,
            'fec': fecha,
            'con': concepto,
            'ref': referencia,
            'td': float(total_debe),
            'th': float(total_haber),
            'est': estado,
            'uc': id_usuario,
            'ua': id_usuario if estado == 'APROBADO' else None,
            'fa': ahora if estado == 'APROBADO' else None,
            'ca': ahora,
            'ua2': ahora,
        },
    )

    for m in movs_norm:
        db.session.execute(
            text(
                """INSERT INTO movimiento_contable
                   (id_movimiento_contable, id_asiento_contable, id_cuenta_contable,
                    concepto, debe, haber, orden)
                   VALUES (:idm, :ida, :idc, :con, :d, :h, :o)"""
            ),
            {
                'idm': str(uuid.uuid4()),
                'ida': id_asiento,
                'idc': m['id_cuenta_contable'],
                'con': m['concepto'],
                'd': float(m['debe']),
                'h': float(m['haber']),
                'o': m['orden'],
            },
        )

    db.session.commit()
    return _asiento_out(id_asiento)


def aprobar_asiento(
    id_empresa: str,
    id_asiento: str,
    id_usuario: Optional[str] = None,
) -> Dict[str, Any]:
    row = db.session.execute(
        text(
            """SELECT id_asiento_contable, estado, fecha_asiento
               FROM asiento_contable
               WHERE id_asiento_contable = :id AND id_empresa = :e"""
        ),
        {'id': id_asiento, 'e': id_empresa},
    ).mappings().first()
    if not row:
        raise ValidationError({'id': ['Asiento no encontrado']})
    if row['estado'] != 'BORRADOR':
        raise ValidationError({'estado': ['Solo se pueden aprobar asientos en BORRADOR']})

    fecha = row['fecha_asiento']
    if isinstance(fecha, datetime):
        fecha = fecha.date()
    if _periodo_cerrado(id_empresa, fecha):
        raise ValidationError({'fecha_asiento': ['El periodo contable está cerrado']})

    ahora = datetime.utcnow()
    db.session.execute(
        text(
            """UPDATE asiento_contable
               SET estado = 'APROBADO',
                   id_usuario_aprobacion = :u,
                   fecha_aprobacion = :fa,
                   updated_at = :ua
               WHERE id_asiento_contable = :id"""
        ),
        {'u': id_usuario, 'fa': ahora, 'ua': ahora, 'id': id_asiento},
    )
    db.session.commit()
    return _asiento_out(id_asiento)


def reversar_asiento(
    id_empresa: str,
    id_asiento: str,
    id_usuario: Optional[str] = None,
) -> Dict[str, Any]:
    orig = db.session.execute(
        text(
            """SELECT a.*, d.codigo AS codigo_diario
               FROM asiento_contable a
               INNER JOIN diario_contable d ON d.id_diario_contable = a.id_diario_contable
               WHERE a.id_asiento_contable = :id AND a.id_empresa = :e"""
        ),
        {'id': id_asiento, 'e': id_empresa},
    ).mappings().first()
    if not orig:
        raise ValidationError({'id': ['Asiento no encontrado']})
    if orig['estado'] != 'APROBADO':
        raise ValidationError({'estado': ['Solo se pueden reversar asientos APROBADO']})
    if orig.get('reversed_entry_id'):
        raise ValidationError({'estado': ['El asiento ya fue reversado']})

    fecha = orig['fecha_asiento']
    if isinstance(fecha, datetime):
        fecha = fecha.date()
    if _periodo_cerrado(id_empresa, fecha):
        raise ValidationError({'fecha_asiento': ['El periodo contable está cerrado']})

    movs = db.session.execute(
        text(
            """SELECT id_cuenta_contable, concepto, debe, haber, orden
               FROM movimiento_contable
               WHERE id_asiento_contable = :id
               ORDER BY orden"""
        ),
        {'id': id_asiento},
    ).mappings().all()
    if not movs:
        raise ValidationError({'movimientos': ['Asiento sin líneas']})

    id_reverso = str(uuid.uuid4())
    numero = _siguiente_numero(id_empresa, str(orig['codigo_diario']), fecha)
    ahora = datetime.utcnow()
    concepto = f"REVERSO {orig['numero_asiento']}: {orig['concepto']}"
    total = float(orig['total_debe'] or 0)

    db.session.execute(
        text(
            """INSERT INTO asiento_contable
               (id_asiento_contable, id_empresa, id_diario_contable, numero_asiento,
                fecha_asiento, concepto, referencia, total_debe, total_haber, estado,
                id_usuario_creacion, id_usuario_aprobacion, fecha_aprobacion, created_at, updated_at)
               VALUES (:id, :emp, :dia, :num, :fec, :con, :ref, :td, :th, 'APROBADO',
                       :uc, :ua, :fa, :ca, :ua2)"""
        ),
        {
            'id': id_reverso,
            'emp': id_empresa,
            'dia': str(orig['id_diario_contable']),
            'num': numero,
            'fec': fecha,
            'con': concepto,
            'ref': orig.get('referencia') or orig['numero_asiento'],
            'td': total,
            'th': total,
            'uc': id_usuario,
            'ua': id_usuario,
            'fa': ahora,
            'ca': ahora,
            'ua2': ahora,
        },
    )

    for m in movs:
        db.session.execute(
            text(
                """INSERT INTO movimiento_contable
                   (id_movimiento_contable, id_asiento_contable, id_cuenta_contable,
                    concepto, debe, haber, orden)
                   VALUES (:idm, :ida, :idc, :con, :d, :h, :o)"""
            ),
            {
                'idm': str(uuid.uuid4()),
                'ida': id_reverso,
                'idc': str(m['id_cuenta_contable']),
                'con': m.get('concepto') or concepto,
                'd': float(m['haber'] or 0),
                'h': float(m['debe'] or 0),
                'o': int(m['orden'] or 0),
            },
        )

    db.session.execute(
        text(
            """UPDATE asiento_contable
               SET estado = 'REVERSED',
                   reversed_entry_id = :rev,
                   updated_at = :ua
               WHERE id_asiento_contable = :id"""
        ),
        {'rev': id_reverso, 'ua': ahora, 'id': id_asiento},
    )
    db.session.commit()
    return {
        'asiento_original': _asiento_out(id_asiento),
        'asiento_reverso': _asiento_out(id_reverso),
    }
