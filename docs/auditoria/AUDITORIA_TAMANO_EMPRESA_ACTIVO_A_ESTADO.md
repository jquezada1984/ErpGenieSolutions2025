# Auditoría de consistencia – Cambio de "activo" a "estado" (tamano_empresa)

**Contexto:** La columna de la tabla PostgreSQL `tamano_empresa` fue renombrada: `activo` → `estado`.

**Alcance:** Catálogo `tamano_empresa` en InicioNestJs.

**Objetivo:** Referencias a `activo` y cómo deben quedar con `estado`. Solo informe; no se aplican cambios.

---

## 1. Referencias encontradas

### 1.1 `src/entities/tamano-empresa.entity.ts`

| Línea | Fragmento de código |
|-------|---------------------|
| 29 | `@Field()` |
| 30 | `@Column({ type: 'boolean', default: true })` |
| 31 | `activo: boolean;` |

**Cómo debería quedar:**

| Línea | Fragmento propuesto |
|-------|---------------------|
| 29 | `@Field()` |
| 30 | `@Column({ type: 'boolean', default: true })` |
| 31 | `estado: boolean;` |

**Nota:** El nombre de la propiedad TypeScript/GraphQL debe ser `estado`. La columna en BD ya es `estado`; si el nombre de columna en TypeORM debe coincidir, usar `@Column({ name: 'estado', type: 'boolean', default: true })` solo si la tabla tiene la columna `estado` (no `activo`).

---

### 1.2 `src/services/tamano-empresa.service.ts`

| Línea | Fragmento de código |
|-------|---------------------|
| 15 | `where: { activo: true },` |

**Cómo debería quedar:**

| Línea | Fragmento propuesto |
|-------|---------------------|
| 15 | `where: { estado: true },` |

**Nota:** Si en BD `estado` deja de ser booleano (por ejemplo pasa a ser `'A'`/`'I'`), ajustar la condición (p. ej. `where: { estado: 'A' }` o el valor que se defina).

---

### 1.3 `src/resolvers/tamano-empresa.resolver.ts`

**Resultado:** No hay referencias a `activo`.

No se requieren cambios en este archivo.

---

### 1.4 `src/app.module.ts`

**Resultado:** No hay referencias a `activo`.

No se requieren cambios en este archivo.

---

### 1.5 `schema.gql`

**Resultado:** En el `schema.gql` actual no aparece el tipo `TamanoEmpresa` (archivo generado automáticamente por NestJS/GraphQL).

**Recomendación:** Tras cambiar la entidad de `activo` a `estado`, al volver a levantar la API o regenerar el esquema, el tipo generado debería incluir `estado` en lugar de `activo`, por ejemplo:

```graphql
type TamanoEmpresa {
  id_tamano_empresa: ID!
  codigo: String!
  nombre: String!
  descripcion: String
  orden: Int!
  estado: Boolean!    # ← debe aparecer como estado, no activo
}
```

Si en algún momento `schema.gql` contiene `activo` dentro de `TamanoEmpresa`, debe reemplazarse por `estado` (o regenerar el schema).

---

## 2. Resumen de cambios a aplicar (manual)

| Archivo | Línea(s) | Cambio |
|---------|----------|--------|
| `src/entities/tamano-empresa.entity.ts` | 31 | `activo` → `estado` (nombre de la propiedad). Opcional: en `@Column` usar `name: 'estado'` si se desea ser explícito con el nombre de columna. |
| `src/services/tamano-empresa.service.ts` | 15 | `activo: true` → `estado: true` en el `where`. |
| `src/resolvers/tamano-empresa.resolver.ts` | — | Sin cambios. |
| `src/app.module.ts` | — | Sin cambios. |
| `schema.gql` | — | Regenerar o, si existe tipo `TamanoEmpresa` con `activo`, sustituir por `estado`. |

---

## 3. Query GraphQL esperada tras el cambio

Tras aplicar los cambios, la query debería usar el campo `estado`:

```graphql
query {
  tamanosEmpresa {
    id_tamano_empresa
    codigo
    nombre
    descripcion
    orden
    estado
  }
}
```

---

*Informe de auditoría – solo lectura. No se ha modificado código.*
