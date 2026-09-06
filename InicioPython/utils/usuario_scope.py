"""Reglas de scope_acceso al crear/actualizar usuario (solo GLOBAL puede asignar GLOBAL)."""

from __future__ import annotations

from typing import Any, Dict, MutableMapping


def apply_scope_on_create(loaded: MutableMapping[str, Any], caller_is_global: bool) -> Dict[str, Any]:
    out = dict(loaded)
    if not caller_is_global:
        out['scope_acceso'] = 'EMPRESA'
    elif 'scope_acceso' not in out or out.get('scope_acceso') is None:
        out['scope_acceso'] = 'EMPRESA'
    return out


def apply_scope_on_update(loaded: MutableMapping[str, Any], caller_is_global: bool) -> Dict[str, Any]:
    out = dict(loaded)
    if not caller_is_global:
        out.pop('scope_acceso', None)
    return out
