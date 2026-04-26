import os
from dotenv import load_dotenv

load_dotenv()


def _first_non_empty_env(*names: str) -> str:
    for name in names:
        v = os.getenv(name, '').strip()
        if v:
            return v
    raise RuntimeError(
        f'Defina al menos una de {", ".join(names)} en el entorno (.env); sin valores por defecto en código.'
    )


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
    'DATABASE_URL',
    'postgresql://postgres:XeCWl8Dam9CNUS1m@aws-0-sa-east-1.pooler.supabase.com:5432/postgres'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Flask SECRET_KEY; si solo compartes .env con Nest, suele bastar JWT_SECRET.
    SECRET_KEY = _first_non_empty_env('SECRET_KEY', 'JWT_SECRET', 'JWT_SECRET_KEY')
    
    # Configuración CORS - Gateway API
    CORS_ORIGINS = os.getenv('CORS_ORIGINS','*').split(',')