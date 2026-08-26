# DocumentApi — generación de PDF (ERP Genie)

Web service HTTP. **No** genera correo; solo documentos.

## Decisión de stack

| Opción | Rápido | PDF enormes | Gráficos | Logos empresa | Encaje Genie |
|--------|--------|-------------|----------|---------------|--------------|
| React / Playwright | No (Chrome) | No (RAM) | Fácil | Sí | No |
| C# QuestPDF | Excelente | Excelente | ScottPlot | Sí | Extra runtime |
| **Python ReportLab** | Muy bueno | Excelente (canvas + cursor SQL) | matplotlib → PNG | `empresa.logo` | **Elegido** |

**No usar React** para generar PDF de negocio. El front solo descarga.

Gráficos: se dibujan con matplotlib (backend Agg) y se **incrustan como imagen**. Logos: `empresa.logo` / `logotipo_cuadrado` (bytea), cacheados por `id_empresa`.

## API

| Método | Path | Uso |
|--------|------|-----|
| GET | `/health` | Salud |
| POST | `/api/documentos/generar` | `{ tipo, id_documento }` + `X-Company-Id` → PDF |
| GET | `/api/documentos/factura-cliente/:id` | Atajo factura cliente |
| GET | `/api/documentos/factura-proveedor/:id` | Atajo factura proveedor |
| GET | `/api/documentos/pago/:id` | Cobro o pago |
| GET | `/api/documentos/reporte-estadistico` | Informe con gráfico (totales por mes) |

`tipo`: `factura_cliente` | `factura_proveedor` | `pago` | `reporte_estadistico`.

Puerto: **5010**. El front **nunca** llama aquí; pasa por el gateway.
