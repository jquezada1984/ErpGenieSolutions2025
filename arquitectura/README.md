# Arquitectura ERP Genie

Mapa de microservicios, gateway y pantallas. Cada dominio (p. ej. `BancoCajaNestJs` + `BancoCajaPython`) se documenta en **un solo archivo** con el nombre del módulo.

## Patrón general

```
frontReact (:3000)
    → gateway-api (:3002)  REST /api/*  +  GraphQL /graphql
        → {Dominio}NestJs   = lectura (GraphQL)
        → {Dominio}Python   = escritura (REST)
```

Excepciones puntuales (p. ej. contactos, etiquetas-ítem, Media solo Nest) se anotan en cada módulo.

## Índice

| Archivo | Carpetas / servicios |
|---------|----------------------|
| [Gateway.md](./Gateway.md) | `gateway-api/` |
| [frontReact.md](./frontReact.md) | `frontReact/` |
| [Inicio.md](./Inicio.md) | `InicioNestJs` + `InicioPython` |
| [Tercero.md](./Tercero.md) | `TerceroNestJs` + `TerceroPython` (incluye Socio y Contacto) |
| [Item.md](./Item.md) | `ItemNestJs` + `ItemPython` |
| [Inventario.md](./Inventario.md) | `InventarioNestJs` + `InventarioPython` |
| [BancoCaja.md](./BancoCaja.md) | `BancoCajaNestJs` + `BancoCajaPython` |
| [Contabilidad.md](./Contabilidad.md) | `ContabilidadNestJs` + `ContabilidadPython` |
| [Financiero.md](./Financiero.md) | `FinancieroNestJs` + `FinancieroPython` |
| [Menu.md](./Menu.md) | `MenuNestJs` (+ escritura menú en InicioPython) |
| [Media.md](./Media.md) | `MediaServiceNestJs` |

Reglas Cursor relacionadas: `.cursor/rules/erp-arquitectura-modulos.mdc`, `.cursor/rules/multiempresa-scope.mdc`.
