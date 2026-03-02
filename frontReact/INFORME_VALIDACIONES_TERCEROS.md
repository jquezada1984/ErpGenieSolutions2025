# Informe técnico: validaciones en el módulo Terceros

Documentación del patrón de validación usado en las vistas de Terceros para replicar el mismo esquema en el módulo Productos. **Solo análisis; no se proponen cambios.**

---

## Resumen general del patrón de validación

- **Control de formulario:** `react-hook-form` con **resolver Yup** (`@hookform/resolvers/yup`). No se usa `register` ni `Controller`: el estado del formulario vive en react-hook-form vía `watch()` y se actualiza desde las secciones hijas con `setValue()`.
- **Validación:** Un único schema Yup compartido (`NuevoTerceroSchema`) con tipo TypeScript `NuevoTerceroFormValues`. Modo de validación `onSubmit`: se valida al enviar; opcionalmente hay validación manual de `id_empresa` y `nombre` dentro de `onSubmitRHF`.
- **Datos en pantalla:** `formData = watch()` se pasa a las secciones como `data`. Las secciones tienen estado local `f` sincronizado con `data` y, al cambiar, llaman `onChange(obj)`; el padre hace `setValue(key, value)` por cada clave.
- **Errores:** Errores de validación (Yup) y de negocio se concentran en un estado local (`err` o `error`) y se muestran en un único `<Alert color="danger">`. En submit se usa `handleSubmit(onSubmitRHF, onInvalid)`; `onInvalid` recolecta mensajes del objeto de errores y los concatena.
- **Reset:** Tras creación exitosa se llama `reset({ ...initialForm, id_empresa: values.id_empresa })` para mantener la empresa seleccionada. En edición no se hace reset completo; solo se vuelve a cargar con `reset(...)` cuando llegan datos del backend.

---

## 1. Librerías utilizadas

| Pregunta | Respuesta |
|----------|-----------|
| ¿Se usa **react-hook-form**? | **Sí.** Import: `import { useForm } from 'react-hook-form'`. |
| ¿Se usa **yup**? | **Sí.** El schema está en `schemas/NuevoTerceroSchema.ts` con `import * as yup from 'yup'`. |
| ¿Se usa **yupResolver**? | **Sí.** `import { yupResolver } from '@hookform/resolvers/yup'` y `resolver: yupResolver(NuevoTerceroSchema)`. |
| ¿Se usa **register**? | **No.** En ninguna de las 8 vistas (Nuevo/Editar Tercero, Cliente, ClientePotencial, Proveedor) aparece `register`. |
| ¿Se usa **Controller**? | **No.** No hay imports ni uso de `Controller` de react-hook-form. |
| ¿Se usa **useState** para formData? | **No.** El valor del formulario para la UI es `formData = watch()`. Se usa `useState` solo para: `activeTab`, `loading`, `ok`/`success`, `err`/`error`, y en algunas vistas `hasChanges`, `tiposTercero`, `loadingTipos`, `errNombre`. |

---

## 2. Patrón exacto de useForm

### 2.1 Definición de initialForm

- En cada vista se define un objeto `initialForm` tipado como `NuevoTerceroFormValues` con todos los campos del formulario y valores por defecto (strings vacíos `''`, booleanos según tipo de vista, `capital: 0`).
- Ejemplo (NuevoTercero):

```ts
const initialForm: NuevoTerceroFormValues = {
  id_empresa: '',
  cliente_potencial: false,
  cliente: false,
  proveedor: false,
  nombre: '',
  apodo: '',
  codigo_cliente: '',
  estado: true,
  sujeto_iva: true,
  id_tipo_tercero: '',
  tipo_entidad_comercial: '',
  direccion: '',
  poblacion: '',
  codigo_postal: '',
  id_pais: '',
  provincia: '',
  telefono: '',
  movil: '',
  fax: '',
  web: '',
  correo: '',
  logo: '',
  capital: 0,
  id_condicion_pago: '',
  id_forma_pago: '',
  id_profesional_1: '',
  id_profesional_2: '',
  cif_intra: '',
  sede_central: '',
  asignado_a: '',
};
```

