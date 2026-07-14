"""
Servicios Fase 2-3: vincular facturas y registrar en diarios contables.
"""
from __future__ import annotations

import csv
import io
import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Any, Dict, List, Optional

from marshmallow import ValidationError
from sqlalchemy import text
from utils.db import db


def _config(id_empresa: str) -> Dict[str, Any]:
    row = db.session.execute(
        text('SELECT * FROM configuracion_contabilidad WHERE id_empresa = :e'),
        {'e': id_empresa},
    ).mappings().first()
    return dict(row) if row else {}


def _cuenta_defecto(id_empresa: str, tipo: str) -> Optional[str]:
    r = db.session.execute(
        text(
            """SELECT id_cuenta_contable FROM cuenta_contable_defecto
               WHERE id_empresa = :e AND tipo_operacion = :t AND estado = true
               AND id_cuenta_contable IS NOT NULL LIMIT 1"""
        ),
        {'e': id_empresa, 't': tipo},
    ).scalar()
    return str(r) if r else None


def _diario_id(id_empresa: str, codigo: str) -> Optional[str]:
    r = db.session.execute(
        text(
            """SELECT id_diario_contable FROM diario_contable
               WHERE id_empresa = :e AND codigo = :c AND estado = true LIMIT 1"""
        ),
        {'e': id_empresa, 'c': codigo},
    ).scalar()
    return str(r) if r else None


def _siguiente_numero(id_empresa: str, prefijo: str, fecha: date) -> str:
    count = db.session.execute(
        text(
            """SELECT COUNT(*) FROM asiento_contable
               WHERE id_empresa = :e AND EXTRACT(YEAR FROM fecha_asiento) = :y"""
        ),
        {'e': id_empresa, 'y': fecha.year},
    ).scalar() or 0
    return f'{prefijo}-{fecha.year}-{str(int(count) + 1).zfill(6)}'


def _filtro_tercero(es_cliente: bool) -> str:
    return 't.cliente = true' if es_cliente else 't.proveedor = true'


def _lineas_sql(es_cliente: bool, vinculadas: Optional[bool] = None) -> str:
    extra = ''
    if vinculadas is True:
        extra = ' AND fl.vinculado = true'
    elif vinculadas is False:
        extra = ' AND (fl.vinculado = false OR fl.vinculado IS NULL)'
    return f"""
        SELECT fl.id_factura_linea, fl.id_factura, fl.id_item, fl.descripcion, fl.cantidad,
               fl.precio_unitario, fl.subtotal, fl.id_cuenta_contable, fl.tasa_iva,
               fl.id_cuenta_sugerida, fl.vinculado, fl.transferido,
               f.numero_factura, f.fecha_factura, f.id_tercero,
               t.nombre AS tercero_nombre, t.codigo_cliente, t.codigo_proveedor, t.pais,
               i.codigo AS ref_producto, i.id_cuenta_venta, i.id_cuenta_compra,
               c.codigo AS cuenta_codigo, c.nombre AS cuenta_nombre
        FROM factura_linea fl
        INNER JOIN factura f ON f.id_factura = fl.id_factura
        INNER JOIN tercero t ON t.id_tercero = f.id_tercero
        LEFT JOIN item i ON i.id_item = fl.id_item
        LEFT JOIN cuenta_contable c ON c.id_cuenta_contable = fl.id_cuenta_contable
        WHERE f.id_empresa = :emp AND {_filtro_tercero(es_cliente)}
          AND f.estado NOT IN ('BORRADOR', 'ANULADA')
          AND EXTRACT(YEAR FROM f.fecha_factura) = :anio
          {extra}
    """


def resumen_vinculacion(id_empresa: str, anio: int, es_cliente: bool) -> Dict[str, Any]:
    sql = f"""
        SELECT COALESCE(c.codigo, 'SIN CUENTA') AS cuenta,
               EXTRACT(MONTH FROM f.fecha_factura)::int AS mes,
               COUNT(*)::int AS num_lineas,
               COALESCE(SUM(fl.subtotal), 0) AS total
        FROM factura_linea fl
        INNER JOIN factura f ON f.id_factura = fl.id_factura
        INNER JOIN tercero t ON t.id_tercero = f.id_tercero
        LEFT JOIN cuenta_contable c ON c.id_cuenta_contable = fl.id_cuenta_contable
        WHERE f.id_empresa = :emp AND {_filtro_tercero(es_cliente)}
          AND EXTRACT(YEAR FROM f.fecha_factura) = :anio
          AND (fl.vinculado = false OR fl.vinculado IS NULL)
        GROUP BY cuenta, mes
        ORDER BY cuenta, mes
    """
    no_vinc = [dict(r) for r in db.session.execute(text(sql), {'emp': id_empresa, 'anio': anio}).mappings()]
    sql2 = sql.replace(
        'AND (fl.vinculado = false OR fl.vinculado IS NULL)',
        'AND fl.vinculado = true',
    )
    vinc = [dict(r) for r in db.session.execute(text(sql2), {'emp': id_empresa, 'anio': anio}).mappings()]
    return {'no_vinculadas': no_vinc, 'vinculadas': vinc}


