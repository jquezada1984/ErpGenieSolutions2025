import React, { useEffect, useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Alert,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
  Form,
  Spinner,
} from 'reactstrap';
import axios from 'axios';
import useJwtPayload from '../../hooks/useJwtPayload';

const GATEWAY_API_URL = (import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002').replace(/\/$/, '');

const GET_CONFIGURACION_CONTABILIDAD = gql`
  query GetConfiguracionContabilidad($id_empresa: String!) {
    configuracionContabilidad(id_empresa: $id_empresa) {
      id_configuracion_contabilidad
      id_empresa
      metodo_contable
      desactivar_transacciones_directas
      lista_combinada_subsidiaria
      gestion_cero_final
      longitud_cuentas_generales
      longitud_subcuentas_terceros
      periodo_por_defecto
      fecha_excluir_antes
      etiqueta_operacion_defecto
      deshabilitar_transferencia_ventas
      deshabilitar_transferencia_compras
      deshabilitar_informes_gastos
      deshabilitar_activos_fijos
      deshabilitar_descuentos
      usar_fecha_fin_periodo_informe_gastos
      solo_lineas_conciliadas_extracto
      numeracion_modelo
      mascara_helium
      coincidencia_contable
      iva_revertido_compras
      tab_libro_auxiliar_terceros
      prefijo_exportacion
      formato_exportacion
      formato_archivo
      separador_columnas
      tipo_retorno_carro
      formato_fecha_exportacion
    }
  }
`;

/**
 * Configuración del módulo contable (doble partida).
 * Ruta: /contabilidad/configuracion/general
 * Basado en pantallas de configuración contable tipo Dolibarr.
 */
const ContabilidadConfiguracion = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);

  const [metodoContable, setMetodoContable] = useState<'acumulacion' | 'caja'>('acumulacion');
  const [desactivarTransaccionesDirectas, setDesactivarTransaccionesDirectas] = useState(false);
  const [listaCombinadaSubsidiaria, setListaCombinadaSubsidiaria] = useState(false);
  const [cerosFinalCuenta, setCerosFinalCuenta] = useState(false);
  const [longitudCuentasGenerales, setLongitudCuentasGenerales] = useState('');
  const [longitudSubcuentasTerceros, setLongitudSubcuentasTerceros] = useState('');
  const [periodoPorDefecto, setPeriodoPorDefecto] = useState('mes_anterior');
  const [fechaExcluirAntes, setFechaExcluirAntes] = useState('');
  const [etiquetaOperacionDefecto, setEtiquetaOperacionDefecto] = useState('tercero_apunte_desc');
  const [deshabilitarTransferenciaVentas, setDeshabilitarTransferenciaVentas] = useState(false);
  const [deshabilitarTransferenciaCompras, setDeshabilitarTransferenciaCompras] = useState(false);
  const [deshabilitarInformesGastos, setDeshabilitarInformesGastos] = useState(false);
  const [deshabilitarActivosFijos, setDeshabilitarActivosFijos] = useState(false);
  const [deshabilitarDescuentos, setDeshabilitarDescuentos] = useState(false);
  const [fechaFinPeriodoInformeGastos, setFechaFinPeriodoInformeGastos] = useState(false);
  const [soloLineasConciliadas, setSoloLineasConciliadas] = useState(false);
  const [numeracionNeon, setNumeracionNeon] = useState(true);
  const [numeracionArgon, setNumeracionArgon] = useState(false);
  const [numeracionHelium, setNumeracionHelium] = useState(false);
  const [mascaraHelium, setMascaraHelium] = useState('');
  const [coincidenciaContable, setCoincidenciaContable] = useState(false);
  const [ivaRevertidoCompras, setIvaRevertidoCompras] = useState(false);
  const [tabLibroAuxiliarTerceros, setTabLibroAuxiliarTerceros] = useState(false);
  const [prefijoExportacion, setPrefijoExportacion] = useState('');
  const [formatoExportacion, setFormatoExportacion] = useState('csv_configurable');
  const [formatoArchivo, setFormatoArchivo] = useState('csv');
  const [separadorColumnas, setSeparadorColumnas] = useState(',');
  const [tipoRetornoCarro, setTipoRetornoCarro] = useState('unix');
  const [formatoFechaExportacion, setFormatoFechaExportacion] = useState('%Y-%m-%d');
  const [estadoGuardado, setEstadoGuardado] = useState<{ tipo: 'ok' | 'error'; mensaje: string } | null>(null);
  const [seccionGuardando, setSeccionGuardando] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_CONFIGURACION_CONTABILIDAD, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const cfg = data?.configuracionContabilidad;
    if (!cfg) return;

    setMetodoContable(cfg.metodo_contable === 'caja' ? 'caja' : 'acumulacion');
    setDesactivarTransaccionesDirectas(!!cfg.desactivar_transacciones_directas);
    setListaCombinadaSubsidiaria(!!cfg.lista_combinada_subsidiaria);
    setCerosFinalCuenta(!!cfg.gestion_cero_final);
    setLongitudCuentasGenerales(cfg.longitud_cuentas_generales != null ? String(cfg.longitud_cuentas_generales) : '');
    setLongitudSubcuentasTerceros(cfg.longitud_subcuentas_terceros != null ? String(cfg.longitud_subcuentas_terceros) : '');
    setPeriodoPorDefecto(cfg.periodo_por_defecto || 'mes_anterior');
    setFechaExcluirAntes(cfg.fecha_excluir_antes || '');
    setEtiquetaOperacionDefecto(cfg.etiqueta_operacion_defecto || 'tercero_apunte_desc');
    setDeshabilitarTransferenciaVentas(!!cfg.deshabilitar_transferencia_ventas);
    setDeshabilitarTransferenciaCompras(!!cfg.deshabilitar_transferencia_compras);
    setDeshabilitarInformesGastos(!!cfg.deshabilitar_informes_gastos);
    setDeshabilitarActivosFijos(!!cfg.deshabilitar_activos_fijos);
    setDeshabilitarDescuentos(!!cfg.deshabilitar_descuentos);
    setFechaFinPeriodoInformeGastos(!!cfg.usar_fecha_fin_periodo_informe_gastos);
    setSoloLineasConciliadas(!!cfg.solo_lineas_conciliadas_extracto);

    const modelo = cfg.numeracion_modelo || 'neon';
    setNumeracionNeon(modelo === 'neon');
    setNumeracionArgon(modelo === 'argon');
    setNumeracionHelium(modelo === 'helium');
    setMascaraHelium(cfg.mascara_helium || '');

    setCoincidenciaContable(!!cfg.coincidencia_contable);
    setIvaRevertidoCompras(!!cfg.iva_revertido_compras);
    setTabLibroAuxiliarTerceros(!!cfg.tab_libro_auxiliar_terceros);
    setPrefijoExportacion(cfg.prefijo_exportacion || '');
    setFormatoExportacion(cfg.formato_exportacion || 'csv_configurable');
    setFormatoArchivo(cfg.formato_archivo || 'csv');
    setSeparadorColumnas(cfg.separador_columnas || ',');
    setTipoRetornoCarro(cfg.tipo_retorno_carro || 'unix');
    setFormatoFechaExportacion(cfg.formato_fecha_exportacion || '%Y-%m-%d');
  }, [data]);

  const getNumeracionModelo = (): 'neon' | 'argon' | 'helium' => {
    if (numeracionHelium) return 'helium';
    if (numeracionArgon) return 'argon';
    return 'neon';
  };

  const parseEntero = (value: string): number | null => {
    const t = value.trim();
    if (!t) return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
  };

  const buildPayload = (seccion: string) => {
    switch (seccion) {
      case 'gestion_contable':
        return { metodo_contable: metodoContable };
      case 'parametros':
        return {
          desactivar_transacciones_directas: desactivarTransaccionesDirectas,
          lista_combinada_subsidiaria: listaCombinadaSubsidiaria,
          gestion_cero_final: cerosFinalCuenta,
          longitud_cuentas_generales: parseEntero(longitudCuentasGenerales),
          longitud_subcuentas_terceros: parseEntero(longitudSubcuentasTerceros),
        };
      case 'transferencia':
        return {
          periodo_por_defecto: periodoPorDefecto,
          fecha_excluir_antes: fechaExcluirAntes || null,
          etiqueta_operacion_defecto: etiquetaOperacionDefecto,
          deshabilitar_transferencia_ventas: deshabilitarTransferenciaVentas,
          deshabilitar_transferencia_compras: deshabilitarTransferenciaCompras,
          deshabilitar_informes_gastos: deshabilitarInformesGastos,
          deshabilitar_activos_fijos: deshabilitarActivosFijos,
          deshabilitar_descuentos: deshabilitarDescuentos,
          usar_fecha_fin_periodo_informe_gastos: fechaFinPeriodoInformeGastos,
          solo_lineas_conciliadas_extracto: soloLineasConciliadas,
        };
      case 'numeracion_avanzadas':
        return {
          numeracion_modelo: getNumeracionModelo(),
          mascara_helium: mascaraHelium || null,
          coincidencia_contable: coincidenciaContable,
          iva_revertido_compras: ivaRevertidoCompras,
          tab_libro_auxiliar_terceros: tabLibroAuxiliarTerceros,
        };
      case 'exportacion':
        return {
          prefijo_exportacion: prefijoExportacion || null,
          formato_exportacion: formatoExportacion,
          formato_archivo: formatoArchivo,
          separador_columnas: separadorColumnas,
          tipo_retorno_carro: tipoRetornoCarro,
          formato_fecha_exportacion: formatoFechaExportacion,
        };
      default:
        return {};
    }
  };

  const handleGrabar = async (seccion: string) => {
    if (!idEmpresa) {
      setEstadoGuardado({ tipo: 'error', mensaje: 'No se pudo determinar la empresa del usuario.' });
      return;
    }

    setEstadoGuardado(null);
    setSeccionGuardando(seccion);
    try {
      const token = localStorage.getItem('accessToken') || '';
      await axios.put(
        `${GATEWAY_API_URL}/api/configuracion-contabilidad`,
        buildPayload(seccion),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
            'X-Company-Id': idEmpresa,
          },
        },
      );
      setEstadoGuardado({ tipo: 'ok', mensaje: 'Configuración guardada correctamente.' });
      await refetch();
    } catch (e: any) {
      const mensaje = e?.response?.data?.error || e?.message || 'Error al guardar configuración.';
      setEstadoGuardado({ tipo: 'error', mensaje });
    } finally {
      setSeccionGuardando(null);
    }
  };

  return (
    <div className="p-3">
      <h4 className="mb-4">Configuración del módulo contable (doble partida)</h4>
      {!idEmpresa && (
        <Alert color="warning">No se detectó `id_empresa` en el token de sesión.</Alert>
      )}
      {error && (
        <Alert color="danger">Error cargando configuración: {error.message}</Alert>
      )}
      {estadoGuardado && (
        <Alert color={estadoGuardado.tipo === 'ok' ? 'success' : 'danger'}>
          {estadoGuardado.mensaje}
        </Alert>
      )}
      {loading && (
        <div className="mb-3 d-flex align-items-center gap-2">
          <Spinner size="sm" />
          <span>Cargando configuración...</span>
        </div>
      )}

      {/* Sección 1: Opción de gestión contable */}
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h6" className="text-muted border-bottom pb-2 mb-3">
            Opción de gestión contable
          </CardTitle>
          <FormGroup tag="fieldset">
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="metodoContable"
                  checked={metodoContable === 'acumulacion'}
                  onChange={() => setMetodoContable('acumulacion')}
                />
                Contabilidad de acumulación (Predeterminado)
              </Label>
              <small className="text-muted d-block ms-4">
                Método de acumulación (real/completo). Se usa toda la información (facturas de compra y venta, informes de gastos, banco, etc.) para generar la contabilidad.
              </small>
            </FormGroup>
            <FormGroup check className="mt-2">
              <Label check>
                <Input
                  type="radio"
                  name="metodoContable"
                  checked={metodoContable === 'caja'}
                  onChange={() => setMetodoContable('caja')}
                />
                Contabilidad de caja
              </Label>
              <small className="text-muted d-block ms-4">
                Solo se usan los pagos y sus fechas para generar la contabilidad. Consulte con su firma de contabilidad si cumple los requisitos.
              </small>
            </FormGroup>
          </FormGroup>
          <Button color="primary" type="button" disabled={!!seccionGuardando} onClick={() => handleGrabar('gestion_contable')}>
            Grabar
          </Button>
        </CardBody>
      </Card>

      {/* Sección 2: Parámetros */}
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h6" className="text-muted border-bottom pb-2 mb-3">
            Parámetro
          </CardTitle>
          <Form>
            <FormGroup switch>
              <Label check>Desactivar transacciones directas en cuenta bancaria</Label>
              <Input
                type="switch"
                checked={desactivarTransaccionesDirectas}
                onChange={(e) => setDesactivarTransaccionesDirectas(e.target.checked)}
              />
            </FormGroup>
            <FormGroup switch>
              <Label check>Habilitar la lista combinada para la cuenta subsidiaria (puede ser lento con muchos terceros)</Label>
              <Input
                type="switch"
                checked={listaCombinadaSubsidiaria}
                onChange={(e) => setListaCombinadaSubsidiaria(e.target.checked)}
              />
            </FormGroup>
            <FormGroup switch>
              <Label check>Permitir diferentes números de ceros al final de una cuenta contable en lugar de longitud fija</Label>
              <Input
                type="switch"
                checked={cerosFinalCuenta}
                onChange={(e) => setCerosFinalCuenta(e.target.checked)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Longitud de las cuentas generales (ej: 6 hace que "706" se muestre como "706000")</Label>
              <Input
                type="number"
                value={longitudCuentasGenerales}
                onChange={(e) => setLongitudCuentasGenerales(e.target.value)}
                placeholder="Ej: 6"
              />
            </FormGroup>
            <FormGroup>
              <Label>Longitud de las subcuentas de terceros (ej: 6 hace que "401" se muestre como "401000")</Label>
              <Input
                type="number"
                value={longitudSubcuentasTerceros}
                onChange={(e) => setLongitudSubcuentasTerceros(e.target.value)}
                placeholder="Ej: 6"
              />
            </FormGroup>
            <Button color="primary" type="button" disabled={!!seccionGuardando} onClick={() => handleGrabar('parametros')}>
              Grabar
            </Button>
          </Form>
        </CardBody>
      </Card>

      {/* Sección 3: Opciones para la transferencia en contabilidad */}
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h6" className="text-muted border-bottom pb-2 mb-3">
            Opciones para la transferencia en contabilidad
          </CardTitle>
          <Form>
            <FormGroup>
              <Label>En la página para transferir datos a contabilidad, ¿cuál es el período seleccionado por defecto?</Label>
              <Input
                type="select"
                value={periodoPorDefecto}
                onChange={(e) => setPeriodoPorDefecto(e.target.value)}
              >
                <option value="mes_actual">Mes actual</option>
                <option value="mes_anterior">Mes anterior</option>
                <option value="trimestre_actual">Trimestre actual</option>
                <option value="ano_actual">Año actual</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Deshabilitar vinculación y transferencia cuando la fecha sea anterior a esta (transacciones anteriores se excluyen por defecto)</Label>
              <Input
                type="date"
                value={fechaExcluirAntes}
                onChange={(e) => setFechaExcluirAntes(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Cuando se genera la contabilidad, etiqueta de operación predeterminada</Label>
              <Input
                type="select"
                value={etiquetaOperacionDefecto}
                onChange={(e) => setEtiquetaOperacionDefecto(e.target.value)}
              >
                <option value="tercero_apunte_desc">Nombre del tercero - Apunte - Descripción</option>
                <option value="ref_fecha">Referencia - Fecha</option>
                <option value="codigo_desc">Código - Descripción</option>
              </Input>
            </FormGroup>
            <FormGroup switch>
              <Label check>Deshabilitar vinculación y transferencia en contabilidad de ventas (facturas de clientes no se tendrán en cuenta)</Label>
              <Input type="switch" checked={deshabilitarTransferenciaVentas} onChange={(e) => setDeshabilitarTransferenciaVentas(e.target.checked)} />
            </FormGroup>
            <FormGroup switch>
              <Label check>Deshabilitar vinculación y transferencia en contabilidad de compras (facturas de proveedores no se tendrán en cuenta)</Label>
              <Input type="switch" checked={deshabilitarTransferenciaCompras} onChange={(e) => setDeshabilitarTransferenciaCompras(e.target.checked)} />
            </FormGroup>
            <FormGroup switch>
              <Label check>Desactivar vinculación y transferencia en informes de gastos</Label>
              <Input type="switch" checked={deshabilitarInformesGastos} onChange={(e) => setDeshabilitarInformesGastos(e.target.checked)} />
            </FormGroup>
            <FormGroup switch>
              <Label check>Desactivar transferencia en contabilidad de activos fijos</Label>
              <Input type="switch" checked={deshabilitarActivosFijos} onChange={(e) => setDeshabilitarActivosFijos(e.target.checked)} />
            </FormGroup>
            <FormGroup switch>
              <Label check>Desactivar transferencia en contabilidad sobre descuentos</Label>
              <Input type="switch" checked={deshabilitarDescuentos} onChange={(e) => setDeshabilitarDescuentos(e.target.checked)} />
            </FormGroup>
            <FormGroup switch>
              <Label check>Usar la fecha de fin del período del informe de gastos como fecha de transferencia, en lugar de la fecha del gasto</Label>
              <Input type="switch" checked={fechaFinPeriodoInformeGastos} onChange={(e) => setFechaFinPeriodoInformeGastos(e.target.checked)} />
            </FormGroup>
            <FormGroup switch>
              <Label check>Transferir a contabilidad únicamente las líneas conciliadas en los extractos bancarios</Label>
              <Input type="switch" checked={soloLineasConciliadas} onChange={(e) => setSoloLineasConciliadas(e.target.checked)} />
            </FormGroup>
            <Button color="primary" type="button" disabled={!!seccionGuardando} onClick={() => handleGrabar('transferencia')}>
              Grabar
            </Button>
          </Form>
        </CardBody>
      </Card>

      {/* Sección 4: Modelos de numeración contable y opciones avanzadas */}
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h6" className="text-muted border-bottom pb-2 mb-3">
            Modelos de numeración contable
          </CardTitle>
          <Table bordered size="sm">
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Descripción / Ejemplo</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Neon</strong></td>
                <td>Código gratuito sin verificación.</td>
                <td>
                  <Input
                    type="switch"
                    checked={numeracionNeon}
                    onChange={(e) => {
                      const active = e.target.checked;
                      setNumeracionNeon(active);
                      if (active) {
                        setNumeracionArgon(false);
                        setNumeracionHelium(false);
                      }
                    }}
                  />
                </td>
                <td><i className="bi bi-info-circle text-muted" /></td>
              </tr>
              <tr>
                <td><strong>Argon</strong></td>
                <td>Formato AAMMJJNNNNN (año, mes, código diario, secuencial). Ej: 2501VT00001</td>
                <td>
                  <Input
                    type="switch"
                    checked={numeracionArgon}
                    onChange={(e) => {
                      const active = e.target.checked;
                      setNumeracionArgon(active);
                      if (active) {
                        setNumeracionNeon(false);
                        setNumeracionHelium(false);
                      }
                    }}
                  />
                </td>
                <td><i className="bi bi-info-circle text-muted" /></td>
              </tr>
              <tr>
                <td><strong>Helium</strong></td>
                <td>
                  Número según máscara definida.
                  <Input
                    type="text"
                    value={mascaraHelium}
                    onChange={(e) => setMascaraHelium(e.target.value)}
                    placeholder="Máscara"
                    className="ms-2 d-inline-block"
                    style={{ width: 200 }}
                  />
                  <Button color="primary" size="sm" className="ms-2" type="button" disabled={!!seccionGuardando} onClick={() => handleGrabar('numeracion_avanzadas')}>Grabar</Button>
                </td>
                <td>
                  <Input
                    type="switch"
                    checked={numeracionHelium}
                    onChange={(e) => {
                      const active = e.target.checked;
                      setNumeracionHelium(active);
                      if (active) {
                        setNumeracionNeon(false);
                        setNumeracionArgon(false);
                      }
                    }}
                  />
                </td>
                <td><i className="bi bi-info-circle text-muted" /></td>
              </tr>
            </tbody>
          </Table>

          <CardTitle tag="h6" className="text-muted border-bottom pb-2 mb-3 mt-4">
            Opciones avanzadas
          </CardTitle>
          <FormGroup switch>
            <Label check>Habilitar la función de coincidencia en la contabilidad</Label>
            <Input type="switch" checked={coincidenciaContable} onChange={(e) => setCoincidenciaContable(e.target.checked)} />
          </FormGroup>
          <FormGroup switch>
            <Label check>Activar la gestión del cobro revertido del IVA en las compras a proveedores</Label>
            <Input type="switch" checked={ivaRevertidoCompras} onChange={(e) => setIvaRevertidoCompras(e.target.checked)} />
          </FormGroup>
          <FormGroup switch>
            <Label check>Activar una pestaña en tarjetas de terceros para ver el libro auxiliar</Label>
            <Input type="switch" checked={tabLibroAuxiliarTerceros} onChange={(e) => setTabLibroAuxiliarTerceros(e.target.checked)} />
          </FormGroup>
          <Button color="primary" type="button" disabled={!!seccionGuardando} onClick={() => handleGrabar('numeracion_avanzadas')}>
            Grabar
          </Button>
        </CardBody>
      </Card>

      {/* Sección 5: Opciones de exportación */}
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h6" className="text-muted border-bottom pb-2 mb-3">
            Opciones de exportación
          </CardTitle>
          <Form>
            <FormGroup>
              <Label>Especifique el prefijo del nombre de archivo</Label>
              <Input
                type="text"
                value={prefijoExportacion}
                onChange={(e) => setPrefijoExportacion(e.target.value)}
                placeholder="Prefijo"
              />
            </FormGroup>
            <FormGroup>
              <Label>Seleccione el formato predeterminado para exportar</Label>
              <Input type="select" value={formatoExportacion} onChange={(e) => setFormatoExportacion(e.target.value)}>
                <option value="csv_configurable">Exportación CSV configurable</option>
                <option value="csv_simple">CSV simple</option>
                <option value="excel">Excel</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Seleccione el formato del archivo</Label>
              <Input type="select" value={formatoArchivo} onChange={(e) => setFormatoArchivo(e.target.value)}>
                <option value="csv">csv</option>
                <option value="xlsx">xlsx</option>
                <option value="txt">txt</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Separador de columnas en el archivo de exportación</Label>
              <Input
                type="text"
                value={separadorColumnas}
                onChange={(e) => setSeparadorColumnas(e.target.value)}
                placeholder=","
              />
            </FormGroup>
            <FormGroup>
              <Label>Seleccione el tipo de retorno de carro</Label>
              <Input type="select" value={tipoRetornoCarro} onChange={(e) => setTipoRetornoCarro(e.target.value)}>
                <option value="unix">Unix</option>
                <option value="windows">Windows</option>
                <option value="mac">Mac</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Formato de fecha en el archivo de exportación</Label>
              <Input
                type="text"
                value={formatoFechaExportacion}
                onChange={(e) => setFormatoFechaExportacion(e.target.value)}
                placeholder="%Y-%m-%d"
              />
            </FormGroup>
            <Button color="primary" type="button" disabled={!!seccionGuardando} onClick={() => handleGrabar('exportacion')}>
              Grabar
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ContabilidadConfiguracion;
