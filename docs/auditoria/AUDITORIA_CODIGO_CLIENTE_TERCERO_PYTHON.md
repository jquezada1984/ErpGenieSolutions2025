# Auditoría: generación del campo `codigo_cliente` en TerceroPython

**Objetivo:** Entender exactamente cómo se genera el código cliente (ej. `CU2603-00001`) para poder replicar la misma lógica para `codigo_proveedor` con prefijo `SU`.  
**Alcance:** Solo análisis. No se ha modificado código.

---

## Resumen ejecutivo

| Pregunta | Respuesta |
|----------|-----------|
| **1. Dónde se genera** | En el **servicio** `tercero_service.py`, función privada `_gen_codigo_cliente`. |
| **2. Formato** | `CU` + `yymm` (año 2 dígitos + mes 2 dígitos) + `-` + consecutivo de 5 dígitos: `CU{yymm}-{n:05d}`. Ejemplo: `CU2603-00001`. |
| **3. Consecutivo** | Bucle desde 1 hasta 99999; se elige el primer valor tal que `exists_codigo_cliente(id_empresa, candidate)` sea falso. No hay tabla de secuencias ni consulta MAX. |
| **4. Fecha / timestamp** | Se usa **fecha/hora actual**: `datetime.utcnow()` (o el parámetro opcional `when`). Solo se usa para formar `yymm` con `dt.strftime("%y%m")`. |
| **5. Función reutilizable** | Sí: `_gen_codigo_cliente(id_empresa, when=None)` es una función interna del módulo. No está expuesta fuera del servicio. Para `codigo_proveedor` se podría extraer una función genérica por prefijo (ej. `_gen_codigo_tercero(prefix, id_empresa, when)`). |
| **6. Parte del flujo** | Se ejecuta en **`servicio_crear_tercero`** (servicio), **antes** de llamar a `create_tercero` del repositorio. Si el payload no trae `codigo_cliente` (o viene vacío), se asigna el valor generado. |

---

## Archivos donde aparece `codigo_cliente`

### 1. `TerceroPython/services/tercero_service.py`

**Referencias:** generación del código, autocompletado en create, validación de unicidad en create y update.

#### Fragmento 1 – Función que genera el código (líneas 23–30)

```python
def _gen_codigo_cliente(id_empresa: str, when: Optional[datetime]=None) -> str:
    dt = when or datetime.utcnow()
    yymm = dt.strftime("%y%m")
    # búsqueda simple no concurrente
    for n in range(1, 100000):
        candidate = f"CU{yymm}-{n:05d}"
        if not exists_codigo_cliente(id_empresa, candidate):
            return candidate
    return f"CU{yymm}-99999"
```

**Lógica:**  
- Usa la fecha actual (UTC) o `when` para obtener `yymm` (año en 2 cifras + mes en 2 cifras).  
- Genera candidatos `CU{yymm}-00001`, `CU{yymm}-00002`, … hasta 99999.  
- Devuelve el primer candidato que **no** exista ya en la empresa (`exists_codigo_cliente`).  
- Si se agotan los números, devuelve `CU{yymm}-99999`.

#### Fragmento 2 – Uso en creación (líneas 40–46)

```python
    # autogenerar código si viene vacío
    if not data.get("codigo_cliente"):
        data["codigo_cliente"] = _gen_codigo_cliente(id_empresa)

    # unicidad
    if exists_codigo_cliente(id_empresa, data["codigo_cliente"]):
        raise ValidationError({"codigo_cliente":["Ya existe para esta empresa."]})
```

**Lógica:**  
- Si el payload no trae `codigo_cliente` o viene vacío, se asigna el resultado de `_gen_codigo_cliente(id_empresa)`.  
- Luego se comprueba unicidad; si ya existe, se lanza `ValidationError`.

#### Fragmento 3 – Unicidad en actualización (líneas 61–64)

```python
    if "codigo_cliente" in data and data["codigo_cliente"]:
        if exists_codigo_cliente(id_empresa, data["codigo_cliente"], exclude_id=id_tercero):
            raise ValidationError({"codigo_cliente":["Ya existe para esta empresa."]})
```

**Lógica:**  
- Si en el update se envía `codigo_cliente`, se comprueba que no exista en otra fila de la misma empresa (excluyendo el tercero actual).

---

### 2. `TerceroPython/repositories/tercero_repository.py`

**Referencias:** asignación del valor en create, lista de campos en update, función de existencia.

#### Fragmento 1 – Create (línea 18)

```python
        codigo_cliente=payload.get("codigo_cliente"),
```

**Lógica:**  
- Al crear el modelo `Tercero`, se toma `codigo_cliente` del payload. Ese valor ya puede venir generado por el servicio cuando no se envió en la petición.

#### Fragmento 2 – Update, lista de campos (líneas 79–81)

