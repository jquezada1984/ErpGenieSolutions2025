"""Gráficos estadísticos → PNG para incrustar en PDF (sin navegador)."""
from __future__ import annotations

import io
from typing import List, Sequence, Tuple

import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt  # noqa: E402


def barras_png(
    etiquetas: Sequence[str],
    valores: Sequence[float],
    titulo: str = '',
    ancho: float = 7.2,
    alto: float = 3.4,
) -> bytes:
    fig, ax = plt.subplots(figsize=(ancho, alto), dpi=120)
    ax.bar(list(etiquetas) or ['—'], list(valores) or [0], color='#1d4ed8')
    ax.set_title(titulo or 'Totales')
    ax.tick_params(axis='x', rotation=35, labelsize=8)
    ax.tick_params(axis='y', labelsize=8)
    fig.tight_layout()
    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    plt.close(fig)
    return buf.getvalue()


def series_mes_png(puntos: List[Tuple[str, float]], titulo: str) -> bytes:
    labels = [p[0] for p in puntos] or ['—']
    vals = [p[1] for p in puntos] or [0.0]
    return barras_png(labels, vals, titulo=titulo)
