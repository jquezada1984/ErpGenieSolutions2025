# Correo y documentos PDF

## Decisión

| Pieza | Tecnología | Por qué |
|-------|------------|---------|
| **DocumentApi** | Python + **ReportLab** (canvas) + matplotlib | Rápido, PDFs grandes (líneas por cursor SQL, sin cargar todo en RAM), gráficos como PNG incrustado, logos de `empresa.logo` |
| **MailWorker** | Python + Rabbit + SMTP | Mismo patrón que ContabilidadWorker |
| React | Solo descarga | Playwright/Chrome es lento y explota con documentos enormes |

No se usa el MailWorker médico (Crystal, SQL Server, cola `CorreoPendiente`). Se reescribió para Genie.

C# QuestPDF sería igual de válido en calidad de PDF; se eligió Python para unificar workers y Docker Linux del monorepo.

## Flujo

```
UI PDF → gateway → DocumentApi → application/pdf
UI Enviar correo → FinancieroPython → Rabbit mail.send
  → MailWorker → DocumentApi (adjuntos) → SMTP
```

Puertos: DocumentApi **5010**. MailWorker sin puerto.

Detalle: [DocumentApi/README.md](../DocumentApi/README.md), [MailWorker/README.md](../MailWorker/README.md), [ARQUITECTURA_RABBIT_WORKERS.md](./ARQUITECTURA_RABBIT_WORKERS.md).
