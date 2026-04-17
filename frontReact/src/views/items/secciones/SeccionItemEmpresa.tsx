import React, { useEffect, useCallback, useMemo } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label } from 'reactstrap';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import SelectEmpresa from '../../../components/SelectEmpresa';
import SelectTipoItemCatalogo from '../../../components/SelectTipoItemCatalogo';
import SelectTipoComportamientoItem from '../../../components/SelectTipoComportamientoItem';
import useJwtPayload from '../../../hooks/useJwtPayload';
import type { ItemFormValues } from '../schemas/itemSchema';
import { listarTiposComportamientoItem } from '../../../_apis_/item';

const GET_EMPRESAS = gql`
  query GetEmpresas {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

const GET_TIPOS_ITEM_CATALOGO = gql`
  query GetTiposItemCatalogo {
    tiposItemCatalogo {
      id_tipo_item
      codigo
      nombre
      descripcion
      orden
      estado
    }
  }
`;

type Props = {
  data: Partial<ItemFormValues>;
  onChange: (d: Partial<ItemFormValues>) => void;
  mostrarAsteriscosObligatorios?: boolean;
  /** Si viene y el catálogo ya cargó, selecciona la fila con este codigo (ej. PRODUCT / SERVICE). */
  defaultTipoItemCodigo?: string;
  /**
   * Solo para flujos como Nuevo Producto: no renderiza la fila "Tipo de comportamiento" hasta que
   * el usuario elija un valor en el combo "Tipo de ítem"; si elige PRODUCT la muestra; si elige SERVICE la oculta.
   * Otros formularios no deben pasar esta prop (comportamiento actual sin cambios).
   */
  empresaOcultarComportamientoHastaElegirTipoItem?: boolean;
  /** Modo quirúrgico para NuevoProducto: oculta Tipo de ítem y Tipo de comportamiento. */
  ocultarCatalogosTipoYComportamiento?: boolean;
  /**
   * `inline`: sin Card ni título "Empresa"; solo el bloque de campos para incrustarlo en Datos generales (Nuevo Producto).
   * `default`: Card independiente (comportamiento histórico en otros formularios).
   */
  variant?: 'default' | 'inline';
};

/** Comportamientos elegibles manualmente cuando tipo ítem = PRODUCT (no SERVICIO). */
const CODIGOS_COMPORTAMIENTO_PRODUCTO = new Set([
  'SIMPLE',
  'INVENTARIABLE',
  'PERECIBLE',
  'COMBO',
  'INSUMO',
]);

type ComportamientoRow = {
  id_tipo_comportamiento: string;
  codigo: string;
  nombre: string;
};

/** Misma clave que en BD/API pero comparaciones tolerantes a mayúsculas/espacios. */
function normCodigo(c: string | undefined | null): string {
  return String(c ?? '')
    .trim()
    .toUpperCase();
}

const SeccionItemEmpresa: React.FC<Props> = ({
  data,
  onChange,
  mostrarAsteriscosObligatorios = false,
  defaultTipoItemCodigo,
  empresaOcultarComportamientoHastaElegirTipoItem = false,
  ocultarCatalogosTipoYComportamiento = false,
  variant = 'default',
}) => {
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const empresaUsuario = payload?.id_empresa;

  const [f, setF] = React.useState<{ id_empresa: string }>({ id_empresa: data.id_empresa ?? '' });

  useEffect(() => setF((p) => ({ ...p, id_empresa: data.id_empresa ?? '' })), [data.id_empresa]);

  useEffect(() => {
    if (scope === 'EMPRESA' && empresaUsuario && !data.id_empresa) {
      setF((p) => ({ ...p, id_empresa: empresaUsuario }));
      // Solo parche: evitar spread de `data` (stale) que reescribe el resto del formulario vía setValue.
      onChange({ id_empresa: empresaUsuario });
    }
  }, [scope, empresaUsuario, data.id_empresa, onChange]);

  const { data: empresasData, loading: loadingEmpresas, error: errorEmpresas } = useQuery(GET_EMPRESAS);
  const empresas = empresasData?.empresas || [];

  /**
   * Si solo ocultamos los combos pero debemos resolver `id_tipo_item` vía `defaultTipoItemCodigo`
   * (Nuevo Producto → PRODUCT, Nuevo Servicio → SERVICE), el catálogo debe cargarse igual;
   * si `skip` fuera siempre true con `ocultarCatalogosTipoYComportamiento`, `tipos` queda [] y nunca se asigna la FK.
   */
  const skipTiposCatalogo =
    ocultarCatalogosTipoYComportamiento && !defaultTipoItemCodigo;

  const {
    data: tiposData,
    loading: loadingTipos,
    error: errorTipos,
  } = useQuery(GET_TIPOS_ITEM_CATALOGO, { skip: skipTiposCatalogo });
  const tiposLista = tiposData?.tiposItemCatalogo;
  const tipos = useMemo(
    () =>
      Array.isArray(tiposLista)
        ? tiposLista.map((t: { id_tipo_item?: string; codigo?: string; nombre?: string }) => ({
            id_tipo_item: String(t?.id_tipo_item ?? ''),
            codigo: String(t?.codigo ?? ''),
            nombre: String(t?.nombre ?? ''),
          }))
        : [],
    [tiposLista]
  );

  const [comportamientos, setComportamientos] = React.useState<ComportamientoRow[]>([]);
  const [loadingComportamiento, setLoadingComportamiento] = React.useState(false);
  const [errorComportamiento, setErrorComportamiento] = React.useState<string | null>(null);

  useEffect(() => {
    if (ocultarCatalogosTipoYComportamiento) {
      setComportamientos([]);
      setLoadingComportamiento(false);
      setErrorComportamiento(null);
      return;
    }
    let cancelled = false;
    setLoadingComportamiento(true);
    setErrorComportamiento(null);
    listarTiposComportamientoItem()
      .then((list) => {
        if (cancelled) return;
        const arr = Array.isArray(list) ? list : [];
        setComportamientos(
          arr.map((item: Record<string, unknown>) => ({
            id_tipo_comportamiento: String(
              item?.id_tipo_comportamiento ?? item?.idTipoComportamiento ?? ''
            ),
            codigo: String(item?.codigo ?? ''),
            nombre: String(item?.nombre ?? item?.name ?? ''),
          }))
        );
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setComportamientos([]);
          setErrorComportamiento(e instanceof Error ? e.message : 'Error al cargar comportamiento');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingComportamiento(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ocultarCatalogosTipoYComportamiento]);

  const codigoTipoSeleccionado = useMemo(() => {
    const t = tipos.find((x) => x.id_tipo_item === data.id_tipo_item);
    return normCodigo(t?.codigo);
  }, [tipos, data.id_tipo_item]);

  const esTipoService = codigoTipoSeleccionado === 'SERVICE';

  /** Solo modo NuevoProducto: el auto-default de id_tipo_item no cuenta como "elección" del usuario. */
  const [usuarioEligioTipoItemEnCombo, setUsuarioEligioTipoItemEnCombo] = React.useState(false);

  const opcionesComportamientoProducto = useMemo(
    () =>
      comportamientos.filter((c) => CODIGOS_COMPORTAMIENTO_PRODUCTO.has(normCodigo(c.codigo))),
    [comportamientos]
  );

  const opcionServicio = useMemo(
    () => comportamientos.find((c) => normCodigo(c.codigo) === 'SERVICIO'),
    [comportamientos]
  );

  useEffect(() => {
    if (!esTipoService || !opcionServicio?.id_tipo_comportamiento) return;
    if (data.id_tipo_comportamiento && String(data.id_tipo_comportamiento).trim() !== '') return;
    onChange({ id_tipo_comportamiento: opcionServicio.id_tipo_comportamiento });
  }, [esTipoService, opcionServicio, data.id_tipo_comportamiento, onChange]);

  useEffect(() => {
    if (!defaultTipoItemCodigo || (data.id_tipo_item && String(data.id_tipo_item).trim() !== '') || tipos.length === 0) {
      return;
    }
    const found = tipos.find((t) => normCodigo(t.codigo) === normCodigo(defaultTipoItemCodigo));
    if (found?.id_tipo_item) {
      onChange({ id_tipo_item: found.id_tipo_item });
    }
  }, [defaultTipoItemCodigo, tipos, data.id_tipo_item, onChange]);

  const chg = useCallback(
    (val: string | null) => {
      const id_empresa = val ?? '';
      const u = { ...f, id_empresa };
      setF(u);
      onChange({ id_empresa });
    },
    [f, onChange]
  );

  const chgTipoItem = useCallback(
    (val: string | null) => {
      if (empresaOcultarComportamientoHastaElegirTipoItem) {
        setUsuarioEligioTipoItemEnCombo(true);
      }
      const id = val ?? '';
      const tipo = tipos.find((t) => t.id_tipo_item === id);
      const codigo = normCodigo(tipo?.codigo);
      if (codigo === 'SERVICE') {
        const serv = comportamientos.find((c) => normCodigo(c.codigo) === 'SERVICIO');
        onChange({
          id_tipo_item: id,
          id_tipo_comportamiento: serv?.id_tipo_comportamiento ?? '',
        });
        return;
      }
      onChange({ id_tipo_item: id, id_tipo_comportamiento: '' });
    },
    [empresaOcultarComportamientoHastaElegirTipoItem, tipos, comportamientos, onChange]
  );

  const chgComportamiento = useCallback(
    (val: string | null) => {
      onChange({ id_tipo_comportamiento: val ?? '' });
    },
    [onChange]
  );

  const mostrarFilaComportamiento = empresaOcultarComportamientoHastaElegirTipoItem
    ? usuarioEligioTipoItemEnCombo && codigoTipoSeleccionado === 'PRODUCT'
    : true;

  const colEmpresaSola =
    variant === 'inline' && ocultarCatalogosTipoYComportamiento ? 12 : 6;

  const contenidoEmpresa = (
    <>
      <Row>
        {scope === 'GLOBAL' && (
          <Col md={colEmpresaSola}>
            {errorEmpresas && (
              <div className="alert alert-danger">
                <strong>Error cargando empresas:</strong> {errorEmpresas.message}
              </div>
            )}
            <FormGroup>
              <Label htmlFor="id_empresa">
                Empresa {mostrarAsteriscosObligatorios && <span className="text-danger">*</span>}
              </Label>
              <SelectEmpresa
                value={f.id_empresa || ''}
                onChange={chg}
                empresas={empresas}
                isLoading={loadingEmpresas}
                isDisabled={loadingEmpresas}
                placeholder="Seleccionar empresa"
              />
            </FormGroup>
          </Col>
        )}
        {scope === 'EMPRESA' && (
          <Col md={colEmpresaSola}>
            <FormGroup>
              <Label>
                Empresa {mostrarAsteriscosObligatorios && <span className="text-danger">*</span>}
              </Label>
              <p className="form-control-plaintext text-muted mb-0">Se usará la empresa del usuario actual.</p>
            </FormGroup>
          </Col>
        )}
        {!ocultarCatalogosTipoYComportamiento && (
          <Col md={6}>
            {errorTipos && (
              <div className="alert alert-danger">
                <strong>Error cargando tipo de ítem:</strong> {errorTipos.message}
              </div>
            )}
            <FormGroup>
              <Label htmlFor="id_tipo_item">Tipo de ítem</Label>
              <SelectTipoItemCatalogo
                value={data.id_tipo_item || ''}
                onChange={chgTipoItem}
                tipos={tipos}
                isLoading={loadingTipos}
                isDisabled={loadingTipos}
                placeholder="Seleccionar tipo de ítem"
              />
            </FormGroup>
          </Col>
        )}
      </Row>
      {!ocultarCatalogosTipoYComportamiento && mostrarFilaComportamiento && (
        <Row className="mt-2">
          <Col md={6}>
            {errorComportamiento && (
              <div className="alert alert-danger py-2 mb-2">
                <strong>Error cargando tipo de comportamiento:</strong> {errorComportamiento}
              </div>
            )}
            <FormGroup>
              <Label htmlFor="id_tipo_comportamiento">Tipo de comportamiento</Label>
              {esTipoService ? (
                <SelectTipoComportamientoItem
                  value={data.id_tipo_comportamiento || ''}
                  onChange={() => {}}
                  tipos={opcionServicio ? [opcionServicio] : []}
                  isLoading={loadingComportamiento}
                  isDisabled
                  placeholder={
                    opcionServicio ? 'Servicio (asignado automáticamente)' : 'Catálogo SERVICIO no disponible'
                  }
                />
              ) : (
                <SelectTipoComportamientoItem
                  value={data.id_tipo_comportamiento || ''}
                  onChange={chgComportamiento}
                  tipos={opcionesComportamientoProducto}
                  isLoading={loadingComportamiento}
                  isDisabled={loadingComportamiento}
                  placeholder="Seleccionar comportamiento"
                />
              )}
            </FormGroup>
          </Col>
        </Row>
      )}
    </>
  );

  if (variant === 'inline') {
    return <div className="mb-4">{contenidoEmpresa}</div>;
  }

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4">
          <i className="fas fa-building text-primary me-2" />
          Empresa
        </h5>
        {contenidoEmpresa}
      </CardBody>
    </Card>
  );
};

export default SeccionItemEmpresa;