- En **NuevoCliente** se fuerza `cliente: true` en `initialForm`; en **NuevoClientePotencial** `cliente_potencial: true`; en **NuevoProveedor** `proveedor: true`. En Editar* se usa el mismo `initialForm` pero los valores reales se sobrescriben con `reset()` al cargar datos.

### 2.2 Tipo TypeScript (FormValues)

- Definido en `frontReact/src/views/terceros/schemas/NuevoTerceroSchema.ts`:

```ts
export interface NuevoTerceroFormValues {
  id_empresa: string;
  cliente_potencial: boolean;
  cliente: boolean;
  proveedor: boolean;
  nombre: string;
  apodo: string;
  codigo_cliente: string;
  estado: boolean;
  sujeto_iva: boolean;
  id_tipo_tercero: string;
  tipo_entidad_comercial: string;
  direccion: string;
  poblacion: string;
  codigo_postal: string;
  id_pais: string;
  provincia: string;
  telefono: string;
  movil: string;
  fax: string;
  web: string;
  correo: string;
  logo: string;
  capital: number;
  id_condicion_pago: string;
  id_forma_pago: string;
  id_profesional_1: string;
  id_profesional_2: string;
  cif_intra: string;
  sede_central: string;
  asignado_a: string;
}
```

- Todas las vistas importan: `NuevoTerceroSchema, type NuevoTerceroFormValues` desde `./schemas/NuevoTerceroSchema`.

### 2.3 Instancia de useForm

- Patrón común en las 8 vistas:

```ts
const {
  watch,
  setValue,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<NuevoTerceroFormValues>({
  resolver: yupResolver(NuevoTerceroSchema),
  mode: 'onSubmit',
  defaultValues: initialForm,
});
```

- En **NuevoClientePotencial** aparece `yupResolver(NuevoTerceroSchema) as any` (mismo schema).
- **Propiedades extraídas:** `watch`, `setValue`, `handleSubmit`, `reset`, `formState.errors`. No se extrae `control` ni `register`.
- **Modo de validación:** siempre `mode: 'onSubmit'`. La validación se dispara al llamar `handleSubmit(onSubmitRHF, onInvalid)`.

---

## 3. Manejo de formData

- **formData:** Se obtiene con `const formData = watch();` (sin argumentos). Es el objeto completo del formulario y se re-renderiza cuando cambia el estado de react-hook-form.
- **Reemplazo de useState para el formulario:** No hay un `useState` que guarde el formulario completo. El estado “oficial” del formulario es el de react-hook-form; `watch()` es solo la lectura reactiva de ese estado.
- **Actualización desde secciones hijas:** Cada sección recibe `data={formData}` y `onChange={onGeneral}` (o `onUbicacion` / `onComercial`). Cuando el usuario cambia un campo, la sección actualiza su estado local y llama `onChange(u)` con un objeto que contiene las claves actualizadas. En el padre:

```ts
const onGeneral = useCallback((d: any) => {
  Object.entries(d).forEach(([key, value]) => {
    setValue(key as keyof NuevoTerceroFormValues, value);
  });
}, [setValue]);
```

- Así, **setValue** se usa para cada par clave-valor del objeto devuelto por la sección. En vistas Cliente/ClientePotencial/Proveedor, dentro de esos callbacks a veces se fuerza además `setValue('cliente', true)` (etc.) para fijar el rol.
- Las secciones internamente mantienen un estado local `f` sincronizado con `data` vía `useEffect(() => setF((p) => ({ ...p, ...data })), [data])`, y en sus inputs usan `value={f.nombre}` (etc.) y en el `onChange` del input llaman a un handler que hace `setF(u)` y `onChange(u)`.

---

## 4. Esquemas Yup

### 4.1 Ubicación

- **Carpeta:** `frontReact/src/views/terceros/schemas/`
- **Archivo único:** `NuevoTerceroSchema.ts`
- **Exportaciones:** `NuevoTerceroFormValues` (interface) y `NuevoTerceroSchema` (objeto yup).

### 4.2 Estructura del schema

