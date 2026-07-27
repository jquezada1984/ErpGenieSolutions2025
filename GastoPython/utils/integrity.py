"""Mapeo seguro de IntegrityError de PostgreSQL → (http_status, mensaje_cliente).

No exponer SQL, detail, ni mensajes crudos de PostgreSQL al cliente.

Convención HTTP:
- UNIQUE (23505) → 409
- FOREIGN KEY (23503) → 400  (referencia inválida enviada por el cliente)
- CHECK (23514) → 400
- otros → 409 genérico (conflicto de integridad)
"""
from __future__ import annotations

from typing import Optional, Tuple

from sqlalchemy.exc import IntegrityError

# Códigos PostgreSQL (SQLSTATE)
PG_UNIQUE = '23505'
PG_FOREIGN_KEY = '23503'
PG_CHECK = '23514'
PG_NOT_NULL = '23502'

# Nombres de constraint esperados (DDL real / convención Gastos)
CONSTRAINT_MESSAGES = {
    'categoria_gasto_empresa_codigo_unique': (
        409,
        'Ya existe una categoría con ese código para la empresa.',
    ),
    'categoria_gasto_empresa_nombre_unique': (
        409,
        'Ya existe una categoría con ese nombre para la empresa.',
    ),
    'gasto_empresa_numero_unique': (
        409,
        'Conflicto de numeración: el numero_gasto ya existe para la empresa.',
    ),
}

# Fallbacks por fragmento de nombre (si el DDL usó otro naming)
CONSTRAINT_SUBSTRINGS = (
    ('codigo', 409, 'Ya existe una categoría con ese código para la empresa.'),
    ('nombre', 409, 'Ya existe una categoría con ese nombre para la empresa.'),
    ('numero_gasto', 409, 'Conflicto de numeración: el numero_gasto ya existe para la empresa.'),
)


def _constraint_name(exc: IntegrityError) -> Optional[str]:
    orig = getattr(exc, 'orig', None)
    if orig is None:
        return None
    diag = getattr(orig, 'diag', None)
    if diag is not None:
        name = getattr(diag, 'constraint_name', None)
        if name:
            return str(name)
    # Algunos drivers exponen constraint_name en el exception
    name = getattr(orig, 'constraint_name', None)
    return str(name) if name else None


def _pgcode(exc: IntegrityError) -> Optional[str]:
    orig = getattr(exc, 'orig', None)
    if orig is None:
        return None
    code = getattr(orig, 'pgcode', None)
    return str(code) if code else None


def map_integrity_error(exc: IntegrityError) -> Tuple[int, str]:
    """
    Devuelve (status_http, mensaje_seguro_para_cliente).
    Nunca incluye el texto interno de PostgreSQL.
    """
    pgcode = _pgcode(exc)
    constraint = _constraint_name(exc)
    constraint_l = (constraint or '').lower()

    if constraint and constraint in CONSTRAINT_MESSAGES:
        return CONSTRAINT_MESSAGES[constraint]

    if constraint_l:
        for fragment, status, msg in CONSTRAINT_SUBSTRINGS:
            if fragment in constraint_l:
                return status, msg

    if pgcode == PG_UNIQUE:
        return 409, 'Conflicto de unicidad en base de datos.'

    if pgcode == PG_FOREIGN_KEY:
        return 400, 'Referencia inválida: una clave foránea no existe.'

    if pgcode == PG_CHECK:
        return 400, 'Los datos no cumplen una restricción de validación.'

    if pgcode == PG_NOT_NULL:
        return 400, 'Falta un campo obligatorio en base de datos.'

    return 409, 'Conflicto de integridad en base de datos.'
