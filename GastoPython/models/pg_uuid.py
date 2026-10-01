from sqlalchemy.dialects.postgresql import UUID

# uuid en PostgreSQL, str en Python — evita mismatch sentinel en flush/commit
PGUUID = UUID(as_uuid=False)
