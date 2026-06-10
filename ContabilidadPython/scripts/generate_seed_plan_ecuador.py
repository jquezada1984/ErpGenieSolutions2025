#!/usr/bin/env python3
"""Genera SQL seed del plan EC-SUPERCIAS desde docs/seeds/PLAN_CUENTAS_NUEVO_SISTEMA.xlsx."""
from __future__ import annotations

import uuid
from pathlib import Path

try:
    import openpyxl
except ImportError:
    raise SystemExit('Instale openpyxl: pip install openpyxl')

ROOT = Path(__file__).resolve().parents[2]
EXCEL = ROOT / 'docs' / 'seeds' / 'PLAN_CUENTAS_NUEVO_SISTEMA.xlsx'
OUT = ROOT / 'ContabilidadNestJs' / 'migrations' / '08_seed_plan_ecuador_supercias.sql'

NS = uuid.UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')
ID_MODELO = str(uuid.uuid5(NS, 'modelo-ec-supercias'))
ID_PLAN = str(uuid.uuid5(NS, 'plan-ec-supercias'))
ID_EMPRESA = 'a0000000-0000-4000-8000-000000000001'
ID_PAIS_EC = 'd4882144-caf7-46e8-8f72-4378a29a7ff7'


def norm_code(raw) -> str:
    s = str(raw).strip()
    if s.endswith('.0') and '.' in s:
        s = s[:-2]
    return s.replace('.', '')


def tipo_cuenta(code: str) -> str:
    if code.upper().startswith('ECP'):
        return 'ORDEN'
    if code and code[0].isdigit():
        return {
            '1': 'ACTIVO',
            '2': 'PASIVO',
            '3': 'PATRIMONIO',
            '4': 'INGRESO',
            '5': 'GASTO',
            '6': 'COSTO',
            '7': 'ORDEN',
        }.get(code[0], 'ORDEN')
    return 'ORDEN'


def nivel(raw: str, norm: str) -> int:
    if '.' in raw:
        return len(raw.split('.'))
    if len(norm) <= 1:
        return 1
    if len(norm) == 3:
        return 2
    return (len(norm) - 1) // 2 + 1


def best_parent(norm: str, codes: set[str]) -> str | None:
    if not norm or len(norm) <= 1:
        return None
    candidates = [c for c in codes if norm.startswith(c) and c != norm and len(c) < len(norm)]
    return max(candidates, key=len) if candidates else None


def esc(s: str) -> str:
    return s.replace("'", "''")


def main() -> None:
    if not EXCEL.exists():
        raise SystemExit(f'No existe {EXCEL}')

    wb = openpyxl.load_workbook(EXCEL, read_only=True, data_only=True)
    rows = list(wb['Hoja1'].iter_rows(min_row=2, values_only=True))
    wb.close()

    entries = []
    for row in rows:
        cod_raw, nombre, _tipo_ef, _cred_deb, tiene_sub = row
        if cod_raw is None:
            continue
        raw = str(cod_raw).strip()
        n = norm_code(cod_raw)
        entries.append({
            'raw': raw,
            'norm': n,
            'nombre': (nombre or '').strip(),
            'permite_movimientos': (str(tiene_sub or '').upper() != 'SI'),
        })

    norm_set = {e['norm'] for e in entries}
    id_by_norm: dict[str, str] = {}
    for e in entries:
        id_by_norm[e['norm']] = str(uuid.uuid5(NS, f'cuenta-{ID_PLAN}-{e["norm"]}'))

    lines: list[str] = [
        '-- Seed plan de cuentas Ecuador EC-SUPERCIAS (generado desde Excel)',
        f'-- Cuentas: {len(entries)}',
        '',
        "INSERT INTO modelo_plan_contable (id_modelo_plan_contable, codigo, nombre, descripcion, id_pais, estado)",
        "VALUES (",
        f"  '{ID_MODELO}',",
        "  'EC-SUPERCIAS',",
        "  'Plan de cuentas Ecuador',",
        "  'Plan de cuentas según normativa SUPERCIAS Ecuador',",
        f"  '{ID_PAIS_EC}',",
        '  true',
        ') ON CONFLICT (codigo) DO UPDATE SET',
        '  nombre = EXCLUDED.nombre,',
        '  descripcion = EXCLUDED.descripcion,',
        '  id_pais = EXCLUDED.id_pais,',
        '  estado = EXCLUDED.estado;',
        '',
        "INSERT INTO plan_contable (id_plan_contable, id_empresa, id_modelo_plan_contable, nombre, descripcion, estado)",
        "VALUES (",
        f"  '{ID_PLAN}',",
        f"  '{ID_EMPRESA}',",
        f"  '{ID_MODELO}',",
        "  'Plan de cuentas Ecuador',",
        "  'Plantilla catálogo EC-SUPERCIAS',",
        '  true',
        ') ON CONFLICT (id_plan_contable) DO UPDATE SET',
        '  id_modelo_plan_contable = EXCLUDED.id_modelo_plan_contable,',
        '  nombre = EXCLUDED.nombre,',
        '  descripcion = EXCLUDED.descripcion,',
        '  estado = EXCLUDED.estado;',
        '',
        'DELETE FROM cuenta_contable WHERE id_plan_contable = '
        f"'{ID_PLAN}';",
        '',
    ]

    for e in entries:
        parent_norm = best_parent(e['norm'], norm_set)
        parent_id = f"'{id_by_norm[parent_norm]}'" if parent_norm else 'NULL'
        tc = tipo_cuenta(e['norm'])
        nv = nivel(e['raw'], e['norm'])
        pm = 'true' if e['permite_movimientos'] else 'false'
        cid = id_by_norm[e['norm']]
        lines.append(
            'INSERT INTO cuenta_contable '
            '(id_cuenta_contable, id_plan_contable, codigo, nombre, tipo_cuenta, nivel, '
            'id_cuenta_padre, permite_movimientos, estado) VALUES ('
            f"'{cid}', '{ID_PLAN}', '{esc(e['norm'])}', '{esc(e['nombre'])}', "
            f"'{tc}', {nv}, {parent_id}, {pm}, true);"
        )

    OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f'Generado: {OUT} ({len(entries)} cuentas)')


if __name__ == '__main__':
    main()
