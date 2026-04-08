import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import { gql, useQuery } from '@apollo/client';
import type { ItemFormValues } from '../schemas/itemSchema';
import { listarAlmacenes, listarUnidades } from '../../../_apis_/gateway';
import CountrySelect from '../../../components/CountrySelect';
import SelectProvincia from '../../../components/selects/SelectProvincia';

/** Misma query que `SeccionTerceroUbicacionContacto` → Gateway → InicioNestJs (`paises`). */
const GET_PAISES = gql`
  query GetPaisesInventarioItem {
    paises {
      id_pais
      nombre
      codigo_iso
      icono
    }
  }
`;

type Props = {
  data: Partial<ItemFormValues>;
  onChange: (d: Partial<ItemFormValues>) => void;
  /** Solo Nuevo producto: oculta Stock actual y agrupa almacén + stocks con layout compacto */
  ocultarStockActual?: boolean;
  /** Ajuste visual local para NuevoProducto: tamaños de inputs/combos como referencia de NuevoTercero. */
  usarTamanoReferenciaTercero?: boolean;
  uiRules?: {
    mostrarCamposFisicosAvanzados: boolean;
  };
};

const numFieldsInventario = [
  'stock_actual',
  'stock_minimo',
  'stock_deseado',
  'peso',
  'largo',
  'ancho',
  'alto',
  'superficie',
  'volumen',
];

