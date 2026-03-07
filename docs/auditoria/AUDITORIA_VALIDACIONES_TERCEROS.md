# Auditoría de validaciones – Módulo Terceros

**Objetivo:** Identificar el patrón exacto de validaciones en Terceros (NuevoTercero / EditarTercero) para replicarlo en el módulo Empresa.  
**Alcance:** Solo análisis; no se ha modificado ningún archivo.

---

## 1. Dónde se implementan las validaciones

| Vista | Archivo | Uso del esquema |
|-------|---------|------------------|
| Nuevo Tercero | `src/views/terceros/NuevoTercero.tsx` | `useForm` + `yupResolver(NuevoTerceroSchema)` |
| Editar Tercero | `src/views/terceros/EditarTercero.tsx` | `useForm` + `yupResolver(NuevoTerceroSchema)` |
| Nuevo Cliente / Editar Cliente | `NuevoCliente.tsx`, `EditarCliente.tsx` | Mismo esquema |
| Nuevo Proveedor / Editar Proveedor | `NuevoProveedor.tsx`, `EditarProveedor.tsx` | Mismo esquema |
| Nuevo Cliente Potencial / Editar | `NuevoClientePotencial.tsx`, `EditarClientePotencial.tsx` | Mismo esquema |

Todas las pantallas de tercero (crear/editar) comparten el mismo esquema: **`NuevoTerceroSchema`**.

---

## 2. Respuestas a la auditoría

### A) Librería usada para validación

- **Yup** (`yup`): define el esquema de validación (tipos, requeridos, formato, mensajes).
- **React Hook Form** (`useForm`): gestiona estado del formulario y envío.
- **@hookform/resolvers (yupResolver)**: integra Yup con React Hook Form; al hacer submit se ejecuta el esquema y los errores se exponen en `formState.errors`.

En resumen: **Yup + React Hook Form + yupResolver**. No se usan validaciones 100 % manuales ni otras librerías de validación.

---

### B) Estructura del esquema de validación

- **Archivo del esquema:** `src/views/terceros/schemas/NuevoTerceroSchema.ts`
- **Exporta:**
  - `NuevoTerceroFormValues`: interfaz TypeScript con todos los campos del formulario.
  - `NuevoTerceroSchema`: objeto de validación Yup.

Estructura típica:

```ts
import * as yup from 'yup';

export interface NuevoTerceroFormValues {
  id_empresa: string;
  nombre: string;
  // ... resto de campos
}

export const NuevoTerceroSchema = yup.object({
  id_empresa: yup.string().required('La empresa es obligatoria'),
  nombre: yup.string().required('El nombre es obligatorio'),
  correo: yup.string().transform(...).email('Correo inválido').optional(),
  capital: yup.number().typeError('...').optional().min(0, 'El capital no puede ser negativo'),
  // ...
}).test('al-menos-un-rol', 'Debe seleccionar al menos un rol...', (value) => { ... });
```

- Los mensajes de error se definen **en el propio esquema** (`.required('...')`, `.email('...')`, etc.).
- Validación a nivel formulario: `.test()` para reglas como “al menos un rol”.

---

### C) Ejemplo de campo obligatorio

**Campo: `nombre`**

- En el esquema (`NuevoTerceroSchema.ts`):

```ts
nombre: yup.string().required('El nombre es obligatorio'),
```

- En la sección que contiene el campo (`src/views/terceros/secciones/SeccionTerceroGeneral.tsx`):
  - El componente **no** usa `register()` ni `formState.errors` del padre.
  - Mantiene un estado local de errores por campo (`err`) y actualiza `err.nombre` al cambiar el input:
    - Si `nombre` queda vacío o solo espacios: `err.nombre = 'El nombre es obligatorio'`.
    - Si tiene contenido: `delete err.nombre`.
  - En pantalla:
    - `invalid={!!err.nombre}` en el `<Input>`.
    - Debajo del input: `{err.nombre && <FormText color="danger">{err.nombre}</FormText>}`.

Además, en **NuevoTercero** y **EditarTercero** hay una comprobación extra en el handler de submit por si el esquema no bloqueara el envío:

```ts
if (!values.nombre || !values.nombre.trim()) {
  setErr('El nombre es obligatorio');  // o setError en Editar
  return;
}
```

---

### D) Ejemplo de mensaje de error

**1) Errores en submit (esquema Yup)**

- Si la validación falla al hacer submit, **no** se muestran errores campo a campo en las secciones (el padre no pasa `formState.errors` a los hijos).
- Se usa el callback **onInvalid** de `handleSubmit(onSubmitRHF, onInvalid)` para recolectar todos los mensajes del árbol de errores y mostrarlos en un único **Alert** arriba del formulario:

```ts
const onInvalid = useCallback((formErrors: any) => {
  const collectMessages = (obj: any): string[] => {
    if (!obj || typeof obj !== 'object') return [];
    if (obj.message && typeof obj.message === 'string') return [obj.message];
    return Object.values(obj).flatMap(collectMessages);
  };
  const messages = collectMessages(formErrors);
  setErr(messages.length > 0 ? messages.join(' | ') : 'Revisa los campos del formulario');
}, []);
```

- Ejemplo de mensaje en pantalla: **`<Alert color="danger">{err}</Alert>`** con texto tipo: `"El nombre es obligatorio | La empresa es obligatoria"` o similar.

**2) Errores en tiempo real en un campo (solo en sección General)**

- En **SeccionTerceroGeneral** el mensaje del campo **nombre** se muestra así:
  - **Componente:** `<FormText color="danger">{err.nombre}</FormText>`
  - **Texto:** el mismo que en el esquema: `"El nombre es obligatorio"`.

**3) Otros campos con validación en esquema**

- **correo:** `.email('Correo inválido')` → mensaje "Correo inválido" si falla (en submit, vía Alert).
- **capital:** `.typeError('El capital debe ser un número')`, `.min(0, 'El capital no puede ser negativo')`.
- **id_empresa:** `.required('La empresa es obligatoria')`.

---

## 3. Validación de "identificación" / "ruc"

- En el **formulario** de tercero no existe un campo llamado "identificación" ni "ruc".
- En listados (Terceros, Clientes, Proveedores, etc.) la columna "Identificación" es solo presentación: se muestra `codigo_cliente` o `apodo`; no hay validación asociada.
- El campo **cif_intra** (CIF intracomunitario) sí existe en el formulario y en el esquema, pero **sin validación de formato ni obligatorio**: `cif_intra: yup.string()`.
- No hay en Terceros un patrón de validación específico para RUC/NIF/CIF que haya que replicar en Empresa; si en Empresa se requiere validar RUC, el patrón a seguir sería el mismo (Yup en el esquema + mensaje en `.required()` o `.matches()` según corresponda).

---

## 4. Patrón exacto resumido

| Aspecto | Patrón en Terceros |
|--------|---------------------|
| **Librería** | Yup + React Hook Form + `yupResolver` |
| **Dónde está el esquema** | Archivo dedicado: `schemas/NuevoTerceroSchema.ts` |
| **Cuándo se valida** | `mode: 'onSubmit'` en `useForm` → validación al enviar |
| **Requerido** | `yup.string().required('Mensaje aquí')` |
| **Formato (ej. email)** | `yup.string().email('Correo inválido').optional()` |
| **Número con límites** | `yup.number().typeError('...').optional().min(0, '...')` |
| **Errores en submit** | `onInvalid` recorre `formErrors`, extrae `.message` y muestra un solo `<Alert color="danger">` con todos los mensajes unidos (ej. con ` \| `). |
| **Error en un campo (opcional)** | En la sección: estado local `err.campo`, `invalid={!!err.campo}` en el input y `<FormText color="danger">{err.campo}</FormText>` debajo. |
| **Submit** | `handleSubmit(onSubmitRHF, onInvalid)`; en `onSubmitRHF` a veces se repiten comprobaciones críticas (ej. nombre, id_empresa) y se setea `setErr`/`setError` para mensaje global. |

---

## 5. Archivos clave

| Archivo | Rol |
|---------|-----|
| `src/views/terceros/schemas/NuevoTerceroSchema.ts` | Esquema Yup + tipo del formulario |
| `src/views/terceros/NuevoTercero.tsx` | useForm, yupResolver, handleSubmit, onInvalid, Alert de error |
| `src/views/terceros/EditarTercero.tsx` | Igual que NuevoTercero para validación |
| `src/views/terceros/secciones/SeccionTerceroGeneral.tsx` | Validación en tiempo real del campo "nombre" y muestra de mensaje con FormText |
| `src/views/terceros/secciones/SeccionTerceroComercialOrganizacion.tsx` | Validación en tiempo real de "capital" (negativo) con `err.capital` y FormText |

---

## 6. Objetivo para replicar en Empresa

Para alinear Empresa con Terceros:

1. Usar **Yup + React Hook Form + yupResolver**.
2. Crear un **esquema en un archivo** tipo `schemas/NuevaEmpresaSchema.ts` (o similar) con mensajes en español en cada regla.
3. En la vista de nueva/editar empresa: **useForm** con `resolver: yupResolver(Esquema)`, `mode: 'onSubmit'`, y **handleSubmit(onSubmit, onInvalid)**.
4. En **onInvalid**: misma función que recolecta mensajes de `formErrors` y los muestra en un único **Alert** de peligro.
5. Opcional: en la sección donde esté el campo (ej. nombre o razón social), estado local de error y **FormText** debajo del input para feedback en tiempo real, manteniendo el mismo mensaje que en el esquema.

Con esto se replica el patrón exacto de validaciones del módulo Terceros en el módulo Empresa.