- `yup.object({ ... }).test('al-menos-un-rol', mensaje, fn)`.
- Campos en el objeto:
  - **Required:** `id_empresa` (string, required), `nombre` (string, required).
  - **Opcionales / sin required:** el resto (apodo, codigo_cliente, direccion, id_pais, etc.) definidos con `yup.string()`, `yup.boolean()` sin `.required()`.
  - **correo:** `yup.string().transform((v) => (v === '' ? undefined : v)).email('Correo inválido').optional()` — string vacío se transforma a undefined y luego se valida como email opcional.
  - **capital:** `yup.number().typeError('...').transform(...).optional().min(0, '...')` — transform convierte vacío/null/undefined y asegura número; si está presente debe ser ≥ 0.
- **Test a nivel objeto:** `al-menos-un-rol`: exige que al menos uno de `cliente_potencial`, `cliente`, `proveedor` sea true; si no, devuelve el mensaje "Debe seleccionar al menos un rol: cliente potencial, cliente o proveedor."

### 4.3 Resumen de validaciones

| Tipo | Ejemplo en schema |
|------|-------------------|
| Required | `id_empresa: yup.string().required('La empresa es obligatoria')`, `nombre: yup.string().required('El nombre es obligatorio')` |
| transform() | `correo`: `''` → `undefined`; `capital`: vacío/null → undefined, luego Number |
| Opcionales | Resto de campos sin `.required()`, o con `.optional()` explícito (correo, capital) |
| Email | `correo`: `.email('Correo inválido').optional()` |
| Números | `capital`: `.number()`, `.typeError()`, `.transform()`, `.min(0)` |
| Lógica global | `.test('al-menos-un-rol', mensaje, (value) => !!(value.cliente_potencial \|\| value.cliente \|\| value.proveedor))` |

---

## 5. Manejo del submit

### 5.1 Función onSubmitRHF

- Recibe `values: NuevoTerceroFormValues` (ya validados por Yup si se llegó aquí).
- Al inicio: `setLoading(true)`, `setErr(null)` / `setError(null)`, y en Nuevo* `setOk(false)`.
- **Validaciones manuales** (todas las vistas):
  - Si `!values.id_empresa` → setErr/setError('Debe seleccionar una empresa'), return.
  - Si `!values.nombre || !values.nombre.trim()` → setErr/setError('El nombre es obligatorio'), return.
- **Limpieza del payload:** Se crea `cleanedData = { ...values }`. Se recorre `Object.keys(cleanedData)` y se eliminan claves cuyo valor sea `''`, `null` o `undefined`. Luego se fuerza `cleanedData.id_empresa = values.id_empresa` para que no se borre.
- **Editar:** Además se hace `delete (cleanedData as any).id_tercero` para no enviar el id en el body.
- **Flags de rol:** En **NuevoCliente** / **EditarCliente** se fuerza `cleanedData.cliente = true`, `cliente_potencial = false`, `proveedor = false`. En **NuevoClientePotencial** / **EditarClientePotencial** se fuerza `cliente_potencial = true`, `cliente = false`, `proveedor = false`. En **NuevoProveedor** / **EditarProveedor** se fuerza `proveedor = true`, `cliente = false`, `cliente_potencial = false`. En **NuevoTercero** / **EditarTercero** no se fuerzan (el usuario elige los checkboxes).
- Llamada a API: `crearTercero(cleanedData)` o `actualizarTercero(id, cleanedData)`.
- En éxito (Nuevo*): `setOk(true)`, luego `setTimeout` con `reset({ ...initialForm, id_empresa: values.id_empresa })`, `setOk(false)`, `setActiveTab('1')`. En Editar*: `setSuccess(true)`, `setHasChanges(false)`, y `setTimeout` solo para ocultar el mensaje de éxito.

### 5.2 onInvalid

- Se pasa como segundo argumento a `handleSubmit(onSubmitRHF, onInvalid)`.
- Función común (misma en todas las vistas):

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

- Recorre recursivamente el objeto de errores de react-hook-form, extrae `message` cuando es string y concatena todos con `' | '`. El resultado se guarda en el estado de error global (`err` o `error`).

### 5.3 Botón de submit

