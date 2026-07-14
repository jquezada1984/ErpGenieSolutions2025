from datetime import datetime
from typing import Dict, Any, List
from marshmallow import ValidationError
from sqlalchemy import text
from utils.db import db


def _empresa_headers(id_empresa: str) -> str:
    if not id_empresa:
        raise ValidationError({'empresa': ['Falta id_empresa']})
    return id_empresa


def listar_movimientos_exportar(
    id_empresa: str,
    fecha_desde: str,
    fecha_hasta: str,
    incluir_exportados: bool = False,
) -> List[Dict[str, Any]]:
    _empresa_headers(id_empresa)
    extra = '' if incluir_exportados else ' AND m.fecha_exportacion IS NULL'
    rows = db.session.execute(
        text(
            f"""SELECT
                  m.id_movimiento_contable,
                  a.numero_asiento,
                  d.codigo AS codigo_diario,
                  a.fecha_asiento,
                  a.referencia,
                  c.codigo AS codigo_cuenta,
                  COALESCE(m.concepto, a.concepto) AS concepto,
                  m.debe,
                  m.haber,
                  m.fecha_exportacion
                FROM movimiento_contable m
                INNER JOIN asiento_contable a ON a.id_asiento_contable = m.id_asiento_contable
                INNER JOIN cuenta_contable c ON c.id_cuenta_contable = m.id_cuenta_contable
                INNER JOIN diario_contable d ON d.id_diario_contable = a.id_diario_contable
                WHERE a.id_empresa = :emp
                  AND a.estado = 'APROBADO'
                  AND a.fecha_asiento >= :desde
                  AND a.fecha_asiento <= :hasta
                  {extra}
                ORDER BY a.fecha_asiento, a.numero_asiento, m.orden"""
        ),
        {'emp': id_empresa, 'desde': fecha_desde, 'hasta': fecha_hasta},
    ).mappings().all()
    return [dict(r) for r in rows]


def ejecutar_exportacion(
    id_empresa: str,
    fecha_desde: str,
    fecha_hasta: str,
    ids_movimientos: List[str] | None = None,
) -> Dict[str, Any]:
    _empresa_headers(id_empresa)
    now = datetime.utcnow()

    if ids_movimientos:
        result = db.session.execute(
            text(
                """UPDATE movimiento_contable m
                   SET fecha_exportacion = :now
                   FROM asiento_contable a
                   WHERE m.id_asiento_contable = a.id_asiento_contable
                     AND a.id_empresa = :emp
                     AND m.id_movimiento_contable = ANY(:ids)
                     AND m.fecha_exportacion IS NULL
                   RETURNING m.id_movimiento_contable"""
            ),
            {'now': now, 'emp': id_empresa, 'ids': ids_movimientos},
        )
    else:
        result = db.session.execute(
            text(
                """UPDATE movimiento_contable m
                   SET fecha_exportacion = :now
                   FROM asiento_contable a
                   WHERE m.id_asiento_contable = a.id_asiento_contable
                     AND a.id_empresa = :emp
                     AND a.estado = 'APROBADO'
                     AND a.fecha_asiento >= :desde
                     AND a.fecha_asiento <= :hasta
                     AND m.fecha_exportacion IS NULL
                   RETURNING m.id_movimiento_contable"""
            ),
            {'now': now, 'emp': id_empresa, 'desde': fecha_desde, 'hasta': fecha_hasta},
        )

    updated = [str(r[0]) for r in result.fetchall()]
    db.session.commit()

    movimientos = listar_movimientos_exportar(
        id_empresa, fecha_desde, fecha_hasta, incluir_exportados=True
    )
    exportados = [m for m in movimientos if str(m.get('id_movimiento_contable')) in updated]

    lines = []
    for m in exportados:
        lines.append(
            ';'.join([
                str(m.get('numero_asiento', '')),
                str(m.get('codigo_diario', '')),
                str(m.get('fecha_asiento', '')),
                str(m.get('referencia') or ''),
                str(m.get('codigo_cuenta', '')),
                str(m.get('concepto', '')),
                str(m.get('debe', 0)),
                str(m.get('haber', 0)),
            ])
        )

    csv_content = 'numero_asiento;diario;fecha;referencia;cuenta;concepto;debe;haber\n' + '\n'.join(lines)

    return {
        'exportados': len(updated),
        'ids_movimientos': updated,
        'csv': csv_content,
        'fecha_exportacion': now.isoformat(),
    }
