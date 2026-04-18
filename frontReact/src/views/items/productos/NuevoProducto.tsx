import React, { useState, useCallback, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import * as yup from 'yup';
import '../ConfiguracionItem.scss';

import SeccionItemEmpresa from '../secciones/SeccionItemEmpresa';
import SeccionItemGeneral from '../secciones/SeccionItemGeneral';
import SeccionItemVenta from '../secciones/SeccionItemVenta';
import SeccionItemCompra from '../secciones/SeccionItemCompra';
import SeccionItemInventario from '../secciones/SeccionItemInventario';
import SeccionItemContabilidad from '../secciones/SeccionItemContabilidad';
import { ItemSchema, getDefaultItemFormValues, type ItemFormValues } from '../schemas/itemSchema';
import useJwtPayload from '../../../hooks/useJwtPayload';
import { crearItemProducto } from '../../../_apis_/item';
import { mapItemFormToCreateBody } from '../utils/mapItemFormToCreateBody';
import { getTipoComportamientoUiRules } from '../utils/tipoComportamientoUiRules';

const initialForm = getDefaultItemFormValues('producto');
const NuevoProductoSchema = ItemSchema.shape({
  id_tipo_comportamiento: yup
    .string()
    .trim()
    .nullable()
    .notRequired()
    .transform(() => null),
  /** Referencia de producto → `producto_ref` en API (`mapItemFormToCreateBody`). */
  codigo: yup.string().trim().required('El código de referencia es obligatorio'),
  id_naturaleza_item: yup.string().trim().required('La naturaleza del producto es obligatoria'),
  id_estado_venta: yup.string().trim().required('El estado de venta es obligatorio'),
});

const NuevoProducto: React.FC = () => {
  const navigate = useNavigate();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const empresaUsuario = payload?.id_empresa;

  const [activeTab, setActiveTab] = useState<'1' | '2' | '3'>('1');
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const { watch, setValue, handleSubmit, reset } = useForm<ItemFormValues>({
    resolver: yupResolver(NuevoProductoSchema),
    mode: 'onSubmit',
    defaultValues: initialForm,
  });

  const formData = watch();

  useEffect(() => {
    if (scope === 'EMPRESA' && empresaUsuario && !formData.id_empresa) {
      setValue('id_empresa', empresaUsuario);
    }
  }, [scope, empresaUsuario, formData.id_empresa, setValue]);

  const uiRules = React.useMemo(() => getTipoComportamientoUiRules(''), []);

  const toggle = (t: '1' | '2' | '3') => activeTab !== t && setActiveTab(t);

  const onEmpresa = useCallback(
    (d: Partial<ItemFormValues>) => {
      Object.entries(d).forEach(([key, value]) => {
        setValue(key as keyof ItemFormValues, value as never);
      });
    },
    [setValue]
  );
  const onGeneral = useCallback(
    (d: Partial<ItemFormValues>) => {
      Object.entries(d).forEach(([key, value]) => {
        setValue(key as keyof ItemFormValues, value as never);
      });
    },
    [setValue]
  );
  const onVenta = useCallback(
    (d: Partial<ItemFormValues>) => {
      Object.entries(d).forEach(([key, value]) => {
        setValue(key as keyof ItemFormValues, value as never);
      });
    },
    [setValue]
  );
  const onCompra = useCallback(
    (d: Partial<ItemFormValues>) => {
      Object.entries(d).forEach(([key, value]) => {
        setValue(key as keyof ItemFormValues, value as never);
      });
    },
    [setValue]
  );
  const onInventario = useCallback(
    (d: Partial<ItemFormValues>) => {
      Object.entries(d).forEach(([key, value]) => {
        setValue(key as keyof ItemFormValues, value as never);
      });
    },
    [setValue]
  );
  const onContabilidad = useCallback(
    (d: Partial<ItemFormValues>) => {
      Object.entries(d).forEach(([key, value]) => {
        setValue(key as keyof ItemFormValues, value as never);
      });
    },
    [setValue]
  );

  const onSubmitRHF = useCallback(
    async (values: ItemFormValues) => {
      setLoading(true);
      setErr(null);
      setOk(false);
      try {
        const id_empresa = values.id_empresa || (payload?.id_empresa ?? '');
        if (!id_empresa) {
          setErr('La empresa es obligatoria');
          setLoading(false);
          return;
        }
        if (!values.nombre?.trim()) {
          setErr('El nombre es obligatorio');
          setLoading(false);
          return;
        }
        if (!values.codigo?.trim()) {
          setErr('El código de referencia es obligatorio');
          setLoading(false);
          return;
        }
        if (!values.id_naturaleza_item?.trim()) {
          setErr('La naturaleza del producto es obligatoria');
          setLoading(false);
          return;
        }
        if (!values.id_estado_venta?.trim()) {
          setErr('El estado de venta es obligatorio');
          setLoading(false);
          return;
        }
        const body = mapItemFormToCreateBody({ ...values, id_empresa });
        const res = await crearItemProducto(body);
        if (res?.success && res?.id_item) {
          setOk(true);
          setTimeout(() => {
            reset({ ...initialForm, id_empresa });
            setOk(false);
            setActiveTab('1');
          }, 2000);
        } else {
          setErr(res?.message || res?.error || 'No se pudo crear el producto');
        }
      } catch (e: unknown) {
        const ax = e as {
          message?: string;
          data?: { errors?: unknown; error?: string; detail?: string };
          response?: { data?: { errors?: unknown; error?: string; detail?: string } };
        };
        const d = ax.data ?? ax.response?.data;
        if (d?.errors && typeof d.errors === 'object') {
          const flat = Object.entries(d.errors as Record<string, string[]>)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join(' | ');
          setErr(flat || ax.message || 'Error de validación');
        } else {
          setErr(d?.error || d?.detail || ax?.message || 'Error al crear el producto');
        }
      } finally {
        setLoading(false);
      }
    },
    [payload?.id_empresa, reset]
  );

  const onInvalid = useCallback((formErrors: unknown) => {
    const collect = (obj: unknown): string[] => {
      if (!obj || typeof obj !== 'object') return [];
      if (obj && typeof obj === 'object' && 'message' in obj && typeof (obj as { message: unknown }).message === 'string')
        return [(obj as { message: string }).message];
      return Object.values(obj).flatMap(collect);
    };
    const messages = collect(formErrors);
    setErr(messages.length > 0 ? messages.join(' | ') : 'Revisa los campos del formulario');
  }, []);

  return (
    <div className="configuracion-item">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-box text-primary me-2" />
              Nuevo Producto
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2" onClick={() => navigate('/items/productos')}>
                Cancelar
              </Button>
              <Button color="primary" onClick={handleSubmit(onSubmitRHF, onInvalid)} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando…
                  </>
                ) : (
                  'Crear Producto'
                )}
              </Button>
            </div>
          </div>

          {ok && <Alert color="success">Producto creado correctamente.</Alert>}
          {err && <Alert color="danger">{err}</Alert>}

          <p className="text-muted mb-3">
            Complete la información del producto y haga clic en <b>Crear Producto</b>.
          </p>

          <Nav tabs className="nav-tabs-custom">
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => toggle('1')}>
                <i className="fas fa-id-card me-2" />General
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => toggle('2')}>
                <i className="fas fa-boxes me-2" />Inventario
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '3' })} onClick={() => toggle('3')}>
                <i className="fas fa-calculator me-2" />Contabilidad
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

export default NuevoProducto;
