# Acceso a PostgreSQL — solo stored procedures (Python y C#)

Convención del monorepo: **Python** y **C#/.NET** no ejecutan SQL ad-hoc. Toda consulta o escritura va en un **stored procedure** (o función PostgreSQL nombrada) versionado en el repo.

Regla Cursor: `.cursor/rules/acceso-bd-solo-sp.mdc`.

## Dónde viven los SP

| Ruta | Uso |
|------|-----|
| `docs/sql/sp/` | Scripts `CREATE OR REPLACE PROCEDURE` / `FUNCTION` compartidos |
| `{Servicio}/migrations/` o `{Servicio}/sql/` | SP exclusivos de un microservicio |

Nombre: `sp_{dominio}_{accion}` (ejemplo: `sp_factura_obtener`). Incluir `p_id_empresa` si el dato es por empresa.

## Cómo llamar

- Python: `CALL sp_…(%s, …)` o `SELECT * FROM fn_…(%s)`.
- C#: `CommandType.StoredProcedure` + nombre del SP. Nunca `CommandType.Text` con `SELECT`/`INSERT`.

## NestJS

La lectura GraphQL (TypeORM) no está cubierta por esta regla. No usar eso como excusa para meter SQL en Python o C#.

## Legado

Hay servicios Python (Financiero, Contabilidad, DocumentApi, workers) con `text("""SELECT…""")`. Al modificar esos flujos, extraer el SQL a un SP y dejar solo la llamada.