def lineas_transferencia(
    id_empresa: str, anio: int, es_cliente: bool, vinculadas: bool
) -> List[Dict[str, Any]]:
    sql = _lineas_sql(es_cliente, vinculadas)
    rows = db.session.execute(text(sql), {'emp': id_empresa, 'anio': anio}).mappings().all()
    return [dict(r) for r in rows]


def _sugerir_cuenta(id_empresa: str, es_cliente: bool, row: Dict[str, Any]) -> Optional[str]:
    if es_cliente and row.get('id_cuenta_venta'):
        return str(row['id_cuenta_venta'])
    if not es_cliente and row.get('id_cuenta_compra'):
        return str(row['id_cuenta_compra'])
    tipo = 'PRODUCTO_VENTA_NACIONAL' if es_cliente else 'PRODUCTO_COMPRA_NACIONAL'
    return _cuenta_defecto(id_empresa, tipo)


def vincular_automatico(id_empresa: str, anio: int, es_cliente: bool) -> Dict[str, Any]:
    cfg = _config(id_empresa)
    if es_cliente and cfg.get('deshabilitar_transferencia_ventas'):
        raise ValidationError({'config': ['Transferencia de ventas deshabilitada']})
    if not es_cliente and cfg.get('deshabilitar_transferencia_compras'):
        raise ValidationError({'config': ['Transferencia de compras deshabilitada']})

    sql = _lineas_sql(es_cliente, False)
    rows = db.session.execute(text(sql), {'emp': id_empresa, 'anio': anio}).mappings().all()
    actualizados = 0
    for row in rows:
        cuenta = _sugerir_cuenta(id_empresa, es_cliente, dict(row))
        if not cuenta:
            continue
        db.session.execute(
            text(
                """UPDATE factura_linea SET id_cuenta_sugerida = :sug, id_cuenta_contable = :cta,
                   vinculado = true WHERE id_factura_linea = :id"""
            ),
            {'sug': cuenta, 'cta': cuenta, 'id': str(row['id_factura_linea'])},
        )
        actualizados += 1
    db.session.commit()
    return {'vinculados': actualizados}


def vincular_lineas(id_empresa: str, ids_lineas: List[str], id_cuenta: str) -> Dict[str, Any]:
    if not ids_lineas or not id_cuenta:
        raise ValidationError({'campos': ['ids_lineas e id_cuenta_contable obligatorios']})
    db.session.execute(
        text(
            """UPDATE factura_linea SET id_cuenta_contable = :cta, id_cuenta_sugerida = :cta,
               vinculado = true WHERE id_factura_linea = ANY(:ids)"""
        ),
        {'cta': id_cuenta, 'ids': ids_lineas},
    )
    db.session.commit()
    return {'actualizados': len(ids_lineas)}


def cambiar_cuenta_lineas(id_empresa: str, ids_lineas: List[str], id_cuenta: str) -> Dict[str, Any]:
    return vincular_lineas(id_empresa, ids_lineas, id_cuenta)