const SeccionItemInventario: React.FC<Props> = ({
  data,
  onChange,
  ocultarStockActual = false,
  usarTamanoReferenciaTercero = false,
  uiRules,
}) => {
  const [f, setF] = useState({
    id_almacen_defecto: '',
    stock_actual: 0,
    stock_minimo: 0,
    stock_deseado: 0,
    unidad_medida: '',
    peso: 0,
    unidad_peso: '',
    largo: 0,
    ancho: 0,
    alto: 0,
    unidad_dimension: '',
    superficie: 0,
    unidad_superficie: '',
    volumen: 0,
    unidad_volumen: '',
    nomenclatura_aduanera: '',
    id_pais_origen: '',
    id_provincia_origen: '',
  });
  const [almacenes, setAlmacenes] = useState<Array<{ id_almacen: string; almacen_ref?: string; nombre: string }>>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<Array<{ id_unidad: string; codigo?: string; nombre: string; abreviatura?: string }>>([]);
  const [unidadesPeso, setUnidadesPeso] = useState<Array<{ id_unidad: string; codigo?: string; nombre: string; abreviatura?: string }>>([]);
  const [unidadesLongitud, setUnidadesLongitud] = useState<Array<{ id_unidad: string; codigo?: string; nombre: string; abreviatura?: string }>>([]);
  const [unidadesSuperficie, setUnidadesSuperficie] = useState<Array<{ id_unidad: string; codigo?: string; nombre: string; abreviatura?: string }>>([]);
  const [unidadesVolumen, setUnidadesVolumen] = useState<Array<{ id_unidad: string; codigo?: string; nombre: string; abreviatura?: string }>>([]);

  const { data: paisesData, loading: loadingPaises, error: errorPaises } = useQuery(GET_PAISES);
  const paises = paisesData?.paises || [];

  useEffect(() => {
    let cancelled = false;
    listarAlmacenes()
      .then((list) => {
        if (cancelled) return;
        const arr = Array.isArray(list) ? list : [];
        setAlmacenes(
          arr.map((a) => ({
            id_almacen: String(a?.id_almacen ?? ''),
            almacen_ref: a?.almacen_ref ? String(a.almacen_ref) : '',
            nombre: String(a?.nombre ?? ''),
          }))
        );
      })
      .catch(() => {
        if (!cancelled) setAlmacenes([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const normalize = (list: any[]) =>
      (Array.isArray(list) ? list : []).map((u) => ({
        id_unidad: String(u?.id_unidad ?? ''),
        codigo: u?.codigo ? String(u.codigo) : '',
        nombre: String(u?.nombre ?? ''),
        abreviatura: u?.abreviatura ? String(u.abreviatura) : '',
      }));

    Promise.all([
      listarUnidades(),
      listarUnidades('PESO'),
      listarUnidades('LONGITUD'),
      listarUnidades('SUPERFICIE'),
      listarUnidades('VOLUMEN'),
    ])
      .then(([all, peso, longitud, superficie, volumen]) => {
        if (cancelled) return;
        setUnidadesMedida(normalize(all));
        setUnidadesPeso(normalize(peso));
        setUnidadesLongitud(normalize(longitud));
        setUnidadesSuperficie(normalize(superficie));
        setUnidadesVolumen(normalize(volumen));
      })
      .catch(() => {
        if (cancelled) return;
        setUnidadesMedida([]);
        setUnidadesPeso([]);
        setUnidadesLongitud([]);
        setUnidadesSuperficie([]);
        setUnidadesVolumen([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(
    () =>
      setF((p) => ({
        ...p,
        id_almacen_defecto: data.id_almacen_defecto ?? '',
        stock_actual: data.stock_actual ?? 0,
        stock_minimo: data.stock_minimo ?? 0,
        stock_deseado: data.stock_deseado ?? 0,
        unidad_medida: data.unidad_medida ?? '',
        peso: data.peso ?? 0,
        unidad_peso: data.unidad_peso ?? '',
        largo: data.largo ?? 0,
        ancho: data.ancho ?? 0,
        alto: data.alto ?? 0,
        unidad_dimension: data.unidad_dimension ?? '',
        superficie: data.superficie ?? 0,
        unidad_superficie: data.unidad_superficie ?? '',
        volumen: data.volumen ?? 0,
        unidad_volumen: data.unidad_volumen ?? '',
        nomenclatura_aduanera: data.nomenclatura_aduanera ?? '',
        id_pais_origen: data.id_pais_origen ?? '',
        id_provincia_origen: data.id_provincia_origen ?? '',
      })),
    [
      data.id_almacen_defecto,
      data.stock_actual,
      data.stock_minimo,
      data.stock_deseado,
      data.unidad_medida,
      data.peso,
      data.unidad_peso,
      data.largo,
      data.ancho,
      data.alto,
      data.unidad_dimension,
      data.superficie,
      data.unidad_superficie,
      data.volumen,
      data.unidad_volumen,
      data.nomenclatura_aduanera,
      data.id_pais_origen,
      data.id_provincia_origen,
    ]
  );

  const chg = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const num = numFieldsInventario.includes(name) ? (value === '' ? 0 : Number(value)) : value;
      const u = { ...f, [name]: num };
      setF(u);
      onChange({ ...data, ...u });
    },
    [f, data, onChange]
  );

  /** Igual que terceros: al cambiar país se limpia provincia (dependencia `provinciasByPais`). */
  const onPaisOrigenChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const u = { ...f, id_pais_origen: value, id_provincia_origen: '' };
      setF(u);
      onChange({ ...data, ...u });
    },
    [f, data, onChange]
  );

  const onProvinciaOrigenChange = useCallback(
    (id_provincia: string | null) => {
      const u = { ...f, id_provincia_origen: id_provincia ?? '' };
      setF(u);
      onChange({ ...data, ...u });
    },
    [f, data, onChange]
  );

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4">
          <i className="fas fa-boxes text-primary me-2" />
          Inventario
        </h5>
        {ocultarStockActual && usarTamanoReferenciaTercero ? (
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="id_almacen_defecto">Almacén por defecto</Label>
                <Input
                  id="id_almacen_defecto"
                  name="id_almacen_defecto"
                  type="select"
                  value={f.id_almacen_defecto ?? ''}
                  onChange={chg}
                >
                  <option value="">Seleccionar</option>
                  {(almacenes || []).map((a, idx) => (
                    <option key={a.id_almacen || `alm-${idx}`} value={a.id_almacen || ''}>
                      {a.almacen_ref ? `${a.almacen_ref} - ${a.nombre}` : a.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="stock_minimo">Stock límite para alertas</Label>
                <Input
                  id="stock_minimo"
                  name="stock_minimo"
                  type="number"
                  min={0}
                  value={f.stock_minimo === 0 ? '' : f.stock_minimo}
                  onChange={chg}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="stock_deseado">Stock deseado</Label>
                <Input
                  id="stock_deseado"
                  name="stock_deseado"
                  type="number"
                  min={0}
                  value={f.stock_deseado === 0 ? '' : f.stock_deseado}
                  onChange={chg}
                />
              </FormGroup>
            </Col>
          </Row>
        ) : ocultarStockActual ? (
          <>
            <Row className="mb-2 align-items-end">
              <Col md={5}>
                <FormGroup>
                  <Label for="id_almacen_defecto">Almacén por defecto</Label>
                  <Input
                    id="id_almacen_defecto"
                    name="id_almacen_defecto"
                    type="select"
                    style={{ maxWidth: '18.5rem' }}
                    value={f.id_almacen_defecto ?? ''}
                    onChange={chg}
                  >
                    <option value="">Seleccionar</option>
                    {(almacenes || []).map((a, idx) => (
                      <option key={a.id_almacen || `alm-${idx}`} value={a.id_almacen || ''}>
                        {a.almacen_ref ? `${a.almacen_ref} - ${a.nombre}` : a.nombre}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={7} className="d-flex flex-wrap align-items-end gap-4">
                <FormGroup className="mb-0">
                  <Label for="stock_minimo">Stock límite para alertas</Label>
                  <Input
                    id="stock_minimo"
                    name="stock_minimo"
                    type="number"
                    min={0}
                    style={{ maxWidth: '6.75rem' }}
                    value={f.stock_minimo === 0 ? '' : f.stock_minimo}
                    onChange={chg}
                  />
                </FormGroup>
                <FormGroup className="mb-0">
                  <Label for="stock_deseado">Stock deseado</Label>
                  <Input
                    id="stock_deseado"
                    name="stock_deseado"
                    type="number"
                    min={0}
                    style={{ maxWidth: '6.75rem' }}
                    value={f.stock_deseado === 0 ? '' : f.stock_deseado}
                    onChange={chg}
                  />
                </FormGroup>
              </Col>
            </Row>
          </>
        ) : (
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="id_almacen_defecto">Almacén por defecto</Label>
                <Input
                  id="id_almacen_defecto"
                  name="id_almacen_defecto"
                  type="select"
                  value={f.id_almacen_defecto ?? ''}
                  onChange={chg}
                >
                  <option value="">Seleccionar</option>
                  {(almacenes || []).map((a, idx) => (
                    <option key={a.id_almacen || `alm-${idx}`} value={a.id_almacen || ''}>
                      {a.almacen_ref ? `${a.almacen_ref} - ${a.nombre}` : a.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="stock_actual">Stock actual</Label>
                <Input
                  id="stock_actual"
                  name="stock_actual"
                  type="number"
                  min={0}
                  value={f.stock_actual === 0 ? '' : f.stock_actual}
                  onChange={chg}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="stock_minimo">Stock mínimo</Label>
                <Input
                  id="stock_minimo"
                  name="stock_minimo"
                  type="number"
                  min={0}
                  value={f.stock_minimo === 0 ? '' : f.stock_minimo}
                  onChange={chg}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="stock_deseado">Stock deseado</Label>
                <Input
                  id="stock_deseado"
                  name="stock_deseado"
                  type="number"
                  min={0}
                  value={f.stock_deseado === 0 ? '' : f.stock_deseado}
                  onChange={chg}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="unidad_medida">Unidad de medida</Label>
                <Input
                  id="unidad_medida"
                  name="unidad_medida"
                  type="select"
                  value={f.unidad_medida}
                  onChange={chg}
                >
                  <option value="">Seleccionar</option>
                  {(unidadesMedida || []).map((u, idx) => (
                    <option key={u.id_unidad || `um-${idx}`} value={u.id_unidad || ''}>
                      {u.abreviatura ? `${u.abreviatura} - ${u.nombre}` : u.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
        )}
        {uiRules?.mostrarCamposFisicosAvanzados === false ? null : ocultarStockActual && usarTamanoReferenciaTercero ? (
          <Row>
            <Col md={12}>
              <h6 className="text-muted mb-2 mt-2">Peso y dimensiones</h6>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="peso">Peso</Label>
                <Input id="peso" name="peso" type="number" step="0.01" min={0} value={f.peso === 0 ? '' : f.peso} onChange={chg} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="unidad_peso">Unidad peso</Label>
                <Input id="unidad_peso" name="unidad_peso" type="select" value={f.unidad_peso} onChange={chg}>
                  <option value="">Seleccionar</option>
                  {(unidadesPeso || []).map((u, idx) => (
                    <option key={u.id_unidad || `up-${idx}`} value={u.id_unidad || ''}>
                      {u.abreviatura ? `${u.abreviatura} - ${u.nombre}` : u.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="largo">Largo</Label>
                <Input id="largo" name="largo" type="number" step="0.01" min={0} value={f.largo === 0 ? '' : f.largo} onChange={chg} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="ancho">Ancho</Label>
                <Input id="ancho" name="ancho" type="number" step="0.01" min={0} value={f.ancho === 0 ? '' : f.ancho} onChange={chg} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="alto">Alto</Label>
                <Input id="alto" name="alto" type="number" step="0.01" min={0} value={f.alto === 0 ? '' : f.alto} onChange={chg} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="unidad_dimension">Unidad dimensión</Label>
                <Input id="unidad_dimension" name="unidad_dimension" type="select" value={f.unidad_dimension} onChange={chg}>
                  <option value="">Seleccionar</option>
                  {(unidadesLongitud || []).map((u, idx) => (
                    <option key={u.id_unidad || `ul-${idx}`} value={u.id_unidad || ''}>
                      {u.abreviatura ? `${u.abreviatura} - ${u.nombre}` : u.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="superficie">Superficie</Label>
                <Input
                  id="superficie"
                  name="superficie"
                  type="number"
                  step="0.01"
                  min={0}
                  value={f.superficie === 0 ? '' : f.superficie}
                  onChange={chg}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="unidad_superficie">Unidad superficie</Label>
                <Input id="unidad_superficie" name="unidad_superficie" type="select" value={f.unidad_superficie} onChange={chg}>
                  <option value="">Seleccionar</option>
                  {(unidadesSuperficie || []).map((u, idx) => (
                    <option key={u.id_unidad || `us-${idx}`} value={u.id_unidad || ''}>
                      {u.abreviatura ? `${u.abreviatura} - ${u.nombre}` : u.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="volumen">Volumen</Label>
                <Input id="volumen" name="volumen" type="number" step="0.01" min={0} value={f.volumen === 0 ? '' : f.volumen} onChange={chg} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="unidad_volumen">Unidad volumen</Label>
                <Input id="unidad_volumen" name="unidad_volumen" type="select" value={f.unidad_volumen} onChange={chg}>
                  <option value="">Seleccionar</option>
                  {(unidadesVolumen || []).map((u, idx) => (
                    <option key={u.id_unidad || `uv-${idx}`} value={u.id_unidad || ''}>
                      {u.abreviatura ? `${u.abreviatura} - ${u.nombre}` : u.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
        ) : ocultarStockActual ? (
          <>
            <Row>
              <Col md={12}>
                <h6 className="text-muted mb-2 mt-2">Peso y dimensiones</h6>
              </Col>
            </Row>
            <Row className="align-items-end mb-2">
              <Col md={12} className="d-flex flex-wrap align-items-end gap-1">
                <FormGroup className="mb-0">
                  <Label for="peso">Peso</Label>
                  <Input
                    id="peso"
                    name="peso"
                    type="number"
                    step="0.01"
                    min={0}
                    style={{ maxWidth: '5.75rem' }}
                    value={f.peso === 0 ? '' : f.peso}
                    onChange={chg}
                  />
                </FormGroup>
                <FormGroup className="mb-0">
                  <Label for="unidad_peso">Unidad peso</Label>
                  <Input
                    id="unidad_peso"
                    name="unidad_peso"
                    type="select"
                    style={{ maxWidth: '9.25rem' }}
                    value={f.unidad_peso}
                    onChange={chg}
                  >
                    <option value="">Seleccionar</option>
                    {(unidadesPeso || []).map((u, idx) => (
                      <option key={u.id_unidad || `up-${idx}`} value={u.id_unidad || ''}>
                        {u.abreviatura ? `${u.abreviatura} - ${u.nombre}` : u.nombre}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup className="mb-0">
                  <Label for="largo" className="small">
                    Largo
                  </Label>
                  <Input
                    id="largo"
                    name="largo"
                    type="number"
                    step="0.01"
                    min={0}
                    style={{ maxWidth: '5.75rem' }}
                    value={f.largo === 0 ? '' : f.largo}
                    onChange={chg}
                  />
                </FormGroup>
                <FormGroup className="mb-0">
                  <Label for="ancho" className="small">
                    Ancho
                  </Label>
                  <Input
                    id="ancho"
                    name="ancho"
                    type="number"
                    step="0.01"
                    min={0}
                    style={{ maxWidth: '5.75rem' }}
                    value={f.ancho === 0 ? '' : f.ancho}
                    onChange={chg}
                  />
                </FormGroup>
                <FormGroup className="mb-0">
                  <Label for="alto" className="small">
                    Alto
                  </Label>
                  <Input
                    id="alto"
                    name="alto"
                    type="number"
                    step="0.01"
                    min={0}
                    style={{ maxWidth: '5.75rem' }}
                    value={f.alto === 0 ? '' : f.alto}
                    onChange={chg}
                  />
                </FormGroup>
                <FormGroup className="mb-0">
                  <Label for="unidad_dimension">Unidad dimensión</Label>
                  <Input
                    id="unidad_dimension"
                    name="unidad_dimension"
                    type="select"
                    style={{ maxWidth: '9.25rem' }}
                    value={f.unidad_dimension}
                    onChange={chg}
                  >
                    <option value="">Seleccionar</option>
                    {(unidadesLongitud || []).map((u, idx) => (
                      <option key={u.id_unidad || `ul-${idx}`} value={u.id_unidad || ''}>
                        {u.abreviatura ? `${u.abreviatura} - ${u.nombre}` : u.nombre}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row className="align-items-end mb-2">
              <Col md={12} className="d-flex flex-wrap align-items-end gap-1">
                <FormGroup className="mb-0">
                  <Label for="superficie">Superficie</Label>
                  <Input
                    id="superficie"
                    name="superficie"
                    type="number"
                    step="0.01"
                    min={0}
                    style={{ maxWidth: '5.75rem' }}
                    value={f.superficie === 0 ? '' : f.superficie}
                    onChange={chg}
                  />
                </FormGroup>
                <FormGroup className="mb-0">
                  <Label for="unidad_superficie">Unidad superficie</Label>
                  <Input
                    id="unidad_superficie"
                    name="unidad_superficie"
                    type="select"
                    style={{ maxWidth: '9.25rem' }}
                    value={f.unidad_superficie}
                    onChange={chg}
                  >
                    <option value="">Seleccionar</option>
                    {(unidadesSuperficie || []).map((u, idx) => (
                      <option key={u.id_unidad || `us-${idx}`} value={u.id_unidad || ''}>
                        {u.abreviatura ? `${u.abreviatura} - ${u.nombre}` : u.nombre}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup className="mb-0">
                  <Label for="volumen">Volumen</Label>
                  <Input
                    id="volumen"
                    name="volumen"
                    type="number"
                    step="0.01"
                    min={0}
                    style={{ maxWidth: '5.75rem' }}
                    value={f.volumen === 0 ? '' : f.volumen}
                    onChange={chg}
                  />
                </FormGroup>
                <FormGroup className="mb-0">
                  <Label for="unidad_volumen">Unidad volumen</Label>
                  <Input
                    id="unidad_volumen"
                    name="unidad_volumen"
                    type="select"
                    style={{ maxWidth: '9.25rem' }}
                    value={f.unidad_volumen}
                    onChange={chg}
                  >
                    <option value="">Seleccionar</option>
                    {(unidadesVolumen || []).map((u, idx) => (
                      <option key={u.id_unidad || `uv-${idx}`} value={u.id_unidad || ''}>
                        {u.abreviatura ? `${u.abreviatura} - ${u.nombre}` : u.nombre}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </>
        ) : (
          <Row>
            <Col md={12}>
              <h6 className="text-muted mb-2 mt-2">Peso y dimensiones</h6>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="peso">Peso</Label>
                <Input
                  id="peso"
                  name="peso"
                  type="number"
                  step="0.01"
                  min={0}
                  value={f.peso === 0 ? '' : f.peso}
                  onChange={chg}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="unidad_peso">Unidad peso</Label>
                <Input
                  id="unidad_peso"
                  name="unidad_peso"
                  type="select"
                  value={f.unidad_peso}
                  onChange={chg}
                >
                  <option value="">Seleccionar</option>
                  {(unidadesPeso || []).map((u, idx) => (
                    <option key={u.id_unidad || `up-${idx}`} value={u.id_unidad || ''}>
                      {u.abreviatura ? `${u.abreviatura} - ${u.nombre}` : u.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="largo">Largo</Label>
                <Input
                  id="largo"
                  name="largo"
                  type="number"
                  step="0.01"
                  min={0}
                  value={f.largo === 0 ? '' : f.largo}
                  onChange={chg}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="ancho">Ancho</Label>
                <Input
                  id="ancho"
                  name="ancho"
                  type="number"
                  step="0.01"
                  min={0}
                  value={f.ancho === 0 ? '' : f.ancho}
                  onChange={chg}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="alto">Alto</Label>
                <Input
                  id="alto"
                  name="alto"
                  type="number"
                  step="0.01"
                  min={0}
                  value={f.alto === 0 ? '' : f.alto}
                  onChange={chg}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="unidad_dimension">Unidad dimensión</Label>
                <Input
                  id="unidad_dimension"
                  name="unidad_dimension"
                  type="select"
                  value={f.unidad_dimension}
                  onChange={chg}
                >
                  <option value="">Seleccionar</option>
                  {(unidadesLongitud || []).map((u, idx) => (
                    <option key={u.id_unidad || `ul-${idx}`} value={u.id_unidad || ''}>
                      {u.abreviatura ? `${u.abreviatura} - ${u.nombre}` : u.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="superficie">Superficie</Label>
                <Input
                  id="superficie"
                  name="superficie"
                  type="number"
                  step="0.01"
                  min={0}
                  value={f.superficie === 0 ? '' : f.superficie}
                  onChange={chg}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="unidad_superficie">Unidad superficie</Label>
                <Input
                  id="unidad_superficie"
                  name="unidad_superficie"
                  type="select"
                  value={f.unidad_superficie}
                  onChange={chg}
                >
                  <option value="">Seleccionar</option>
                  {(unidadesSuperficie || []).map((u, idx) => (
                    <option key={u.id_unidad || `us-${idx}`} value={u.id_unidad || ''}>
                      {u.abreviatura ? `${u.abreviatura} - ${u.nombre}` : u.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="volumen">Volumen</Label>
                <Input
                  id="volumen"
                  name="volumen"
                  type="number"
                  step="0.01"
                  min={0}
                  value={f.volumen === 0 ? '' : f.volumen}
                  onChange={chg}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="unidad_volumen">Unidad volumen</Label>
                <Input
                  id="unidad_volumen"
                  name="unidad_volumen"
                  type="select"
                  value={f.unidad_volumen}
                  onChange={chg}
                >
                  <option value="">Seleccionar</option>
                  {(unidadesVolumen || []).map((u, idx) => (
                    <option key={u.id_unidad || `uv-${idx}`} value={u.id_unidad || ''}>
                      {u.abreviatura ? `${u.abreviatura} - ${u.nombre}` : u.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
        )}
        <Row>
          <Col md={12}>
            <h6 className="text-muted mb-2 mt-2">Aduanas y origen</h6>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="nomenclatura_aduanera">Nomenclatura aduanera</Label>
              <Input
                id="nomenclatura_aduanera"
                name="nomenclatura_aduanera"
                value={f.nomenclatura_aduanera}
                onChange={chg}
                placeholder="Código aduanero"
                style={ocultarStockActual && !usarTamanoReferenciaTercero ? { maxWidth: '5.75rem' } : undefined}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            {errorPaises && (
              <div className="alert alert-danger py-2 px-3 mb-2 small">
                <strong>Error cargando países:</strong> {errorPaises.message}
              </div>
            )}
            <CountrySelect
              key={`country-origen-${f.id_pais_origen}-${paises.length}`}
              id="id_pais_origen"
              name="id_pais_origen"
              value={f.id_pais_origen}
              onChange={onPaisOrigenChange}
              disabled={loadingPaises}
              loading={loadingPaises}
              countries={paises}
              label={
                <>
                  <i className="fas fa-globe me-1" />
                  País origen
                </>
              }
            />
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label>Provincia origen</Label>
              <SelectProvincia
                value={f.id_provincia_origen || null}
                onChange={onProvinciaOrigenChange}
                id_pais={f.id_pais_origen || null}
                isDisabled={!f.id_pais_origen}
                placeholder="Seleccionar provincia"
              />
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionItemInventario;
