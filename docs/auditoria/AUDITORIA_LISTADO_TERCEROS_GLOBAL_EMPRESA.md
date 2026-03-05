# Auditoría: Listado de Terceros – Comportamiento GLOBAL / EMPRESA

**Objetivo:** Preparar el comportamiento GLOBAL / EMPRESA en el listado de terceros.  
**Estado:** Solo auditoría; sin modificación de código.

---

## 1. Archivo donde se renderiza la pantalla de listado

| Concepto | Valor |
|----------|--------|
| **Archivo** | `frontReact/src/views/terceros/Terceros.tsx` |
| **Componente** | `Terceros` (export default) |
| **Ruta** | `/terceros` (definida en `Router.tsx`) |

---

## 2. Query GraphQL usada para cargar los terceros

La query está definida **en el mismo archivo** `Terceros.tsx` (líneas 11-32):

```graphql
const GET_TERCEROS = gql`
  query GetTerceros {
    terceros {
      id_tercero
      nombre
      apodo
      cliente
      proveedor
      cliente_potencial
      estado
      codigo_cliente
      empresa {
        id_empresa
        nombre
      }
      tipo_tercero {
        id_tipo_tercero
        nombre
      }
      asignado_a
    }
  }
`;
```

- **Nombre de la query:** `GetTerceros`
- **Campo GraphQL:** `terceros` (sin argumentos en la query).

---

## 3. ¿La query recibe algún filtro (id_empresa)?

**No.** La query **no recibe ningún filtro**:

- No tiene variables (no hay `$id_empresa` ni ningún otro argumento).
- Se invoca como `getTerceros()` sin variables.

En el **backend** (NestJS):

- **Resolver:** `TerceroNestJs/src/modules/tercero/tercero.resolver.ts`  
  - `@Query(() => [Tercero], { name: 'terceros' })`  
  - `findAll(): Promise<Tercero[]>` → sin parámetros.
- **Service:** `tercero.service.ts`  
  - `findAll()` hace `this.terceroRepo.find({ relations: ['empresa', 'tipo_tercero'], order: ... })` **sin `where`**.
- **Conclusión:** Se traen **todos los terceros** de la base de datos, sin filtrar por empresa.

Para soportar EMPRESA habría que:

1. Añadir en el backend una query (o argumento opcional) que acepte `id_empresa` y filtrar en `findAll`.
2. En el frontend, pasar `id_empresa` cuando el usuario sea de scope EMPRESA.

---

## 4. Dónde se ejecuta la llamada inicial al backend

La carga se hace con **Apollo `useLazyQuery`** y un **`useEffect`** que llama a `loadTerceros`:

**Declaración del lazy query (aprox. líneas 61-64):**

```ts
const [getTerceros, { loading: queryLoading }] = useLazyQuery(GET_TERCEROS, {
  fetchPolicy: 'cache-and-network',
  errorPolicy: 'all',
});
```

**Ejecución inicial (aprox. líneas 66-73):**

```ts
useEffect(() => {
  loadTerceros();
}, []);

useEffect(() => {
  if (location.pathname === '/terceros') {
    loadTerceros();
  }
}, [location.pathname]);
```

**Función que llama al backend (aprox. líneas 75-94):**

```ts
const loadTerceros = async () => {
  try {
    setLoading(true);
    setError(null);
    const { data } = await getTerceros();   // ← llamada real al backend (sin variables)
    if (data && data.terceros) {
      setTerceros(data.terceros);
    } else {
      setTerceros([]);
    }
  } catch (error: any) {
    // ...
  } finally {
    setLoading(false);
  }
};
```

**Resumen:**

- La **carga inicial** ocurre en el primer `useEffect` (montaje del componente).
- Se **vuelve a cargar** cuando `location.pathname === '/terceros'`.
- El **punto único** donde se piden datos al backend es **`loadTerceros()`**, que ejecuta `getTerceros()` (sin variables).

---

## 5. Cómo se pasan los datos a ReactTable

1. **Estado:** Los terceros se guardan en estado local:  
   `const [terceros, setTerceros] = useState<Tercero[]>([]);`  
   y se actualizan en `loadTerceros` con `setTerceros(data.terceros)`.

2. **Transformación a datos de tabla (aprox. líneas 118-132):**  
   Se deriva `tableData` a partir de `terceros`:

   ```ts
   const tableData = terceros.map((tercero) => {
     let tipo = '...';
     return {
       ...tercero,
       identificacion: tercero.codigo_cliente || tercero.apodo || 'N/A',
       tipo: tercero.tipo_tercero?.nombre || tipo,
       empresa_nombre: tercero.empresa?.nombre || 'N/A',
     };
   });
   ```

3. **ReactTable (aprox. líneas 236-250):**  
   Recibe directamente ese array y las columnas:

   ```tsx
   <ReactTable
     data={tableData}
     columns={columns}
     defaultPageSize={10}
     ...
     loading={loading || queryLoading}
   />
   ```