def preview_registro(
    id_empresa: str, origen: str, desde: str, hasta: str
) -> List[Dict[str, Any]]:
    if origen == 'banco':
        return _preview_banco(id_empresa, desde, hasta)
    es_cliente = origen == 'ventas'
    sql = """
        SELECT f.fecha_factura AS fecha, f.numero_factura AS doc_ref,
               c.codigo AS cuenta_codigo, NULL::text AS subcuenta,
               COALESCE(fl.descripcion, '') AS etiqueta,
               CASE WHEN :es_cliente THEN fl.subtotal ELSE 0 END AS debe,
               CASE WHEN :es_cliente THEN 0 ELSE fl.subtotal END AS haber,
               NULL::text AS forma_pago
        FROM factura_linea fl
        INNER JOIN factura f ON f.id_factura = fl.id_factura
        INNER JOIN tercero t ON t.id_tercero = f.id_tercero
        INNER JOIN cuenta_contable c ON c.id_cuenta_contable = fl.id_cuenta_contable
        WHERE f.id_empresa = :emp AND fl.vinculado = true AND fl.transferido = false
          AND f.fecha_factura >= :desde AND f.fecha_factura <= :hasta
          AND """ + (_filtro_tercero(es_cliente)) + """
        ORDER BY f.fecha_factura, f.numero_factura
    """
    rows = db.session.execute(
        text(sql), {'emp': id_empresa, 'desde': desde, 'hasta': hasta, 'es_cliente': es_cliente}
    ).mappings().all()
    return [dict(r) for r in rows]


def _preview_banco(id_empresa: str, desde: str, hasta: str) -> List[Dict[str, Any]]:
    cfg = _config(id_empresa)
    extra = ' AND mb.conciliado = true' if cfg.get('solo_lineas_conciliadas_extracto') else ''
    sql = f"""
        SELECT mb.fecha_movimiento AS fecha, mb.numero_documento AS doc_ref,
               c.codigo AS cuenta_codigo, NULL::text AS subcuenta,
               mb.concepto AS etiqueta, mb.tipo_movimiento AS forma_pago,
               CASE WHEN mb.tipo_movimiento IN ('INGRESO', 'ABONO') THEN mb.monto ELSE 0 END AS debe,
               CASE WHEN mb.tipo_movimiento IN ('EGRESO', 'CARGO') THEN mb.monto ELSE 0 END AS haber
        FROM movimiento_bancario mb
        INNER JOIN cuenta_bancaria cb ON cb.id_cuenta_bancaria = mb.id_cuenta_bancaria
        LEFT JOIN cuenta_contable c ON c.id_cuenta_contable = cb.id_cuenta_contable
        WHERE mb.id_empresa = :emp AND mb.id_asiento_contable IS NULL
          AND mb.fecha_movimiento >= :desde AND mb.fecha_movimiento <= :hasta
          {extra}
        ORDER BY mb.fecha_movimiento
    """
    rows = db.session.execute(text(sql), {'emp': id_empresa, 'desde': desde, 'hasta': hasta}).mappings().all()
    return [dict(r) for r in rows]


def ejecutar_registro(id_empresa: str, origen: str, desde: str, hasta: str) -> Dict[str, Any]:
    _validar_prerequisitos(id_empresa, desde, hasta)
    if origen == 'ventas':
        return _registro_facturas(id_empresa, True, desde, hasta, 'VT')
    if origen == 'compras':
        return _registro_facturas(id_empresa, False, desde, hasta, 'AC')
    if origen == 'banco':
        return _registro_banco(id_empresa, desde, hasta)
    raise ValidationError({'origen': ['Origen inválido']})


def _validar_prerequisitos(id_empresa: str, desde: str, hasta: str) -> None:
    periodo = db.session.execute(
        text(
            """SELECT id_periodo_contable FROM periodo_contable
               WHERE id_empresa = :e AND estado = 'ABIERTO'
                 AND fecha_inicio <= :desde AND fecha_fin >= :hasta LIMIT 1"""
        ),
        {'e': id_empresa, 'desde': desde, 'hasta': hasta},
    ).scalar()
    if not periodo:
        raise ValidationError({'periodo': ['No hay periodo contable ABIERTO para el rango']})
    defecto = db.session.execute(
        text(
            """SELECT COUNT(*) FROM cuenta_contable_defecto
               WHERE id_empresa = :e AND estado = true AND id_cuenta_contable IS NOT NULL"""
        ),
        {'e': id_empresa},
    ).scalar()
    if not defecto or int(defecto) < 1:
        raise ValidationError({'cuentas_defecto': ['Defina cuentas contables por defecto']})


