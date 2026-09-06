import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import type { GroupBase, SingleValue, StylesConfig } from 'react-select';
import { Alert, Button, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap';

export type LineaFacturaDraft = {
  key: string;
  id_item?: string | null;
  descripcion: string;
  cantidad: string;
  precio_unitario: string;
  descuento_porcentaje: string;
  tasa_iva: string;
  precio_compra: string;
  tipo_item_codigo?: string;
};

type ImpuestoOpt = { id: number; codigo?: string; nombre: string; tasa: number; activo?: boolean };
type TipoItemOpt = { id_tipo_item: string; codigo: string; nombre: string };
type ItemOpcion = { value: string; label: string; precio_venta?: number | null; precio_compra?: number | null };
type ModoAlta = 'libre' | 'predefinido';

const GET_IMPUESTOS = gql`
  query ImpuestosFacturaLineas($id_empresa: ID!, $solo_activos: Boolean) {
    impuestos(id_empresa: $id_empresa, solo_activos: $solo_activos) {
      id
      codigo
      nombre
      tasa
      activo
    }
  }
`;

const GET_EMPRESA_PRECISION = gql`
  query EmpresaPrecisionFactura($id_empresa: ID!) {
    empresa(id_empresa: $id_empresa) {
      id_empresa
      decimales_precio
      decimales_cantidad
      decimales_total
    }
  }
`;

const GET_TIPOS_ITEM = gql`
  query TiposItemCatalogoFacturaLineas {
    tiposItemCatalogo {
      id_tipo_item
      codigo
      nombre
      estado
      orden
    }
  }
`;

const GET_ITEMS = gql`
  query ItemsBusquedaFactura($id_empresa: ID, $etiqueta: String, $codigo_tipo_item: String) {
    itemsListado(id_empresa: $id_empresa, etiqueta: $etiqueta, codigo_tipo_item: $codigo_tipo_item) {
      id_item
      id_empresa
      producto_ref
      etiqueta
      precio_venta
      precio_compra
    }
  }
`;

const n = (v: string | number | null | undefined) => {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
};

const fmtDec = (v: number, dec: number) => v.toFixed(Math.max(0, Math.min(6, dec)));

export function calcLinea(l: LineaFacturaDraft) {
  const cant = n(l.cantidad);
  const pu = n(l.precio_unitario);
  const dto = n(l.descuento_porcentaje);
  const tasa = n(l.tasa_iva);
  const bruto = cant * pu;
  const descuento = bruto * (dto / 100);
  const base = Math.max(0, bruto - descuento);
  const puIi = pu * (1 + tasa / 100);
  const iva = base * (tasa / 100);
  return { cant, pu, dto, tasa, bruto, descuento, base, puIi, iva };
}

export function toApiLineas(lineas: LineaFacturaDraft[]) {
  return lineas
    .filter((l) => l.descripcion.trim())
    .map((l, i) => ({
      id_item: l.id_item || null,
      descripcion: l.descripcion.trim(),
      cantidad: n(l.cantidad),
      precio_unitario: n(l.precio_unitario),
      descuento_porcentaje: n(l.descuento_porcentaje),
      tasa_iva: n(l.tasa_iva),
      orden: i + 1,
    }));
}

export function lineasDesdeApi(
  rows: Array<{
    id_factura_linea?: string;
    id_item?: string | null;
    descripcion: string;
    cantidad: string | number;
    precio_unitario: string | number;
    descuento_porcentaje?: string | number | null;
    descuento_valor?: string | number | null;
  }> | null | undefined,
): LineaFacturaDraft[] {
  return (rows || []).map((r, i) => ({
    key: r.id_factura_linea || `l-${i}`,
    id_item: r.id_item || null,
    descripcion: r.descripcion || '',
    cantidad: String(r.cantidad ?? '1'),
    precio_unitario: String(r.precio_unitario ?? '0'),
    descuento_porcentaje: String(r.descuento_porcentaje ?? '0'),
    tasa_iva: '0',
    precio_compra: '0',
    tipo_item_codigo: undefined,
  }));
}

const selectStyles: StylesConfig<ItemOpcion, false, GroupBase<ItemOpcion>> = {
  container: (base) => ({ ...base, minWidth: 220, flex: 1 }),
  control: (base) => ({ ...base, minHeight: 34, fontSize: 13 }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const draftVacio = (): LineaFacturaDraft => ({
  key: `new-${Date.now()}`,
  id_item: null,
  descripcion: '',
  cantidad: '1',
  precio_unitario: '0',
  descuento_porcentaje: '0',
  tasa_iva: '0',
  precio_compra: '0',
  tipo_item_codigo: undefined,
});

type Props = {
  idEmpresa: string;
  lineas: LineaFacturaDraft[];
  onChange: (next: LineaFacturaDraft[]) => void;
  editable?: boolean;
  esProveedor?: boolean;
};

const FacturaLineasEditor: React.FC<Props> = ({
  idEmpresa,
  lineas,
  onChange,
  editable = true,
  esProveedor = false,
}) => {
  const client = useApolloClient();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [modo, setModo] = useState<ModoAlta>('libre');
  const [tipoCodigo, setTipoCodigo] = useState('PRODUCT');
  const [draft, setDraft] = useState<LineaFacturaDraft>(draftVacio);
  const [itemSel, setItemSel] = useState<ItemOpcion | null>(null);

  const { data: impData } = useQuery(GET_IMPUESTOS, {
    variables: { id_empresa: idEmpresa, solo_activos: true },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });
  const impuestos: ImpuestoOpt[] = impData?.impuestos || [];

  useEffect(() => {
    if (!impuestos.length) return;
    const actual = impuestos.find((i) => String(i.tasa) === String(draft.tasa_iva));
    if (!actual) {
      const cero = impuestos.find((i) => Number(i.tasa) === 0) || impuestos[0];
      setDraft((d) => ({ ...d, tasa_iva: String(cero.tasa) }));
    }
  }, [impuestos]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: empPrec } = useQuery(GET_EMPRESA_PRECISION, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
    fetchPolicy: 'cache-first',
  });
  const decPrecio = Number(empPrec?.empresa?.decimales_precio ?? 2);
  const decCant = Number(empPrec?.empresa?.decimales_cantidad ?? 2);
  const decTotal = Number(empPrec?.empresa?.decimales_total ?? 2);
  const fmt = (v: number) => fmtDec(v, decTotal);
  const fmtP = (v: number) => fmtDec(v, decPrecio);

  const { data: tiposData } = useQuery(GET_TIPOS_ITEM, { fetchPolicy: 'cache-first' });
  const tiposItem: TipoItemOpt[] = useMemo(() => {
    const rows = (tiposData?.tiposItemCatalogo || []) as Array<TipoItemOpt & { estado?: boolean | null }>;
    return rows.filter((t) => t.estado !== false);
  }, [tiposData]);

  useEffect(() => {
    if (!tiposItem.length) return;
    const existe = tiposItem.some((t) => t.codigo === tipoCodigo);
    if (!existe) setTipoCodigo(tiposItem[0].codigo);
  }, [tiposItem, tipoCodigo]);

  const tipoActual = tiposItem.find((t) => t.codigo === tipoCodigo) || tiposItem[0];
  const esServicio = String(tipoCodigo).toUpperCase() === 'SERVICE';
  const altaNuevoHref = esServicio ? '/items/servicios/nuevo' : '/items/productos/nuevo';
  const etiquetaPredefinido = tipoActual
    ? `${tipoActual.nombre} predefinido`
    : 'Producto / servicio predefinido';

  const loadItems = useCallback(
    (input: string): Promise<ItemOpcion[]> =>
      new Promise((resolve) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!idEmpresa || input.trim().length < 2) {
          resolve([]);
          return;
        }
        timerRef.current = setTimeout(async () => {
          try {
            const { data } = await client.query({
              query: GET_ITEMS,
              variables: {
                id_empresa: idEmpresa,
                etiqueta: input.trim(),
                codigo_tipo_item: tipoCodigo || undefined,
              },
              fetchPolicy: 'network-only',
              context: { headers: { 'X-Company-Id': idEmpresa } },
            });
            const rows = (data?.itemsListado || []).filter(
              (r: { id_empresa?: string }) => !r.id_empresa || r.id_empresa === idEmpresa,
            );
            resolve(
              rows.map((r: { id_item: string; producto_ref?: string; etiqueta: string; precio_venta?: number; precio_compra?: number }) => ({
                value: r.id_item,
                label: `${r.producto_ref ? `${r.producto_ref} — ` : ''}${r.etiqueta}`,
                precio_venta: r.precio_venta,
                precio_compra: r.precio_compra,
              })),
            );
          } catch {
            resolve([]);
          }
        }, 280);
      }),
    [client, idEmpresa, tipoCodigo],
  );

  const setDraftField = (campo: keyof LineaFacturaDraft, valor: string) => {
    setDraft((prev) => {
      const next = { ...prev, [campo]: valor };
      if (campo === 'precio_unitario' || campo === 'tasa_iva') {
        return next;
      }
      return next;
    });
  };

  const onChangePuIi = (valor: string) => {
    const tasa = n(draft.tasa_iva);
    const ii = n(valor);
    const pu = tasa > -100 ? ii / (1 + tasa / 100) : ii;
    setDraft((prev) => ({ ...prev, precio_unitario: pu ? String(Number(pu.toFixed(4))) : '0' }));
  };

  const onPickItem = (opt: SingleValue<ItemOpcion>) => {
    setItemSel(opt);
    if (!opt) {
      setDraft((prev) => ({ ...prev, id_item: null, descripcion: '', precio_unitario: '0', precio_compra: '0' }));
      return;
    }
    const pu = esProveedor ? n(opt.precio_compra) : n(opt.precio_venta);
    const pc = n(opt.precio_compra);
    setDraft((prev) => ({
      ...prev,
      id_item: opt.value,
      descripcion: opt.label,
      precio_unitario: String(pu || 0),
      precio_compra: String(pc || 0),
      tipo_item_codigo: tipoCodigo,
    }));
  };

  const draftCalc = calcLinea(draft);

  const anadir = () => {
    const desc = draft.descripcion.trim();
    if (!desc) return;
    if (n(draft.cantidad) <= 0) return;
    const linea: LineaFacturaDraft = {
      ...draft,
      key: `${Date.now()}`,
      descripcion: desc,
      tipo_item_codigo: tipoCodigo,
      id_item: modo === 'predefinido' ? draft.id_item : null,
    };
    onChange([...lineas, linea]);
    setDraft({ ...draftVacio(), tasa_iva: draft.tasa_iva, tipo_item_codigo: tipoCodigo });
    setItemSel(null);
  };

  const editar = (l: LineaFacturaDraft) => {
    setDraft({ ...l, key: `edit-${l.key}` });
    setModo(l.id_item ? 'predefinido' : 'libre');
    if (l.tipo_item_codigo) setTipoCodigo(l.tipo_item_codigo);
    setItemSel(l.id_item ? { value: l.id_item, label: l.descripcion } : null);
    onChange(lineas.filter((x) => x.key !== l.key));
  };

  const totales = useMemo(() => {
    return lineas.reduce(
      (acc, l) => {
        const c = calcLinea(l);
        acc.base += c.base;
        acc.iva += c.iva;
        acc.dto += c.descuento;
        return acc;
      },
      { base: 0, iva: 0, dto: 0 },
    );
  }, [lineas]);

  return (
    <div className="factura-lineas-editor">
      <Table size="sm" bordered responsive className="mb-2 align-middle">
        <thead className="table-light">
          <tr>
            <th>Descripción</th>
            <th style={{ width: 88 }}>IVA</th>
            <th className="text-end" style={{ width: 90 }}>
              P.U.
            </th>
            <th className="text-end" style={{ width: 90 }}>
              P.U. (i.i.)
            </th>
            <th className="text-end" style={{ width: 70 }}>
              Cant.
            </th>
            <th className="text-end" style={{ width: 70 }}>
              Dto.
            </th>
            <th className="text-end" style={{ width: 110 }}>
              Precio de compra
            </th>
            <th className="text-end" style={{ width: 100 }}>
              Base imp.
            </th>
            {editable && <th style={{ width: 70 }} />}
          </tr>
        </thead>
        <tbody>
          {lineas.map((l) => {
            const c = calcLinea(l);
            return (
              <tr key={l.key}>
                <td>
                  {l.id_item ? <i className="bi bi-box-seam me-1 text-muted" title="Catálogo" /> : (
                    <i className="bi bi-pencil-square me-1 text-muted" title="Entrada libre" />
                  )}
                  {l.tipo_item_codigo ? (
                    <span className="badge bg-light text-dark border me-1">{l.tipo_item_codigo}</span>
                  ) : null}
                  {l.descripcion}
                </td>
                <td>{c.tasa.toFixed(0)}%</td>
                <td className="text-end">{fmtP(c.pu)}</td>
                <td className="text-end">{fmtP(c.puIi)}</td>
                <td className="text-end">{c.cant}</td>
                <td className="text-end">{c.dto ? `${c.dto}%` : '—'}</td>
                <td className="text-end">{fmt(n(l.precio_compra))}</td>
                <td className="text-end fw-semibold">{fmt(c.base)}</td>
                {editable && (
                  <td className="text-nowrap">
                    <Button type="button" color="link" size="sm" className="p-0 me-2" onClick={() => editar(l)} title="Editar">
                      <i className="bi bi-pencil" />
                    </Button>
                    <Button
                      type="button"
                      color="link"
                      size="sm"
                      className="p-0 text-danger"
                      onClick={() => onChange(lineas.filter((x) => x.key !== l.key))}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash" />
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
          {lineas.length === 0 && (
            <tr>
              <td colSpan={editable ? 9 : 8} className="text-muted text-center py-3">
                Sin líneas. Use el formulario inferior para añadir.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6} className="text-end text-muted">
              Descuentos
            </td>
            <td colSpan={2} className="text-end">
              {fmt(totales.dto)}
            </td>
            {editable && <td />}
          </tr>
          <tr>
            <td colSpan={6} className="text-end text-muted">
              Base imponible
            </td>
            <td colSpan={2} className="text-end">
              {fmt(totales.base)}
            </td>
            {editable && <td />}
          </tr>
          <tr>
            <td colSpan={6} className="text-end text-muted">
              IVA
            </td>
            <td colSpan={2} className="text-end">
              {fmt(totales.iva)}
            </td>
            {editable && <td />}
          </tr>
          <tr>
            <td colSpan={6} className="text-end fw-bold">
              Total
            </td>
            <td colSpan={2} className="text-end fw-bold">
              {fmt(totales.base + totales.iva)}
            </td>
            {editable && <td />}
          </tr>
        </tfoot>
      </Table>

      {editable && (
        <div className="border rounded p-3 bg-light">
          {impuestos.length === 0 && (
            <Alert color="danger" className="py-2" fade={false} timeout={0}>
              Error, ningún tipo de IVA definido. Arregla esto en{' '}
              <Link to="/contabilidad/configuracion/cuentas-iva">cuentas de IVA</Link> o en el
              catálogo de impuestos.
            </Alert>
          )}
          <Row className="g-3 align-items-start">
            <Col md={5} lg={4}>
              <Label className="small fw-semibold mb-1">Tipo (configuración)</Label>
              <Input
                type="select"
                bsSize="sm"
                className="mb-3"
                value={tipoCodigo}
                onChange={(e) => {
                  setTipoCodigo(e.target.value);
                  setItemSel(null);
                  setDraft((p) => ({ ...p, id_item: null, descripcion: modo === 'predefinido' ? '' : p.descripcion }));
                }}
              >
                {tiposItem.length === 0 && (
                  <option value="PRODUCT">Producto</option>
                )}
                {tiposItem.map((t) => (
                  <option key={t.id_tipo_item} value={t.codigo}>
                    {t.nombre}
                  </option>
                ))}
              </Input>
              {tiposItem.length === 0 && (
                <div className="small text-muted mb-2">
                  Catálogo de tipos no disponible; se usa Producto por defecto.
                </div>
              )}

              <FormGroup check className="mb-2">
                <Label check>
                  <Input
                    type="radio"
                    name="modo-linea"
                    checked={modo === 'libre'}
                    onChange={() => {
                      setModo('libre');
                      setItemSel(null);
                      setDraft((p) => ({ ...p, id_item: null }));
                    }}
                  />{' '}
                  Entrada libre
                </Label>
              </FormGroup>
              {modo === 'libre' && (
                <Input
                  type="textarea"
                  rows={3}
                  placeholder={`Descripción libre (${tipoActual?.nombre || 'ítem'})`}
                  value={draft.descripcion}
                  onChange={(e) => setDraftField('descripcion', e.target.value)}
                />
              )}
              <FormGroup check className="mt-2 mb-2">
                <Label check>
                  <Input
                    type="radio"
                    name="modo-linea"
                    checked={modo === 'predefinido'}
                    onChange={() => setModo('predefinido')}
                  />{' '}
                  {etiquetaPredefinido}
                </Label>
              </FormGroup>
              {modo === 'predefinido' && (
                <div className="d-flex gap-2 align-items-center">
                  <AsyncSelect<ItemOpcion, false, GroupBase<ItemOpcion>>
                    key={`${idEmpresa}-${tipoCodigo}`}
                    instanceId="factura-linea-item"
                    placeholder={`Buscar ${tipoActual?.nombre?.toLowerCase() || 'ítem'}…`}
                    isClearable
                    cacheOptions={false}
                    defaultOptions={false}
                    value={itemSel}
                    loadOptions={loadItems}
                    onChange={onPickItem}
                    styles={selectStyles}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                    menuPosition="fixed"
                    noOptionsMessage={(p) =>
                      p.inputValue.trim().length >= 2 ? 'Sin resultados.' : 'Escriba al menos 2 caracteres.'
                    }
                  />
                  <Button
                    tag={Link}
                    to={altaNuevoHref}
                    color="link"
                    className="p-0"
                    title={`Nuevo ${tipoActual?.nombre || 'ítem'}`}
                  >
                    <i className="bi bi-plus-circle fs-5" />
                  </Button>
                </div>
              )}
            </Col>
            <Col md={7} lg={8}>
              <div className="d-flex flex-wrap gap-2 align-items-end">
                <div>
                  <Label className="small mb-1">IVA</Label>
                  <Input
                    type="select"
                    bsSize="sm"
                    style={{ width: 110 }}
                    value={draft.tasa_iva}
                    onChange={(e) => setDraftField('tasa_iva', e.target.value)}
                  >
                    {impuestos.length === 0 && <option value="">Sin tasas</option>}
                    {impuestos.map((imp) => (
                      <option key={imp.id} value={String(imp.tasa)}>
                        {imp.nombre} ({imp.tasa}%)
                      </option>
                    ))}
                  </Input>
                </div>
                <div>
                  <Label className="small mb-1">P.U.</Label>
                  <Input
                    type="number"
                    bsSize="sm"
                    min="0"
                    step="0.01"
                    style={{ width: 100 }}
                    value={draft.precio_unitario}
                    onChange={(e) => setDraftField('precio_unitario', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="small mb-1">P.U. (i.i.)</Label>
                  <Input
                    type="number"
                    bsSize="sm"
                    min="0"
                    step="0.01"
                    style={{ width: 100 }}
                    value={fmt(draftCalc.puIi)}
                    onChange={(e) => onChangePuIi(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="small mb-1">Cant.</Label>
                  <Input
                    type="number"
                    bsSize="sm"
                    min="0.001"
                    step="0.001"
                    style={{ width: 80 }}
                    value={draft.cantidad}
                    onChange={(e) => setDraftField('cantidad', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="small mb-1">Dto. %</Label>
                  <Input
                    type="number"
                    bsSize="sm"
                    min="0"
                    max="100"
                    step="0.01"
                    style={{ width: 80 }}
                    value={draft.descuento_porcentaje}
                    onChange={(e) => setDraftField('descuento_porcentaje', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="small mb-1">Base imp.</Label>
                  <div className="form-control form-control-sm bg-white" style={{ width: 100 }}>
                    {fmt(draftCalc.base)}
                  </div>
                </div>
                <Button type="button" color="primary" onClick={anadir} disabled={!draft.descripcion.trim()}>
                  AÑADIR
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default FacturaLineasEditor;
