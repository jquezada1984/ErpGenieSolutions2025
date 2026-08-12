"""Contexto de empresa desde headers del gateway (X-Company-Id / X-Scope-Acceso)."""
from flask import request
from werkzeug.exceptions import BadRequest, Forbidden


def get_company_id(required: bool = True) -> str | None:
    """Lee id_empresa del header X-Company-Id (el gateway ya resolvió GLOBAL/EMPRESA)."""
    company_id = (
        request.headers.get('X-Company-Id')
        or request.headers.get('x-company-id')
        or ''
    ).strip()
    if required and not company_id:
        raise BadRequest('Falta X-Company-Id (seleccione empresa)')
    return company_id or None


def get_scope_acceso() -> str:
    return (
        request.headers.get('X-Scope-Acceso')
        or request.headers.get('x-scope-acceso')
        or 'EMPRESA'
    ).strip().upper()
