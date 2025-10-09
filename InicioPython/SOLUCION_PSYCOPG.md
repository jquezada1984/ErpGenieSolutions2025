# Solución para el Error de psycopg2

## Problema
```
ImportError: /usr/local/lib/python3.13/site-packages/psycopg2/_psycopg.cpython-313-x86_64-linux-gnu.so: undefined symbol: _PyInterpreterState_Get
```

## Causa
El error se debe a una incompatibilidad entre Python 3.13 y psycopg2-binary 2.9.9. El símbolo `_PyInterpreterState_Get` no está disponible en la versión de psycopg2 que estás usando.

## Soluciones Implementadas

### 1. Solución Principal: Migración a psycopg3
- ✅ Actualizado `requirements.txt` para usar `psycopg[binary]==3.2.3`
- ✅ Cambiado Python de 3.13.5 a 3.12 en el Dockerfile
- ✅ Creado script de verificación de conexión

### 2. Solución Alternativa: psycopg2 con Python 3.12
- ✅ Archivo de respaldo `requirements-psycopg2.txt`
- ✅ Scripts de construcción para ambas opciones

## Archivos Modificados

### requirements.txt
```diff
- psycopg2-binary==2.9.9
+ psycopg[binary]==3.2.3
```

### Dockerfile
```diff
- FROM python:3.13.5-slim
+ FROM python:3.12-slim
```

## Archivos Nuevos
- `test_psycopg_connection.py` - Script de verificación de conexión
- `start_server_improved.py` - Script de inicio con verificación
- `build_and_test.bat` - Script de construcción para Windows
- `build_and_test.sh` - Script de construcción para Linux/Mac
- `requirements-psycopg2.txt` - Respaldo de la configuración anterior

## Cómo Usar

### Opción 1: Construir con psycopg3 (Recomendado)
```bash
# En Windows
build_and_test.bat psycopg3

# En Linux/Mac
./build_and_test.sh psycopg3
```

### Opción 2: Construir con psycopg2 (Fallback)
```bash
# En Windows
build_and_test.bat psycopg2

# En Linux/Mac
./build_and_test.sh psycopg2
```

### Opción 3: Solo probar conexión
```bash
# En Windows
build_and_test.bat test

# En Linux/Mac
./build_and_test.sh test
```

## Verificación Manual

### Probar Conexión
```bash
docker run --rm erp-python-service:psycopg3 python test_psycopg_connection.py
```

### Iniciar Servicio
```bash
docker run -p 5000:5000 erp-python-service:psycopg3
```

## Notas Importantes

1. **psycopg3** es la versión moderna y recomendada de psycopg
2. **Python 3.12** es más estable para este tipo de aplicaciones
3. El script de inicio verifica la conexión antes de iniciar Flask
4. Se incluyen scripts de respaldo por si necesitas volver a psycopg2

## Troubleshooting

### Si psycopg3 no funciona:
1. Usa el script con `psycopg2`
2. Verifica que PostgreSQL esté ejecutándose
3. Revisa las variables de entorno `DATABASE_URL`

### Si el problema persiste:
1. Verifica la versión de Docker
2. Limpia las imágenes Docker: `docker system prune -a`
3. Reconstruye desde cero: `docker build --no-cache -t erp-python-service .`










