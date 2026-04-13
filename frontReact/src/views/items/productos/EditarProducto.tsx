import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Alert,
  Spinner,
} from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';
import classnames from 'classnames';
import '../ConfiguracionItem.scss';

import SeccionItemEmpresa from '../secciones/SeccionItemEmpresa';
import SeccionItemGeneral from '../secciones/SeccionItemGeneral';
import SeccionItemVenta from '../secciones/SeccionItemVenta';
import SeccionItemCompra from '../secciones/SeccionItemCompra';
import SeccionItemInventario from '../secciones/SeccionItemInventario';
import SeccionItemContabilidad from '../secciones/SeccionItemContabilidad';
import { ItemSchema, getDefaultItemFormValues, type ItemFormValues } from '../schemas/itemSchema';
import useJwtPayload from '../../../hooks/useJwtPayload';
import { mapItemDetalleToFormValues } from '../utils/mapItemDetalleToFormValues';
import { mapItemFormToCreateBody } from '../utils/mapItemFormToCreateBody';
import { getTipoComportamientoUiRules } from '../utils/tipoComportamientoUiRules';
import { actualizarItemProducto } from '../../../_apis_/item';

const initialForm = getDefaultItemFormValues('producto');

const ITEM_DETALLE_EDICION = gql`
  query ItemDetalleEdicion($id_item: ID!) {
    itemDetalleEdicion(id_item: $id_item) {
      id_item
      id_empresa
      producto_ref
      etiqueta
      estado
      descripcion
      url_publica
      nota_interna
      inventariable
      peso
      longitud
      anchura
      altura
      superficie
      volumen
      nomenclatura_aduanera
      precio_venta
      precio_minimo
      impuesto_id
      precio_compra
      stock_minimo_alerta
      stock_deseado
      codigo_barras
      id_pais
      id_provincia
      poblacion
      id_unidad_medida
      id_unidad_peso
      id_unidad_longitud
      id_unidad_superficie
      id_unidad_volumen
      id_almacen_defecto
      id_categoria_item
      id_estado_venta
      id_estado_compra
      id_tipo_control_caducidad
      id_tipo_item
      id_tipo_control_inventario
      id_naturaleza_item
      id_tipo_comportamiento
      id_cuenta_venta
      id_cuenta_venta_intracomunitaria
      id_cuenta_venta_exportacion
      id_cuenta_compra
      id_cuenta_compra_intracomunitaria
      id_cuenta_compra_importacion
    }
  }
`;