def _registro_facturas(
    id_empresa: str, es_cliente: bool, desde: str, hasta: str, codigo_diario: str
) -> Dict[str, Any]:
    id_diario = _diario_id(id_empresa, codigo_diario)
    if not id_diario:
        raise ValidationError({'diario': [f'Diario {codigo_diario} no encontrado']})

    cuenta_tercero = _cuenta_defecto(
        id_empresa, 'TERCERO_CLIENTE' if es_cliente else 'TERCERO_PROVEEDOR'
    )
    if not cuenta_tercero:
        raise ValidationError({'cuenta': ['Cuenta tercero por defecto no configurada']})

    sql = """
        SELECT fl.id_factura_linea, fl.id_factura, fl.descripcion, fl.subtotal,
               fl.id_cuenta_contable, f.numero_factura, f.fecha_factura
        FROM factura_linea fl
        INNER JOIN factura f ON f.id_factura = fl.id_factura
        INNER JOIN tercero t ON t.id_tercero = f.id_tercero
        WHERE f.id_empresa = :emp AND """ + (_filtro_tercero(es_cliente)) + """
          AND fl.vinculado = true AND fl.transferido = false
          AND f.fecha_factura >= :desde AND f.fecha_factura <= :hasta
    """
    lineas = db.session.execute(
        text(sql), {'emp': id_empresa, 'desde': desde, 'hasta': hasta}
    ).mappings().all()

    asientos_creados = 0
    for lin in lineas:
        monto = Decimal(str(lin['subtotal'] or 0))
        if monto <= 0:
            continue
        fecha = lin['fecha_factura']
        id_asiento = str(uuid.uuid4())
        numero = _siguiente_numero(id_empresa, codigo_diario, fecha)
        concepto = f"Factura {lin['numero_factura']} - {lin['descripcion'] or ''}"
        ref = str(lin['numero_factura'] or '')

        db.session.execute(
            text(
                """INSERT INTO asiento_contable
                   (id_asiento_contable, id_empresa, id_diario_contable, numero_asiento,
                    fecha_asiento, concepto, referencia, total_debe, total_haber, estado)
                   VALUES (:id, :emp, :dia, :num, :fec, :con, :ref, :td, :th, 'APROBADO')"""
            ),
            {
                'id': id_asiento, 'emp': id_empresa, 'dia': id_diario, 'num': numero,
                'fec': fecha, 'con': concepto, 'ref': ref,
                'td': float(monto), 'th': float(monto),
            },
        )
        if es_cliente:
            movs = [
                (cuenta_tercero, float(monto), 0, 1),
                (str(lin['id_cuenta_contable']), 0, float(monto), 2),
            ]
        else:
            movs = [
                (str(lin['id_cuenta_contable']), float(monto), 0, 1),
                (cuenta_tercero, 0, float(monto), 2),
            ]
        for id_cta, debe, haber, orden in movs:
            db.session.execute(
                text(
                    """INSERT INTO movimiento_contable
                       (id_movimiento_contable, id_asiento_contable, id_cuenta_contable,
                        concepto, debe, haber, orden)
                       VALUES (:idm, :ida, :idc, :con, :d, :h, :o)"""
                ),
                {
                    'idm': str(uuid.uuid4()), 'ida': id_asiento, 'idc': id_cta,
                    'con': concepto, 'd': debe, 'h': haber, 'o': orden,
                },
            )
        db.session.execute(
            text(
                """UPDATE factura_linea SET transferido = true, id_asiento_contable = :as
                   WHERE id_factura_linea = :id"""
            ),
            {'as': id_asiento, 'id': str(lin['id_factura_linea'])},
        )
        asientos_creados += 1

    db.session.commit()
    return {'asientos_creados': asientos_creados}


