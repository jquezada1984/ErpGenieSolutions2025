import os
from dotenv import load_dotenv

load_dotenv()


def _first_non_empty_env(*names: str) -> str:
    for name in names:
        v = os.getenv(name, '').strip()
        if v:
            return v
    raise RuntimeError(
        f'Defina al menos una de {", ".join(names)} en el entorno (.env).'
    )


def _with_psycopg2(uri: str) -> str:
    """SQLAlchemy 2.1 toma psycopg v3 si la URL es postgresql://.
    Estas imágenes instalan psycopg2-binary.
    """
    value = (uri or '').strip()
    if not value or value.lower().startswith('sqlite'):
        return value
    scheme, sep, rest = value.partition('://')
    if not sep:
        return value
    driver = scheme.split('+', 1)
    base = driver[0].lower()
    if base not in ('postgresql', 'postgres'):
        return value
    if len(driver) > 1 and driver[1].lower() == 'psycopg2':
        return value
    return 'postgresql+psycopg2://' + rest


class Config:
    SQLALCHEMY_DATABASE_URI = _with_psycopg2(os.getenv('DATABASE_URL', ''))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = _first_non_empty_env('SECRET_KEY', 'JWT_SECRET', 'JWT_SECRET_KEY')
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'connect_args': {'sslmode': 'require'},
    }
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
