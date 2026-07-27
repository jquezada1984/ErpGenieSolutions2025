"""Resolución de contexto multiempresa (headers Gateway)."""
from __future__ import annotations

import re
import uuid
from typing import Any, Dict, Optional, Tuple

_UUID_RE = re.compile(
    r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
)


def read_request_ctx(headers) -> Tuple[Optional[str], Optional[str], str]:
    id_empresa = headers.get('X-Company-Id') or headers.get('x-company-id')
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    scope = headers.get('X-Scope-Acceso') or headers.get('x-scope-acceso') or 'EMPRESA'
    return (
        str(id_empresa).strip() if id_empresa else None,
        str(user_id).strip() if user_id else None,
        str(scope).strip().upper() or 'EMPRESA',
    )


def resolve_id_empresa(
    header_company: Optional[str],
    body: Optional[Dict[str, Any]],
    scope_acceso: str,
) -> str:
    """
    Fuente de verdad: X-Company-Id (como BancoCaja/Tercero + gateway).

    EMPRESA: solo header (ignora body.id_empresa).
    GLOBAL: header preferente; si falta, body.id_empresa (selección UI / Item).
    """
    body_empresa = None
    if body and body.get('id_empresa'):
        body_empresa = str(body.get('id_empresa')).strip() or None

    if scope_acceso == 'EMPRESA':
        if not header_company:
            raise ValueError('Falta X-Company-Id en headers')
        return header_company

    effective = header_company or body_empresa
    if not effective:
        raise ValueError('Debe seleccionar empresa (X-Company-Id)')
    return effective


def require_user_id(user_id: Optional[str]) -> str:
    """
    Obliga X-User-Id UUID para operaciones de escritura con auditoría.
    No permite created_by/updated_by nulos en gasto.
    """
    if not user_id or not str(user_id).strip():
        raise ValueError('Falta X-User-Id en headers')
    value = str(user_id).strip()
    if not _UUID_RE.match(value):
        raise ValueError('X-User-Id debe ser un UUID válido')
    try:
        uuid.UUID(value)
    except (ValueError, TypeError) as e:
        raise ValueError('X-User-Id debe ser un UUID válido') from e
    return value
