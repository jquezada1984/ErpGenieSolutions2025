import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  Spinner,
  Table,
} from 'reactstrap';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import SelectEmpresa from '../../components/SelectEmpresa';
import SearchableSelect from '../../components/SearchableSelect';
import useJwtPayload from '../../hooks/useJwtPayload';
import { listarImpuestos } from '../../_apis_/gateway';
import { actualizarGasto, crearGasto, extractApiError } from '../../_apis_/gasto';
import {
  GET_CATEGORIAS_GASTO,
  GET_EMPRESAS,
  GET_GASTO,
  GET_ITEMS_GASTO,
  GET_TERCEROS_GASTO,
} from './gastosQueries';
import { GastoFormSchema, GastoFormValues } from './schemas/gastoSchema';
import {
  calcCabecera,
  calcLinea,
  ESTADO_GASTO_BADGE,
  formatMoney,
} from './utils/money';
import '../terceros/ConfiguracionTercero.scss';

const emptyLine = () => ({
  id_item: null as string | null,
  impuesto_id: null as number | null,
  descripcion: '',
  cantidad: 1,
  precio_unitario: 0,
  descuento: 0,
  orden: 1,
});

const today = () => new Date().toISOString().slice(0, 10);

const GastoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const isGlobal = scope === 'GLOBAL';
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const idEmpresaForm = isGlobal ? empresaSeleccionada : payload?.id_empresa || '';
  const isDisabled = isGlobal && !empresaSeleccionada && !isEdit;

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [estadoGasto, setEstadoGasto] = useState<string>('BORRADOR');
  const [numeroGasto, setNumeroGasto] = useState<string>('');
  const [impuestos, setImpuestos] = useState<Array<{ id: number; nombre: string; tasa: number }>>(
    [],
  );
  const [categoriaInactivaOpt, setCategoriaInactivaOpt] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<GastoFormValues>({
    resolver: yupResolver(GastoFormSchema) as any,
    mode: 'onSubmit',
    defaultValues: {
      id_empresa: '',
      id_categoria_gasto: '',
      id_tercero: null,
      tipo_documento: '',
      numero_documento: '',
      fecha_gasto: today(),
      fecha_vencimiento: '',
      concepto: '',
      observacion: '',
      detalles: [emptyLine()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'detalles',
  });

  const detallesWatch = useWatch({ control, name: 'detalles' });

  const companyCtx = useMemo(
    () => ({ headers: { 'X-Company-Id': idEmpresaForm || '' } }),
    [idEmpresaForm],
  );

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: !isGlobal });

  const { data: catData } = useQuery(GET_CATEGORIAS_GASTO, {
    variables: { id_empresa: idEmpresaForm, solo_activos: true },
    skip: !idEmpresaForm,
    fetchPolicy: 'cache-and-network',
    context: companyCtx,
  });

  const { data: terData } = useQuery(GET_TERCEROS_GASTO, {
    variables: { id_empresa: idEmpresaForm || null },
    skip: !idEmpresaForm,
    fetchPolicy: 'cache-and-network',
    context: companyCtx,
  });

  const { data: itemsData } = useQuery(GET_ITEMS_GASTO, {
    variables: { id_empresa: idEmpresaForm || null },
    skip: !idEmpresaForm,
    fetchPolicy: 'cache-and-network',
    context: companyCtx,
  });

  const [fetchGasto, { loading: loadingGasto }] = useLazyQuery(GET_GASTO, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  useEffect(() => {
    listarImpuestos().then((list) => {
      setImpuestos(
        (list || []).map((i: any) => ({
          id: Number(i.id),
          nombre: i.nombre,
          tasa: Number(i.tasa) || 0,
        })),
      );
    });
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    const emp = isGlobal ? empresaSeleccionada : payload?.id_empresa;
    if (isGlobal && !emp) return;
    if (!emp) return;

    (async () => {
      const res = await fetchGasto({
        variables: { id_gasto: id, id_empresa: emp },
        context: { headers: { 'X-Company-Id': emp } },
      });
      const g = res.data?.gasto;
      if (!g) {
        setErr('Gasto no encontrado o sin acceso');
        return;
      }
      setEstadoGasto(g.estado_gasto || 'BORRADOR');
      setNumeroGasto(g.numero_gasto || '');
      if (isGlobal) setEmpresaSeleccionada(g.id_empresa);

      if (g.categoria && g.categoria.estado === false) {
        setCategoriaInactivaOpt({
          value: g.categoria.id_categoria_gasto,
          label: `${g.categoria.codigo} — ${g.categoria.nombre} (inactiva)`,
        });
      }

      reset({
        id_empresa: g.id_empresa,
        id_categoria_gasto: g.id_categoria_gasto,
        id_tercero: g.id_tercero || null,
        tipo_documento: g.tipo_documento || '',
        numero_documento: g.numero_documento || '',
        fecha_gasto: String(g.fecha_gasto || '').slice(0, 10),
        fecha_vencimiento: g.fecha_vencimiento
          ? String(g.fecha_vencimiento).slice(0, 10)
          : '',
        concepto: g.concepto || '',
        observacion: g.observacion || '',
        detalles: (g.detalles || []).map((d: any, idx: number) => ({
          id_item: d.id_item || null,
          impuesto_id: d.impuesto_id != null ? Number(d.impuesto_id) : null,
          descripcion: d.descripcion || '',
          cantidad: Number(d.cantidad) || 1,
          precio_unitario: Number(d.precio_unitario) || 0,
          descuento: Number(d.descuento) || 0,
          orden: d.orden || idx + 1,
        })),
      });
    })();
  }, [isEdit, id, empresaSeleccionada, isGlobal, payload?.id_empresa, fetchGasto, reset]);

  const tasaByImpuesto = useMemo(() => {
    const m = new Map<number, number>();
    impuestos.forEach((i) => m.set(i.id, i.tasa));
    return m;
  }, [impuestos]);

  const lineasCalc = useMemo(() => {
    return (detallesWatch || []).map((d: any) => {
      const tasa =
        d?.impuesto_id != null ? tasaByImpuesto.get(Number(d.impuesto_id)) ?? 0 : 0;
      return calcLinea({
        cantidad: d?.cantidad,
        precio_unitario: d?.precio_unitario,
        descuento: d?.descuento,
        tasa,
      });
    });
  }, [detallesWatch, tasaByImpuesto]);

  const totales = useMemo(() => calcCabecera(lineasCalc), [lineasCalc]);

  const catOptions = useMemo(() => {
    const opts = (catData?.categoriasGasto || []).map((c: any) => ({
      value: c.id_categoria_gasto,
      label: `${c.codigo} — ${c.nombre}`,
    }));
    if (
      categoriaInactivaOpt &&
      !opts.some((o) => o.value === categoriaInactivaOpt.value)
    ) {
      opts.unshift(categoriaInactivaOpt);
    }
    return opts;
  }, [catData, categoriaInactivaOpt]);

  const terOptions = useMemo(
    () =>
      (terData?.terceros || [])
        .filter((t: any) => t.estado !== false)
        .map((t: any) => ({ value: t.id_tercero, label: t.nombre })),
    [terData],
  );

  const itemOptions = useMemo(
    () =>
      (itemsData?.itemsListado || [])
        .filter((i: any) => i.estado !== false)
        .map((i: any) => ({
          value: i.id_item,
          label: i.etiqueta || i.producto_ref || i.id_item,
          precio: i.precio_compra ?? i.precio_venta,
          etiqueta: i.etiqueta,
        })),
    [itemsData],
  );

  const impuestoOptions = useMemo(
    () =>
      impuestos.map((i) => ({
        value: String(i.id),
        label: `${i.nombre} (${i.tasa}%)`,
      })),
    [impuestos],
  );

  const readOnly = isEdit && estadoGasto !== 'BORRADOR';

  const onInvalid = useCallback((formErrors: any) => {
    const msgs: string[] = [];
    const walk = (obj: any, prefix = '') => {
      if (!obj) return;
      if (obj.message) msgs.push(String(obj.message));
      Object.keys(obj).forEach((k) => {
        if (k === 'message' || k === 'type' || k === 'ref') return;
        walk(obj[k], prefix ? `${prefix}.${k}` : k);
      });
    };
    walk(formErrors);
    setErr(msgs.slice(0, 5).join(' | ') || 'Revisa los campos del formulario');
  }, []);

  const buildPayload = (values: GastoFormValues) => {
    const detalles = (values.detalles || []).map((d, idx) => ({
      id_item: d.id_item || null,
      impuesto_id: d.impuesto_id != null && d.impuesto_id !== '' ? Number(d.impuesto_id) : null,
      descripcion: String(d.descripcion || '').trim(),
      cantidad: String(d.cantidad),
      precio_unitario: String(d.precio_unitario),
      descuento: String(d.descuento ?? 0),
      orden: idx + 1,
    }));
    return {
      ...(isGlobal ? { id_empresa: idEmpresaForm } : {}),
      id_categoria_gasto: values.id_categoria_gasto,
      id_tercero: values.id_tercero || null,
      tipo_documento: values.tipo_documento?.trim() || null,
      numero_documento: values.numero_documento?.trim() || null,
      fecha_gasto: values.fecha_gasto,
      fecha_vencimiento: values.fecha_vencimiento?.trim() || null,
      concepto: values.concepto.trim(),
      observacion: values.observacion?.trim() || null,
      detalles,
    };
  };

  const onSubmit = async (values: GastoFormValues) => {
    if (!idEmpresaForm) {
      setErr('Debe seleccionar empresa');
      return;
    }
    if (readOnly) {
      setErr('Solo se puede editar un gasto en BORRADOR');
      return;
    }
    setSaving(true);
    setErr(null);
    setOk(null);
    try {
      const body = buildPayload(values);
      if (isEdit && id) {
        await actualizarGasto(id, body, idEmpresaForm);
        setOk('Gasto actualizado');
      } else {
        await crearGasto(body, idEmpresaForm);
        setOk('Gasto creado');
      }
      setTimeout(() => navigate('/gastos'), 600);
    } catch (e: any) {
      setErr(extractApiError(e));
    } finally {
      setSaving(false);
    }
  };

  const onPickItem = (index: number, itemId: string | null) => {
    setValue(`detalles.${index}.id_item`, itemId, { shouldDirty: true });
    if (!itemId) return;
    const item = itemOptions.find((o) => o.value === itemId) as any;
    if (!item) return;
    if (item.etiqueta) {
      setValue(`detalles.${index}.descripcion`, item.etiqueta, { shouldDirty: true });
    }
    if (item.precio != null && Number(item.precio) >= 0) {
      setValue(`detalles.${index}.precio_unitario`, Number(item.precio), {
        shouldDirty: true,
      });
    }
  };

  return (
    <Container fluid className="configuracion-tercero">
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                  <CardTitle tag="h4" className="mb-1">
                    {isEdit ? 'Editar gasto' : 'Nuevo gasto'}
                  </CardTitle>
                  {isEdit && (
                    <div className="d-flex gap-2 align-items-center">
                      {numeroGasto && (
                        <span className="text-muted">Nº {numeroGasto}</span>
                      )}
                      <Badge color={ESTADO_GASTO_BADGE[estadoGasto] || 'secondary'}>
                        {estadoGasto}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <Button color="secondary" outline onClick={() => navigate('/gastos')}>
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    disabled={
                      saving ||
                      isDisabled ||
                      readOnly ||
                      loadingGasto ||
                      (isEdit && !isDirty)
                    }
                    onClick={handleSubmit(onSubmit, onInvalid)}
                  >
                    {saving ? <Spinner size="sm" /> : 'Guardar'}
                  </Button>
                </div>
              </div>

              {readOnly && (
                <Alert color="warning">
                  Este gasto no está en BORRADOR y no puede editarse.
                </Alert>
              )}
              {ok && <Alert color="success">{ok}</Alert>}
              {err && <Alert color="danger">{err}</Alert>}

              {isGlobal && (
                <FormGroup className="mb-3" style={{ maxWidth: 420 }}>
                  <Label>Empresa *</Label>
                  <SelectEmpresa
                    value={empresaSeleccionada || null}
                    onChange={(v) => setEmpresaSeleccionada(v || '')}
                    empresas={empresasData?.empresas || []}
                    isDisabled={isEdit}
                  />
                </FormGroup>
              )}

              {isDisabled && (
                <Alert color="info">Seleccione una empresa para continuar.</Alert>
              )}

              {!isDisabled && (
                <>
                  <h5 className="mt-2">Información general</h5>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Categoría *</Label>
                        <Controller
                          name="id_categoria_gasto"
                          control={control}
                          render={({ field }) => (
                            <SearchableSelect
                              value={field.value || null}
                              onChange={(v) => field.onChange(v || '')}
                              options={catOptions}
                              isDisabled={readOnly}
                              error={!!errors.id_categoria_gasto}
                            />
                          )}
                        />
                        {errors.id_categoria_gasto && (
                          <FormText color="danger">
                            {String(errors.id_categoria_gasto.message)}
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Proveedor / beneficiario</Label>
                        <Controller
                          name="id_tercero"
                          control={control}
                          render={({ field }) => (
                            <SearchableSelect
                              value={field.value || null}
                              onChange={(v) => field.onChange(v)}
                              options={terOptions}
                              isDisabled={readOnly}
                              placeholder="Opcional"
                            />
                          )}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>Fecha gasto *</Label>
                        <Controller
                          name="fecha_gasto"
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="date"
                              {...field}
                              disabled={readOnly}
                              invalid={!!errors.fecha_gasto}
                            />
                          )}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>Vencimiento</Label>
                        <Controller
                          name="fecha_vencimiento"
                          control={control}
                          render={({ field }) => (
                            <Input type="date" {...field} value={field.value || ''} disabled={readOnly} />
                          )}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <h5 className="mt-3">Documento</h5>
                  <Row>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Tipo documento</Label>
                        <Controller
                          name="tipo_documento"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} value={field.value || ''} disabled={readOnly} />
                          )}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Número documento</Label>
                        <Controller
                          name="numero_documento"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} value={field.value || ''} disabled={readOnly} />
                          )}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Concepto *</Label>
                        <Controller
                          name="concepto"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              disabled={readOnly}
                              invalid={!!errors.concepto}
                            />
                          )}
                        />
                        {errors.concepto && (
                          <FormText color="danger">{String(errors.concepto.message)}</FormText>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
                    <h5 className="mb-0">Detalle</h5>
                    {!readOnly && (
                      <Button
                        color="secondary"
                        size="sm"
                        type="button"
                        onClick={() =>
                          append({ ...emptyLine(), orden: fields.length + 1 })
                        }
                      >
                        <i className="bi bi-plus-lg me-1" />
                        Agregar línea
                      </Button>
                    )}
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <Table bordered size="sm" className="align-middle">
                      <thead>
                        <tr>
                          <th style={{ minWidth: 160 }}>Item</th>
                          <th style={{ minWidth: 180 }}>Descripción *</th>
                          <th style={{ width: 90 }}>Cant.</th>
                          <th style={{ width: 110 }}>P. unit.</th>
                          <th style={{ width: 100 }}>Desc.</th>
                          <th style={{ minWidth: 140 }}>Impuesto</th>
                          <th style={{ width: 100 }}>Subtotal</th>
                          <th style={{ width: 100 }}>IVA</th>
                          <th style={{ width: 100 }}>Total</th>
                          <th style={{ width: 50 }} />
                        </tr>
                      </thead>
                      <tbody>
                        {fields.map((field, index) => {
                          const calc = lineasCalc[index] || calcLinea({});
                          return (
                            <tr key={field.id}>
                              <td>
                                <Controller
                                  name={`detalles.${index}.id_item`}
                                  control={control}
                                  render={({ field: f }) => (
                                    <SearchableSelect
                                      value={f.value || null}
                                      onChange={(v) => onPickItem(index, v)}
                                      options={itemOptions}
                                      isDisabled={readOnly}
                                      placeholder="Opcional"
                                    />
                                  )}
                                />
                              </td>
                              <td>
                                <Controller
                                  name={`detalles.${index}.descripcion`}
                                  control={control}
                                  render={({ field: f }) => (
                                    <Input {...f} disabled={readOnly} />
                                  )}
                                />
                              </td>
                              <td>
                                <Controller
                                  name={`detalles.${index}.cantidad`}
                                  control={control}
                                  render={({ field: f }) => (
                                    <Input
                                      type="number"
                                      step="0.0001"
                                      min="0"
                                      value={f.value ?? ''}
                                      onChange={(e) =>
                                        f.onChange(
                                          e.target.value === ''
                                            ? ''
                                            : Number(e.target.value),
                                        )
                                      }
                                      disabled={readOnly}
                                    />
                                  )}
                                />
                              </td>
                              <td>
                                <Controller
                                  name={`detalles.${index}.precio_unitario`}
                                  control={control}
                                  render={({ field: f }) => (
                                    <Input
                                      type="number"
                                      step="0.0001"
                                      min="0"
                                      value={f.value ?? ''}
                                      onChange={(e) =>
                                        f.onChange(
                                          e.target.value === ''
                                            ? ''
                                            : Number(e.target.value),
                                        )
                                      }
                                      disabled={readOnly}
                                    />
                                  )}
                                />
                              </td>
                              <td>
                                <Controller
                                  name={`detalles.${index}.descuento`}
                                  control={control}
                                  render={({ field: f }) => (
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={f.value ?? 0}
                                      onChange={(e) =>
                                        f.onChange(Number(e.target.value) || 0)
                                      }
                                      disabled={readOnly}
                                    />
                                  )}
                                />
                              </td>
                              <td>
                                <Controller
                                  name={`detalles.${index}.impuesto_id`}
                                  control={control}
                                  render={({ field: f }) => (
                                    <SearchableSelect
                                      value={
                                        f.value != null && f.value !== ''
                                          ? String(f.value)
                                          : null
                                      }
                                      onChange={(v) =>
                                        f.onChange(v != null ? Number(v) : null)
                                      }
                                      options={impuestoOptions}
                                      isDisabled={readOnly}
                                      placeholder="Sin impuesto"
                                    />
                                  )}
                                />
                              </td>
                              <td className="text-end">{formatMoney(calc.subtotal)}</td>
                              <td className="text-end">
                                {formatMoney(calc.valor_impuesto)}
                              </td>
                              <td className="text-end">
                                <strong>{formatMoney(calc.total)}</strong>
                              </td>
                              <td>
                                {!readOnly && fields.length > 1 && (
                                  <Button
                                    color="danger"
                                    size="sm"
                                    outline
                                    type="button"
                                    onClick={() => remove(index)}
                                  >
                                    <i className="bi bi-trash" />
                                  </Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                  {errors.detalles && (
                    <FormText color="danger" className="d-block mb-2">
                      {typeof errors.detalles.message === 'string'
                        ? errors.detalles.message
                        : 'Revise las líneas del detalle'}
                    </FormText>
                  )}

                  <Row className="mt-3">
                    <Col md={6}>
                      <FormGroup>
                        <Label>Observación</Label>
                        <Controller
                          name="observacion"
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="textarea"
                              rows={3}
                              {...field}
                              value={field.value || ''}
                              disabled={readOnly}
                            />
                          )}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <Card className="bg-light">
                        <CardBody>
                          <h6>Totales (previsualización)</h6>
                          <div className="d-flex justify-content-between">
                            <span>Subtotal</span>
                            <span>{formatMoney(totales.subtotal)}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Descuento</span>
                            <span>{formatMoney(totales.descuento)}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Impuestos</span>
                            <span>{formatMoney(totales.impuesto)}</span>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between">
                            <strong>TOTAL</strong>
                            <strong>{formatMoney(totales.total)}</strong>
                          </div>
                          <FormText>
                            El backend recalcula los totales al guardar.
                          </FormText>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GastoForm;