def _registro_banco(id_empresa: str, desde: str, hasta: str) -> Dict[str, Any]:
    id_diario = _diario_id(id_empresa, 'BQ')
    if not id_diario:
        raise ValidationError({'diario': ['Diario BQ no encontrado']})
    transitoria = _cuenta_defecto(id_empresa, 'TRANSITORIA_BANCARIA')
    if not transitoria:
        raise ValidationError({'cuenta': ['Cuenta transitoria bancaria no configurada']})

    movs = _preview_banco(id_empresa, desde, hasta)
    asientos_creados = 0
    for m in movs:
        monto_d = Decimal(str(m.get('debe') or 0))
        monto_h = Decimal(str(m.get('haber') or 0))
        monto = monto_d if monto_d > 0 else monto_h
        if monto <= 0:
            continue
        fecha = m['fecha']
        id_asiento = str(uuid.uuid4())
        numero = _siguiente_numero(id_empresa, 'BQ', fecha)
        concepto = str(m.get('etiqueta') or 'Movimiento bancario')

        cuenta_banco_row = db.session.execute(
            text(
                """SELECT cb.id_cuenta_contable FROM movimiento_bancario mb
                   INNER JOIN cuenta_bancaria cb ON cb.id_cuenta_bancaria = mb.id_cuenta_bancaria
                   WHERE mb.id_empresa = :e AND mb.numero_documento = :doc
                     AND mb.fecha_movimiento = :fec LIMIT 1"""
            ),
            {'e': id_empresa, 'doc': m.get('doc_ref'), 'fec': fecha},
        ).scalar()
        if not cuenta_banco_row:
            continue
        id_cta_banco = str(cuenta_banco_row)

        db.session.execute(
            text(
                """INSERT INTO asiento_contable
                   (id_asiento_contable, id_empresa, id_diario_contable, numero_asiento,
                    fecha_asiento, concepto, referencia, total_debe, total_haber, estado)
                   VALUES (:id, :emp, :dia, :num, :fec, :con, :ref, :td, :th, 'APROBADO')"""
            ),
            {
                'id': id_asiento, 'emp': id_empresa, 'dia': id_diario, 'num': numero,
                'fec': fecha, 'con': concepto, 'ref': str(m.get('doc_ref') or ''),
                'td': float(monto), 'th': float(monto),
            },
        )
        if monto_d > 0:
            movs_ins = [(id_cta_banco, float(monto), 0, 1), (transitoria, 0, float(monto), 2)]
        else:
            movs_ins = [(transitoria, float(monto), 0, 1), (id_cta_banco, 0, float(monto), 2)]
        for id_cta, debe, haber, orden in movs_ins:
            db.session.execute(
                text(
                    """INSERT INTO movimiento_contable
                       (id_movimiento_contable, id_asiento_contable, id_cuenta_contable,
                        concepto, debe, haber, orden)
                       VALUES (:idm, :ida, :idc, :con, :d, :h, :o)"""
                ),
                {
                    'idm': str(uuid.uuid4()), 'ida': id_asiento, 'idc': id_cta,
                    'con': concepto, 'd': debe, 'h': haber, 'o': orden,
                },
            )
        db.session.execute(
            text(
                """UPDATE movimiento_bancario SET id_asiento_contable = :as
                   WHERE id_empresa = :e AND numero_documento = :doc AND fecha_movimiento = :fec
                     AND id_asiento_contable IS NULL"""
            ),
            {'as': id_asiento, 'e': id_empresa, 'doc': m.get('doc_ref'), 'fec': fecha},
        )
        asientos_creados += 1

    db.session.commit()
    return {'asientos_creados': asientos_creados}


def exportar_documentos_origen(
    id_empresa: str, desde: str, hasta: str, tipos: List[str]
) -> Dict[str, Any]:
    cfg = _config(id_empresa)
    sep = cfg.get('separador_columnas') or ','
    lines: List[str] = []
    header = sep.join(['tipo', 'numero', 'fecha', 'tercero', 'subtotal', 'estado'])
    lines.append(header)

    if 'facturas' in tipos or 'facturas_cliente' in tipos:
        rows = db.session.execute(
            text(
                """SELECT 'factura_cliente' AS tipo, f.numero_factura, f.fecha_factura,
                          t.nombre, f.subtotal, f.estado
                   FROM factura f INNER JOIN tercero t ON t.id_tercero = f.id_tercero
                   WHERE f.id_empresa = :e AND t.cliente = true
                     AND f.fecha_factura >= :d AND f.fecha_factura <= :h"""
            ),
            {'e': id_empresa, 'd': desde, 'h': hasta},
        ).mappings().all()
        for r in rows:
            lines.append(sep.join([str(r[k] or '') for k in ('tipo', 'numero_factura', 'fecha_factura', 'nombre', 'subtotal', 'estado')]))

    if 'facturas_proveedor' in tipos:
        rows = db.session.execute(
            text(
                """SELECT 'factura_proveedor' AS tipo, f.numero_factura, f.fecha_factura,
                          t.nombre, f.subtotal, f.estado
                   FROM factura f INNER JOIN tercero t ON t.id_tercero = f.id_tercero
                   WHERE f.id_empresa = :e AND t.proveedor = true
                     AND f.fecha_factura >= :d AND f.fecha_factura <= :h"""
            ),
            {'e': id_empresa, 'd': desde, 'h': hasta},
        ).mappings().all()
        for r in rows:
            lines.append(sep.join([str(r[k] or '') for k in ('tipo', 'numero_factura', 'fecha_factura', 'nombre', 'subtotal', 'estado')]))

    csv_content = '\n'.join(lines)
    return {'csv': csv_content, 'total_lineas': len(lines) - 1, 'formato': 'csv'}
