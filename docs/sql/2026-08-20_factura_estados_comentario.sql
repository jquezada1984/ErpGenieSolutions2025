-- Estados de factura cliente (Financiero P0)
-- BORRADOR | VALIDADA | ANULADA (sin CHECK estricto; documentado en aplicación)

COMMENT ON COLUMN public.factura.estado IS
  'BORRADOR=editable; VALIDADA=numerada y contabilizable; ANULADA=soft delete';