const EditarProducto: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const empresaUsuario = payload?.id_empresa;

  const [activeTab, setActiveTab] = useState<'1' | '2' | '3'>('1');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [fetchItemDetalle, { loading: loadingDetalle }] = useLazyQuery(ITEM_DETALLE_EDICION, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  const { watch, setValue, handleSubmit, reset } = useForm<ItemFormValues>({
    resolver: yupResolver(ItemSchema),
    mode: 'onSubmit',
    defaultValues: initialForm,
  });

  const formData = watch();

  useEffect(() => {
    if (scope === 'EMPRESA' && empresaUsuario && !formData.id_empresa) {
      setValue('id_empresa', empresaUsuario);
    }
  }, [scope, empresaUsuario, formData.id_empresa, setValue]);

  // Precarga vía Gateway → ItemNestJs (solo lectura).
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setError(null);
      const res = await fetchItemDetalle({ variables: { id_item: id } });
      if (cancelled) return;
      if (res.error?.message) {
        setError(res.error.message);
        reset({ ...initialForm });
        setHasChanges(false);
        return;
      }
      const row = res.data?.itemDetalleEdicion;
      if (!row) {
        setError('No se encontró el producto o no se pudo cargar desde el servidor.');
        reset({ ...initialForm });
        setHasChanges(false);
        return;
      }
      reset(mapItemDetalleToFormValues(row));
      setHasChanges(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, fetchItemDetalle, reset]);

  const uiRules = useMemo(() => getTipoComportamientoUiRules(''), []);

  const toggle = (t: '1' | '2' | '3') => activeTab !== t && setActiveTab(t);

  const onEmpresa = useCallback(
    (d: Partial<ItemFormValues>) => {
      Object.entries(d).forEach(([key, value]) => {
        setValue(key as keyof ItemFormValues, value as never);
      });
      setHasChanges(true);
    },
    [setValue]
  );
  const onGeneral = useCallback(
    (d: Partial<ItemFormValues>) => {
      Object.entries(d).forEach(([key, value]) => {
        setValue(key as keyof ItemFormValues, value as never);
      });
      setHasChanges(true);
    },
    [setValue]
  );
  const onVenta = useCallback(
    (d: Partial<ItemFormValues>) => {
      Object.entries(d).forEach(([key, value]) => {
        setValue(key as keyof ItemFormValues, value as never);
      });
      setHasChanges(true);
    },
    [setValue]
  );
  const onCompra = useCallback(
    (d: Partial<ItemFormValues>) => {
      Object.entries(d).forEach(([key, value]) => {
        setValue(key as keyof ItemFormValues, value as never);
      });
      setHasChanges(true);
    },
    [setValue]
  );
  const onInventario = useCallback(
    (d: Partial<ItemFormValues>) => {
      Object.entries(d).forEach(([key, value]) => {
        setValue(key as keyof ItemFormValues, value as never);
      });
      setHasChanges(true);
    },
    [setValue]
  );
  const onContabilidad = useCallback(
    (d: Partial<ItemFormValues>) => {
      Object.entries(d).forEach(([key, value]) => {
        setValue(key as keyof ItemFormValues, value as never);
      });
      setHasChanges(true);
    },
    [setValue]
  );

  const onSubmitRHF = useCallback(
    async (values: ItemFormValues) => {
      if (!id) return;
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const id_empresa = values.id_empresa || empresaUsuario || '';
        if (!id_empresa) {
          setError('Debe seleccionar una empresa');
          setLoading(false);
          return;
        }
        if (!values.nombre?.trim()) {
          setError('El nombre es obligatorio');
          setLoading(false);
          return;
        }
        const body = mapItemFormToCreateBody({ ...values, id_empresa });
        const res = await actualizarItemProducto(id, body);
        if (!res || res.success !== true) {
          const msg =
            (typeof res?.error === 'string' && res.error) ||
            (res?.errors && typeof res.errors === 'object' && JSON.stringify(res.errors)) ||
            'No se pudo guardar el producto';
          setError(msg);
          return;
        }
        setSuccess(true);
        setHasChanges(false);
        setTimeout(() => setSuccess(false), 4000);
      } catch (e: unknown) {
        const err = e as Error & { data?: { errors?: unknown; error?: string } };
        const d = err.data;
        let msg = err.message || 'Error al actualizar';
        if (d?.errors && typeof d.errors === 'object') {
          msg = JSON.stringify(d.errors);
        } else if (typeof d?.error === 'string' && d.error) {
          msg = d.error;
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [id, empresaUsuario]
  );

  const onInvalid = useCallback((formErrors: unknown) => {
    const collect = (obj: unknown): string[] => {
      if (!obj || typeof obj !== 'object') return [];
      if (obj && typeof obj === 'object' && 'message' in obj && typeof (obj as { message: unknown }).message === 'string')
        return [(obj as { message: string }).message];
      return Object.values(obj).flatMap(collect);
    };
    const messages = collect(formErrors);
    setError(messages.length > 0 ? messages.join(' | ') : 'Revisa los campos del formulario');
  }, []);

  return (
    <div className="configuracion-item">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-box text-primary me-2" />
              Editar Producto
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2" onClick={() => navigate('/items/productos')}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={handleSubmit(onSubmitRHF, onInvalid)}
                disabled={loading || loadingDetalle || !hasChanges}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando…
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </div>

          {success && <Alert color="success">Los cambios se realizaron de manera exitosa.</Alert>}
          {error && <Alert color="danger">{error}</Alert>}

          {loadingDetalle && (
            <div className="text-center py-4 text-muted">
              <Spinner size="sm" className="me-2" />
              Cargando datos del producto…
            </div>
          )}

          <p className="text-muted mb-3">
            Modifique la información del producto y haga clic en <b>Guardar Cambios</b>.
          </p>

          <Nav tabs className="nav-tabs-custom">
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => toggle('1')}>
                <i className="fas fa-id-card me-2" />
                General
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => toggle('2')}>
                <i className="fas fa-boxes me-2" />
                Inventario
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '3' })} onClick={() => toggle('3')}>
                <i className="fas fa-calculator me-2" />
                Contabilidad
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="mt-4">
            <TabPane tabId="1">
              <SeccionItemGeneral
                data={formData}
                onChange={onGeneral}
                tipoItem="producto"
                empresaSlot={
                  <SeccionItemEmpresa
                    data={formData}
                    onChange={onEmpresa}
                    mostrarAsteriscosObligatorios
                    defaultTipoItemCodigo="PRODUCT"
                    ocultarCatalogosTipoYComportamiento
                    variant="inline"
                  />
                }
                uiRules={uiRules.general}
                mostrarAsteriscosObligatorios
                ocultarCampoEtiquetaListados
              />
            </TabPane>
            <TabPane tabId="2">
              <SeccionItemInventario
                data={formData}
                onChange={onInventario}
                ocultarStockActual
                usarTamanoReferenciaTercero
                uiRules={uiRules.inventario}
              />
            </TabPane>
            <TabPane tabId="3">
              <Card>
                <CardBody>
                  <SeccionItemVenta data={formData} onChange={onVenta} modoPrecios uiRules={uiRules.precios} />
                  <SeccionItemCompra data={formData} onChange={onCompra} modoPrecios uiRules={uiRules.precios} />
                </CardBody>
              </Card>
              <SeccionItemContabilidad data={formData} onChange={onContabilidad} uiRules={uiRules.contabilidad} />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditarProducto;
