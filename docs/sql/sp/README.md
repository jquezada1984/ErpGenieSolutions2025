# Stored procedures (PostgreSQL)

Los servicios **Python** y **C#/.NET** solo invocan objetos de esta carpeta (o migraciones del servicio). No incrustar `SELECT`/`INSERT`/`UPDATE`/`DELETE` en el código.

Ver [docs/ACCESO_BD_SOLO_SP.md](../ACCESO_BD_SOLO_SP.md).

Convención de nombre: `sp_{dominio}_{accion}.sql`.
