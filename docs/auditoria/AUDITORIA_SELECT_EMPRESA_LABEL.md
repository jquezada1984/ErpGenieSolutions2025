# Auditoría: SelectEmpresa – Mostrar "RUC - Nombre"

**Objetivo:** Que el selector de empresa muestre `RUC - Nombre de la empresa` en lugar de solo el nombre.  
**Estado:** Solo auditoría; sin modificación de código.

---

## 1. Componente que implementa el selector de empresas

El selector de empresas está implementado en un componente dedicado:

| Concepto | Valor |
|----------|--------|
| **Nombre del componente** | `SelectEmpresa` |
| **Ruta exacta del archivo** | `frontReact/src/components/SelectEmpresa.tsx` |

---

## 2. Query GraphQL que trae las empresas

La query que alimenta al selector se define en la vista que usa `SelectEmpresa`. En el flujo de **terceros** (formulario de tercero, sección comercial):

**Archivo donde está definida la query:**  
`frontReact/src/views/terceros/secciones/SeccionTerceroComercialOrganizacion.tsx`

**Query usada:**

```graphql
query GetEmpresas {
  empresas {
    id_empresa
    nombre
    ruc
    estado
  }
}
```

**¿La query ya devuelve el campo `ruc`?**  
**Sí.** El campo `ruc` está incluido en la query (`ruc` en la selección). El backend NestJS (entidad `Empresa` en TerceroNestJs) expone el campo `ruc` vía GraphQL (`TerceroNestJs/src/modules/empresa/entities/empresa.entity.ts`: `@Field()` en `ruc`). No es necesario cambiar la query para obtener RUC.

El Gateway, cuando obtiene empresas para el módulo de terceros (`gateway-api/src/services/terceroNestJs.js`, función `listarEmpresas`), también solicita `id_empresa`, `nombre`, `ruc` y `estado`, por lo que los datos que llegan al front ya incluyen `ruc`.

---

## 3. Construcción actual del `label` del select

En **`frontReact/src/components/SelectEmpresa.tsx`** las opciones se construyen así:

```ts
const options = empresas.map((emp) => ({
  value: emp.id_empresa,
  label: emp.nombre,
}));
```

- **Label actual:** solo `emp.nombre` (ej.: "Mediglobal S.A.").
- **Value:** `emp.id_empresa` (UUID).

La interfaz `SelectEmpresaProps` ya declara que cada elemento de `empresas` puede tener `ruc`:

```ts
empresas: {
  id_empresa: string;
  nombre: string;
  ruc: string;
  estado: boolean;
}[];
```

Por tanto, en el componente ya se recibe `ruc`; solo se usa `nombre` para el `label`.

---

## 4. Valor del select (`value`)

El valor del select es **`id_empresa`** (UUID de la empresa). Esto no debe cambiarse:

- En el mapeo de opciones: `value: emp.id_empresa`.
- El componente recibe `value` y llama `onChange(value)` con el `id_empresa` seleccionado.

---

## 5. Resumen para el cambio de label

| Aspecto | Detalle |
|---------|---------|
| **Archivo del componente** | `frontReact/src/components/SelectEmpresa.tsx` |
| **Query usada** | `GetEmpresas` (definida en `SeccionTerceroComercialOrganizacion.tsx`), con campos `id_empresa`, `nombre`, `ruc`, `estado`. |
| **¿Query devuelve `ruc`?** | Sí. No hace falta modificar la query. |
| **Estructura actual de `options`** | `empresas.map((emp) => ({ value: emp.id_empresa, label: emp.nombre }))` |
| **Dónde cambiar el label** | En `SelectEmpresa.tsx`, en el `map` que construye `options` (aprox. líneas 28-30). Sustituir `label: emp.nombre` por un label que combine RUC y nombre, por ejemplo: `label: emp.ruc ? `${emp.ruc} - ${emp.nombre}` : emp.nombre` (o similar si se quiere tratar RUC vacío/null). |
| **Value** | Se mantiene `value: emp.id_empresa`. |

**Ejemplo actual:**  
`Mediglobal S.A.`

**Ejemplo deseado:**  
`1790012345001 - Mediglobal S.A.`

Con la auditoría anterior, el único cambio necesario para cumplir el objetivo es ajustar la construcción del `label` en `frontReact/src/components/SelectEmpresa.tsx`, usando `emp.ruc` y `emp.nombre`.