- Patrón: `onClick={handleSubmit(onSubmitRHF, onInvalid)}`, `disabled={loading}`. No se usa `type="submit"` en un form que envuelva todo; el submit es vía botón.

---

## 6. Manejo de errores

- **Errores de validación (Yup):** No se muestran campo a campo desde `formState.errors` en la mayoría de las vistas. Se canalizan a `onInvalid`, que pone todos los mensajes en el estado global y se muestra un solo `<Alert color="danger">{err}</Alert>` (o `{error}`).
- **Errores de backend:** En el `catch` de `onSubmitRHF` se hace `setErr(e?.response?.data?.error || e?.message || '...')` (o `setError(...)`). El mismo Alert muestra ese mensaje.
- **Concatenación:** Sí: en `onInvalid` los mensajes se unen con `messages.join(' | ')`.
- **Componente:** Siempre `<Alert color="danger">` de reactstrap para el mensaje global. En algunas vistas (Editar*) hay además un bloque condicional para error de carga de datos (query) con otro Alert.
- **Campo “nombre” en algunas vistas:** En NuevoCliente, NuevoClientePotencial, NuevoProveedor existe estado local `errNombre` y se usa `invalid={!!errNombre}` y opcionalmente `<FormText color="danger">{errNombre}</FormText>` para el nombre. En SeccionTerceroGeneral (usado por NuevoTercero/EditarTercero) el nombre usa estado local `err.nombre` y `invalid={!!err.nombre}` y `FormText` con `err.nombre`.

---

## 7. Reset del formulario

- **Uso de reset():**
  - **Nuevo*:** Tras crear con éxito, en un `setTimeout` (2 s) se llama `reset({ ...initialForm, id_empresa: values.id_empresa })` para dejar el formulario como al inicio pero manteniendo la empresa seleccionada.
  - **Editar*:** No hay reset tras guardar. Se usa `reset()` solo cuando llegan datos del backend: en un `useEffect` que depende de `data?.tercero` (o `tercero`/`isCliente`/`isClientePotencial`/`isProveedor`), se llama `reset({ ... })` con el objeto mapeado desde la respuesta GraphQL.
- **Mantenimiento de id_empresa:** En Nuevo* el reset explícitamente conserva `id_empresa: values.id_empresa`. El resto de campos vuelven a `initialForm`.
- **Restablecimiento de flags:** En el objeto pasado a `reset` en Editar* se fijan `cliente_potencial`, `cliente`, `proveedor` según el tipo de vista (cliente, cliente potencial o proveedor) para que los checkboxes reflejen el tipo correcto.

---

## 8. Diferencias entre Nuevo y Editar

| Aspecto | Nuevo* | Editar* |
|--------|--------|--------|
| Carga de datos | No hay carga previa; se parte de `initialForm`. | `useQuery(GET_TERCERO, { variables: { id_tercero: id }, skip: !id, fetchPolicy: 'cache-and-network' })`. |
| Rellenar formulario | `defaultValues: initialForm`. | `useEffect` que, cuando existe `data?.tercero` (y en EditarCliente/EditarClientePotencial/EditarProveedor cuando además el tercero es del tipo correcto), llama `reset({ ... })` con todos los campos mapeados desde `data.tercero` (id_empresa, nombre, flags, etc.). |
| setValue / reset | Solo `setValue` vía callbacks de secciones. Reset solo tras crear OK. | `setValue` igual; `reset` solo al recibir datos del backend en el useEffect. |
| Validación en edición | Igual que en nuevo: mismo schema y mismo `onSubmitRHF` + `onInvalid`. La única diferencia es que en Editar se comprueba `id` y se llama `actualizarTercero(id, cleanedData)`. | Igual: Yup se ejecuta en submit; si hay errores, no se llama `onSubmitRHF` y sí `onInvalid`. |
| Estado extra en Editar | — | `hasChanges`; en los callbacks onGeneral/onUbicacion/onComercial se hace `setHasChanges(true)` y tras guardar OK `setHasChanges(false)`. |
| Eliminación de campos en payload | Se eliminan `''`, `null`, `undefined`. Se fuerza `id_empresa`. | Además se hace `delete cleanedData.id_tercero`. |

---

