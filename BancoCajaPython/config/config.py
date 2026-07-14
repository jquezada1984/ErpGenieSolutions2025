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


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', '')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = _first_non_empty_env('SECRET_KEY', 'JWT_SECRET', 'JWT_SECRET_KEY')
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'connect_args': {'sslmode': 'require'},
    }
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
