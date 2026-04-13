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
import { useNavigate, useParams } from 'react-router-dom';
import classnames from 'classnames';
import '../ConfiguracionItem.scss';

import SeccionItemEmpresa from '../secciones/SeccionItemEmpresa';
import SeccionItemGeneral from '../secciones/SeccionItemGeneral';
import SeccionItemVenta from '../secciones/SeccionItemVenta';
import SeccionItemServicio from '../secciones/SeccionItemServicio';
import { ItemSchema, getDefaultItemFormValues, type ItemFormValues } from '../schemas/itemSchema';
import useJwtPayload from '../../../hooks/useJwtPayload';

const initialForm = getDefaultItemFormValues('servicio');

const EditarServicio: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const empresaUsuario = payload?.id_empresa;

  const [activeTab, setActiveTab] = useState<'1' | '2' | '3' | '4'>('1');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [mockLoaded, setMockLoaded] = useState(false);

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

  useEffect(() => {
    if (!id || mockLoaded) return;
    const timer = setTimeout(() => {
      reset({
        ...initialForm,
        id_empresa: empresaUsuario || '',
        nombre: 'Servicio de ejemplo',
        codigo: id,
        descripcion: 'Cargado solo en frontend',
        estado: true,
        tipo_item: 'servicio',
        precio_venta: 50,
        descripcion_servicio: 'Descripción del servicio',
      });
      setMockLoaded(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [id, empresaUsuario, reset, mockLoaded]);

  const toggle = (t: '1' | '2' | '3' | '4') => activeTab !== t && setActiveTab(t);

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
  const onServicio = useCallback(
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
        console.log('📤 Editar servicio (frontend only):', id, { ...values, id_empresa });
        setSuccess(true);
        setHasChanges(false);
        setTimeout(() => setSuccess(false), 4000);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error al actualizar');
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
              <i className="fas fa-edit text-primary me-2" />
              Editar Servicio
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2" onClick={() => navigate('/items/servicios')}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={handleSubmit(onSubmitRHF, onInvalid)}
                disabled={loading || !hasChanges}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </div>

          {success && (
            <Alert color="info">
              Cambios validados. Backend de ítems no conectado; no se han guardado en servidor.
            </Alert>
          )}
          {error && <Alert color="danger">{error}</Alert>}

          <p className="text-muted mb-3">
            Modifique la información del servicio y haga clic en <b>Guardar Cambios</b>.
          </p>

          <Nav tabs className="nav-tabs-custom">
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => toggle('1')}>
                <i className="fas fa-building me-2" />Empresa
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => toggle('2')}>
                <i className="fas fa-id-card me-2" />General
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '3' })} onClick={() => toggle('3')}>
                <i className="fas fa-tag me-2" />Venta
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '4' })} onClick={() => toggle('4')}>
                <i className="fas fa-concierge-bell me-2" />Servicio
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="mt-4">
            <TabPane tabId="1">
              <SeccionItemEmpresa data={formData} onChange={onEmpresa} />
            </TabPane>
            <TabPane tabId="2">
              <SeccionItemGeneral data={formData} onChange={onGeneral} tipoItem="servicio" />
            </TabPane>
            <TabPane tabId="3">
              <SeccionItemVenta data={formData} onChange={onVenta} />
            </TabPane>
            <TabPane tabId="4">
              <SeccionItemServicio data={formData} onChange={onServicio} />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditarServicio;
