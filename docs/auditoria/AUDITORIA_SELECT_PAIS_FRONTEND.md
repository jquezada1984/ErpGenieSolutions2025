# Auditoría Frontend – Componente Select de País

**Objetivo:** Analizar cómo está implementado el select de país en el proyecto.  
**Estado:** Solo auditoría; no se ha modificado ningún archivo.

---

## 1. Componentes existentes (Select de País)

| Componente buscado   | ¿Existe? | Ruta |
|----------------------|----------|------|
| **SelectPais.tsx**   | **No**   | — |
| **CountrySelect.tsx**| **Sí**   | `frontReact/src/components/CountrySelect.tsx` |
| **SelectCountry.tsx**| **No**   | — |

**Conclusión:** El único componente de select de país que existe en el proyecto es **CountrySelect.tsx**, en la ruta indicada.

---

## 2. Uso del select de país en el módulo Terceros

### Archivos donde se usa

El select de país se utiliza en **dos** archivos dentro de `src/views/terceros/`:

| Archivo | Ruta completa |
|---------|-------------------------------|
| Sección ubicación/contacto | `src/views/terceros/secciones/SeccionTerceroUbicacionContacto.tsx` |
| Sección dirección de contacto | `src/views/terceros/contactos/secciones/SeccionContactoDireccion.tsx` |

### Componente usado

- **Nombre:** `CountrySelect`
- **Import:** `import CountrySelect from '../../../components/CountrySelect'` (o `'../../../../components/CountrySelect'` según la profundidad del archivo).

### Props que se le pasan

En ambos archivos el uso es equivalente:

- `id="id_pais"`
- `name="id_pais"`
- `value={f.id_pais}` (string; puede ser `''`)
- `onChange={chg}` (en Terceros, `chg` recibe el evento y hace `const { name, value } = e.target`; el componente emite `value: country.id_pais`)
- `disabled={loadingPaises}`
- `loading={loadingPaises}`
- `countries={paises}` (array obtenido de la query GraphQL `GET_PAISES`)
- `label={<> ... País </>}` (con o sin icono)

### Origen de los datos (catálogo)

- Query GraphQL **GET_PAISES**: `paises { id_pais, nombre, codigo_iso, icono }`.
- Se usa `useQuery(GET_PAISES)` y `paises = paisesData?.paises || []`.

### Valor que devuelve

- **Tipo:** `id_pais` es **string** (UUID).
- El componente `CountrySelect` en `handleSelect` llama a `onChange` con `value: country.id_pais` (string). El estado del formulario en Terceros guarda `id_pais` como string.

---

## 3. Uso del select de país en el módulo Empresa

### Archivo

- **Archivo:** `src/views/empresas/secciones/SeccionEmpresa.tsx`

### Componente usado

- **Nombre:** `CountrySelect` (el mismo que en Terceros).
- **Import:** `import CountrySelect from '../../../components/CountrySelect';`

### Props que se le pasan

- `id="id_pais"`
- `name="id_pais"`
- `value={formData.id_pais}` (string)
- `onChange={handleInputChange}` (handler genérico que actualiza `formData` por `name`/`value`)
- `disabled={loadingPaises}`
- `loading={loadingPaises}`
- `countries={paises}`
- `label={<> ... País ... </>}` (con iconos)

### Origen de los datos (catálogo)

- Misma query **GET_PAISES**: `paises { id_pais, nombre, codigo_iso, icono }`.
- Mismo patrón: `useQuery(GET_PAISES)` y `paises = paisesData?.paises || []`.

### Valor que devuelve

- **Tipo:** `id_pais` es **string** (mismo comportamiento que en Terceros; el evento tiene `target.value = country.id_pais`).

---

## 4. Select de Provincia

### En el módulo Terceros

- **Componente:** `SelectProvincia`
- **Ruta del componente:** `src/components/selects/SelectProvincia.tsx`
- **Uso:** En `SeccionTerceroUbicacionContacto.tsx` y en `SeccionContactoDireccion.tsx`.
- **Dependencia de país:** **Sí.** Se pasa `id_pais={f.id_pais || null}`. El componente internamente usa la query `provinciasByPais(idPais)` (o equivalente) para cargar provincias según el país seleccionado.
- **Valor:** Devuelve `id_provincia` (string/UUID) vía `onChange`.

### En el módulo Empresa

- **Componente:** No se usa `SelectProvincia`.
- **Implementación actual:** Un **`<Input type="select">`** manual en `SeccionEmpresa.tsx` (aprox. líneas 348–366).
- **Datos:** Query **GET_PROVINCIAS** que trae todas las provincias (`provincias { id_provincia, nombre, id_pais }`). Luego se filtra en cliente con `getProvinciasByPais(formData.id_pais)` (filtrar por `id_pais`).
- **Dependencia de país:** **Sí:** el select se rellena con `getProvinciasByPais(formData.id_pais)` y se deshabilita si no hay `formData.id_pais`.

**Resumen Provincia**

| Aspecto           | Terceros              | Empresa                          |
|-------------------|------------------------|----------------------------------|
| Componente        | SelectProvincia        | Input type="select" manual      |
| Depende de id_pais| Sí (prop + query)      | Sí (filtro en cliente)          |
| Catálogo          | Query por país (backend)| Todas las provincias + filtro  |

---

## 5. Informe resumido

### A) Componente correcto usado por Terceros (select de país)

- **Componente:** `CountrySelect`
- **Ruta:** `frontReact/src/components/CountrySelect.tsx`
- **Catálogo:** Query GraphQL `GET_PAISES` (`paises { id_pais, nombre, codigo_iso, icono }`).
- **Valor:** `id_pais` (string).

### B) Componente actual usado por Empresa (select de país)

- **Componente:** `CountrySelect` (el mismo que Terceros).
- **Ruta de uso:** `frontReact/src/views/empresas/secciones/SeccionEmpresa.tsx`
- **Catálogo:** Misma query `GET_PAISES`, mismo origen de datos.
- **Valor:** `id_pais` (string).

### C) ¿Ambos usan el mismo catálogo para País?

**Sí.** Terceros y Empresa usan el mismo componente **CountrySelect** y la misma query GraphQL **GET_PAISES** (mismos campos: `id_pais`, `nombre`, `codigo_iso`, `icono`). El catálogo de países es único y compartido.

### D) Recomendación para alinear Empresa con el patrón de Terceros

- **País:** Ya está alineado. Empresa usa el mismo `CountrySelect` y el mismo catálogo que Terceros. No es necesario cambiar el select de país en Empresa.
- **Provincia:** Sí conviene alinear. En Terceros se usa el componente reutilizable **SelectProvincia** (con búsqueda, dependiente de `id_pais` y consulta `provinciasByPais`). En Empresa se usa un `<Input type="select">` manual con todas las provincias y filtro en cliente.  
  **Recomendación:** Sustituir en `SeccionEmpresa.tsx` el `<Input type="select">` de provincia por el componente **SelectProvincia**, pasando `id_pais={formData.id_pais}`, `value={formData.id_provincia}`, y un `onChange` que actualice `formData` y llame a `onChange(formData)`, de forma análoga a como se hace en las secciones de Terceros. Así se reutiliza el mismo catálogo/patrón y se mantiene consistencia con el resto del sistema.

---

**Conclusión:** El select de **país** está unificado: ambos módulos usan **CountrySelect** y el mismo catálogo GraphQL. La diferencia de patrón está en **provincia**: Terceros usa **SelectProvincia**; Empresa usa un select manual. La auditoría no ha modificado ningún archivo.
