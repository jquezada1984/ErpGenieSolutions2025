# Importar todos los modelos para que SQLAlchemy los registre
from .tercero import Tercero
from .contacto import Contacto
from .catalogos import (
    CondicionPagoCatalogo,
    FormaPagoCatalogo,
    TipoTerceroCatalogo,
    IncotermCatalogo,
    Pais,
    Empresa
)
from .media import Media

__all__ = [
    'Tercero',
    'Contacto',
    'CondicionPagoCatalogo',
    'FormaPagoCatalogo',
    'TipoTerceroCatalogo',
    'IncotermCatalogo',
    'Pais',
    'Empresa',
    'Media',
]