**Resumen:** Los datos van de **`data.terceros`** → **`terceros`** (estado) → **`tableData`** (mapeo) → **`ReactTable`** con `data={tableData}` y `columns={columns}`.

---

## 6. ¿El usuario actual (GLOBAL / EMPRESA) está disponible en el frontend?

**Sí**, pero **no** en `Terceros.tsx`. Está disponible en otras vistas mediante el JWT:

- **Hook:** `frontReact/src/hooks/useJwtPayload.ts`  
  - Decodifica el token de `localStorage.getItem('accessToken')` y devuelve el payload (objeto plano).
- **Uso en el proyecto (ejemplo):** En `SeccionTerceroComercialOrganizacion.tsx` se usa así:
  - `const payload = useJwtPayload();`
  - `const scope = payload?.scope_acceso || 'EMPRESA';`
  - `const empresaUsuario = payload?.id_empresa;`

Por tanto, en el frontend se puede saber:

- **Scope:** `payload.scope_acceso` (ej. `'GLOBAL'` o `'EMPRESA'`).
- **Empresa del usuario (si aplica):** `payload.id_empresa`.

**En el listado `Terceros.tsx`:**  
No se usa `useJwtPayload`. No se lee `scope_acceso` ni `id_empresa`, por lo que el listado no distingue hoy entre usuario GLOBAL y EMPRESA.

---

## 7. Resumen e interceptación del flujo

| Tema | Conclusión |
|------|------------|
| **Archivo del listado** | `frontReact/src/views/terceros/Terceros.tsx` |
| **Query usada** | `GetTerceros` → campo `terceros` (sin variables). |
| **Filtro actual** | Ninguno; el backend devuelve todos los terceros. |
| **Dónde se ejecuta la carga inicial** | En `loadTerceros()`, llamada desde dos `useEffect` (montaje y cuando `location.pathname === '/terceros'`). |
| **Datos a ReactTable** | `terceros` → `tableData` (map con identificacion, tipo, empresa_nombre) → `<ReactTable data={tableData} columns={columns} />`. |
| **Usuario GLOBAL/EMPRESA** | Disponible vía `useJwtPayload()` → `payload.scope_acceso`, `payload.id_empresa`. No usado en `Terceros.tsx`. |

### Cómo interceptar el flujo para GLOBAL / EMPRESA

Objetivo típico:

- **GLOBAL:** ver todos los terceros (comportamiento actual).
- **EMPRESA:** ver solo terceros de la empresa del usuario (`id_empresa` del token).

**Opción A – Interceptar en el frontend (sin tocar backend):**

1. En `Terceros.tsx` usar `useJwtPayload()` y obtener `scope` e `id_empresa`.
2. En `loadTerceros()`:
   - Si `scope === 'EMPRESA'` y hay `id_empresa`: después de `setTerceros(data.terceros)`, filtrar en cliente: `setTerceros(data.terceros.filter(t => t.empresa?.id_empresa === id_empresa))`.
   - Si `scope === 'GLOBAL'`: dejar `data.terceros` tal cual.
3. Sigue siendo necesario traer todos los terceros cuando el usuario es GLOBAL; para EMPRESA se descarta parte en cliente (menos eficiente que filtrar en backend).

**Opción B – Interceptar con query parametrizada (recomendado):**

1. **Backend (NestJS):** Añadir argumento opcional a la query `terceros`, por ejemplo `id_empresa: String` (opcional). En el service, si viene `id_empresa`, hacer `where: { id_empresa }` (y mismo criterio en `findAll` o en un método `findAllByEmpresa(id_empresa)`).
2. **Frontend (`Terceros.tsx`):**
   - Usar `useJwtPayload()` → `scope`, `id_empresa`.
   - Cambiar la query a algo como `terceros(id_empresa: $id_empresa)` con variable opcional.
   - En `loadTerceros()`:
     - Si `scope === 'EMPRESA'` y hay `id_empresa`: llamar `getTerceros({ variables: { id_empresa } })`.
     - Si `scope === 'GLOBAL'`: llamar `getTerceros()` sin variables (o con `id_empresa: null` si el backend lo acepta).
3. Así no se cargan datos de otras empresas cuando el usuario es EMPRESA y se evita traer de más.

**Sobre “no cargar datos si el usuario es GLOBAL”:**  
Si la intención fuera literalmente “no cargar cuando es GLOBAL”, sería un caso especial (por ejemplo, deshabilitar o no mostrar listado para GLOBAL). Lo habitual es: GLOBAL ve todo; EMPRESA ve solo su empresa. La interceptación anterior asume este último comportamiento.

---

**Conclusión:** El listado vive en `Terceros.tsx`, usa `GetTerceros` sin filtros y carga en `loadTerceros()` (useEffect). Para GLOBAL/EMPRESA hay que usar `useJwtPayload()` en esta pantalla y, de forma recomendada, añadir filtro opcional por `id_empresa` en la query y en el backend, y en el frontend pasar la variable solo cuando el usuario sea EMPRESA.
