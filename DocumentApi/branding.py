"""Logo y datos de empresa (multiempresa). Cache en memoria del proceso."""
from __future__ import annotations

import io
from functools import lru_cache
from typing import Any, Dict, Optional, Tuple

from PIL import Image

from db import cursor

MAX_LOGO_PX = 220


@lru_cache(maxsize=64)
def _logo_png(id_empresa: str) -> Optional[bytes]:
    with cursor() as cur:
        cur.execute(
            """SELECT logo, logotipo_cuadrado FROM empresa
               WHERE id_empresa = %s LIMIT 1""",
            (id_empresa,),
        )
        row = cur.fetchone()
    if not row:
        return None
    raw = row.get('logo') or row.get('logotipo_cuadrado')
    if not raw:
        return None
    try:
        img = Image.open(io.BytesIO(bytes(raw)))
        img = img.convert('RGBA')
        img.thumbnail((MAX_LOGO_PX, MAX_LOGO_PX), Image.Resampling.LANCZOS)
        out = io.BytesIO()
        img.save(out, format='PNG', optimize=True)
        return out.getvalue()
    except Exception:
        return None


def invalidar_cache_logo() -> None:
    _logo_png.cache_clear()


def obtener_empresa(id_empresa: str) -> Dict[str, Any]:
    with cursor() as cur:
        cur.execute(
            """SELECT id_empresa, nombre, ruc, direccion, telefono, email, web,
                      poblacion, codigo_postal
               FROM empresa WHERE id_empresa = %s LIMIT 1""",
            (id_empresa,),
        )
        row = cur.fetchone()
    if not row:
        raise ValueError('Empresa no encontrada')
    return dict(row)


def logo_png(id_empresa: str) -> Optional[bytes]:
    return _logo_png(id_empresa)


def logo_size_mm(png: bytes, max_w_mm: float = 32, max_h_mm: float = 18) -> Tuple[float, float]:
    img = Image.open(io.BytesIO(png))
    w_px, h_px = img.size
    w_mm = w_px * 25.4 / 96
    h_mm = h_px * 25.4 / 96
    scale = min(max_w_mm / max(w_mm, 0.01), max_h_mm / max(h_mm, 0.01), 1.0)
    return w_mm * scale, h_mm * scale