```python
        "cliente_potencial","cliente","proveedor",
        "nombre","apodo","codigo_cliente","estado","sujeto_iva",
        ...
```

**Lógica:**  
- `codigo_cliente` es uno de los campos que el update puede modificar.

#### Fragmento 3 – Función de unicidad (líneas 138–146)

```python
def exists_codigo_cliente(id_empresa: str, codigo_cliente: str, exclude_id: Optional[str] = None) -> bool:
    if not codigo_cliente:
        return False
    q = Tercero.query.filter(
        Tercero.id_empresa == id_empresa,
        db.func.lower(Tercero.codigo_cliente) == codigo_cliente.lower()
    )
    if exclude_id:
        q = q.filter(Tercero.id_tercero != exclude_id)
    return db.session.query(q.exists()).scalar()
```

**Lógica:**  
- Comprueba si existe otro tercero en la misma `id_empresa` con el mismo `codigo_cliente` (comparación case-insensitive).  
- `exclude_id` sirve para no contar el propio registro en updates.

---

### 3. `TerceroPython/models/tercero.py`

**Fragmento (línea 29)**

```python
    codigo_cliente         = db.Column(db.String(30))  # usa unique parcial en BD si lo prefieres
```

**Lógica:**  
- Definición de la columna en el modelo: string, longitud 30, sin restricción unique a nivel de modelo (la unicidad se valida por empresa en el servicio/repositorio).

---

### 4. `TerceroPython/schemas/tercero_schema.py`

**Fragmentos (líneas 15, 65, 102)**

```python
    codigo_cliente         = fields.Str(allow_none=True)
```

**Lógica:**  
- Campo opcional en los esquemas Marshmallow (create, update y salida). Solo define que puede venir/ir como string o nulo; no genera el valor.

---

### 5. `TerceroPython/api/tercero_routes.py`

**Fragmentos (líneas 35–36 y 58–59)**

```python
        if "codigo_cliente" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({'error': 'Código cliente duplicado', 'field': 'codigo_cliente', 'type': 'duplicate'}), 409
```

**Lógica:**  
- Ante un `IntegrityError` de BD, si el mensaje menciona "codigo_cliente" y "unique", se devuelve 409 con mensaje de código cliente duplicado (create y update).

---

### 6. `TerceroPython/ARQUITECTURA_TERCERO_PYTHON.md`

**Referencias:** documentación del repositorio y del servicio.

- Cita `exists_codigo_cliente` y la generación automática tipo `CUyymm-00001`.  
- No contiene lógica ejecutable.

---

## Formato generado: `CU2603-00001`

| Parte | Origen | Ejemplo |
|-------|--------|--------|
| **CU** | Prefijo fijo (clientes). | CU |
| **2603** | `yymm`: año 2 dígitos + mes 2 dígitos desde `datetime.utcnow()` (o `when`). | Año 2026, marzo → 2603 |
| **-** | Separador fijo. | - |
| **00001** | Consecutivo de 5 dígitos: primer número 1..99999 que no exista ya para esa empresa en ese `yymm`. | 00001 |

---

## Cómo replicar para `codigo_proveedor` con prefijo `SU`

1. **Misma ubicación:** servicio (antes de llamar al repositorio en create).  
2. **Misma idea de formato:** `SU{yymm}-{n:05d}` (ej. `SU2603-00001`).  
3. **Consecutivo:** misma lógica: bucle 1..99999 y función tipo `exists_codigo_proveedor(id_empresa, candidate)` (o una función genérica por prefijo).  
4. **Fecha:** mismo criterio: `datetime.utcnow()` (o `when`) y `strftime("%y%m")`.  
5. **Reutilización:** se puede extraer una función genérica, por ejemplo `_gen_codigo_tercero(prefix: str, id_empresa: str, when: Optional[datetime], exists_fn: Callable)`, y llamarla con `"CU"` y `exists_codigo_cliente` para clientes, y con `"SU"` y `exists_codigo_proveedor` para proveedores.

---

## Flujo resumido

1. Cliente llama a la API de creación de tercero (con o sin `codigo_cliente`).  
2. **API** (`tercero_routes`) recibe el payload y llama al **servicio** `servicio_crear_tercero`.  
3. **Servicio** deserializa con `TerceroCreateSchema`, normaliza UUIDs y:  
   - Si no hay `codigo_cliente` → asigna `_gen_codigo_cliente(id_empresa)`.  
   - Comprueba unicidad con `exists_codigo_cliente`; si existe, lanza `ValidationError`.  
4. **Servicio** llama a **repositorio** `create_tercero(data, id_empresa, user_id)`.  
5. **Repositorio** instancia `Tercero(...)` con `codigo_cliente=payload.get("codigo_cliente")` y hace `db.session.add` + commit.

La generación del código y la validación de unicidad ocurren **solo en el servicio**; el repositorio solo persiste el valor recibido.