## Flujo completo del formulario (desde render hasta submit)

1. **Montaje:** useForm se inicializa con `defaultValues: initialForm` y `resolver: yupResolver(NuevoTerceroSchema)`, `mode: 'onSubmit'`. `formData = watch()`.
2. **Render:** Se muestran pestañas; en cada tab se renderiza una sección con `data={formData}` y `onChange={onGeneral|onUbicacion|onComercial}`.
3. **Secciones:** Cada sección sincroniza `data` a estado local `f` con `useEffect(..., [data])`. Los inputs son controlados por `f` y en change actualizan `f` y llaman `onChange(u)`.
4. **Padre:** En cada callback, el padre hace `Object.entries(d).forEach(([key, value]) => setValue(key, value))` (y en Cliente/ClientePotencial/Proveedor a veces setValue adicional para los flags de rol). `watch()` devuelve el estado actualizado, así que `formData` cambia y las secciones reciben el nuevo `data`.
5. **Submit:** Usuario pulsa el botón → `handleSubmit(onSubmitRHF, onInvalid)`.
6. **Si hay errores Yup:** Se llama `onInvalid(formErrors)`; se recolectan mensajes y se setea `err`/`error`; se muestra Alert.
7. **Si no hay errores:** Se llama `onSubmitRHF(values)`. Validaciones manuales de id_empresa y nombre; limpieza de payload; forzado de flags en Cliente/ClientePotencial/Proveedor; llamada a API; en éxito, mensaje y reset (Nuevo) o solo mensaje (Editar).

---

## Estructura del schema (resumen replicable)

- Un archivo en `views/<modulo>/schemas/<Nombre>Schema.ts`.
- Exportar una interfaz `NombreFormValues` con todos los campos y tipos.
- Exportar `NombreSchema = yup.object({ ... }).test('nombre-test', mensaje, fn)`.
- Campos required con `.required('mensaje')`.
- Opcionales con `.string()`, `.boolean()`, etc., sin required, o con `.optional()`.
- Email: `.string().transform(v => v === '' ? undefined : v).email('...').optional()`.
- Números: `.number().typeError('...').transform(...).optional().min(...)` si aplica.
- Test a nivel objeto para reglas que dependan de varios campos.

---

## Checklist técnico para replicar en Productos

- [ ] Instalar/verificar: `react-hook-form`, `yup`, `@hookform/resolvers`.
- [ ] Crear `views/productos/schemas/` y un archivo de schema (p. ej. `NuevoProductoSchema.ts`) con interfaz FormValues y schema yup (con resolver yupResolver, sin register/Controller).
- [ ] En la vista (Nuevo/Editar): definir `initialForm` tipado con FormValues, usar `useForm({ resolver: yupResolver(Schema), mode: 'onSubmit', defaultValues: initialForm })`, extraer `watch`, `setValue`, `handleSubmit`, `reset`, `formState: { errors }`.
- [ ] Usar `formData = watch()` y pasarlo a secciones/hijos como `data={formData}`.
- [ ] En el padre, callbacks `onSeccion(d)` que hagan `Object.entries(d).forEach(([key, value]) => setValue(key, value))`.
- [ ] Submit: `handleSubmit(onSubmitRHF, onInvalid)`; en `onSubmitRHF` validaciones manuales si hace falta, limpieza de payload (eliminar `''`/null/undefined), forzar campos que deban ir siempre, llamar API; en éxito, reset si es Nuevo (manteniendo campos que se deseen).
- [ ] `onInvalid`: función que recolecte mensajes del objeto de errores (recursiva o por campos conocidos) y los una con `' | '`; setear estado de error global.
- [ ] Un estado `err` o `error` para mensaje global y mostrarlo con `<Alert color="danger">`.
- [ ] En Editar: useQuery para cargar entidad por id; useEffect que al recibir datos llame `reset({ ... })` con el objeto mapeado.
- [ ] No usar `register` ni `Controller`; inputs en secciones controlados por estado local de la sección que se sincroniza con `data` y notifica con `onChange(obj)`.

---

*Fin del informe. Solo documentación; sin modificaciones ni sugerencias de mejora.*
