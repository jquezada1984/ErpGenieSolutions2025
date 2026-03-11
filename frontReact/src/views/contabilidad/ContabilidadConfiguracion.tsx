import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
  Form,
} from 'reactstrap';

/**
 * Configuración del módulo contable (doble partida).
 * Ruta: /contabilidad/configuracion/general
 * Basado en pantallas de configuración contable tipo Dolibarr.
 */
const ContabilidadConfiguracion = () => {
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

  const handleGrabar = (seccion: string) => {
    // TODO: enviar a API cuando exista backend de configuración
    console.log('Grabar', seccion);
  };

  return (
    <div className="p-3">
      <h4 className="mb-4">Configuración del módulo contable (doble partida)</h4>

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
          <Button color="primary" onClick={() => handleGrabar('gestion_contable')}>
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
            <Button color="primary" onClick={() => handleGrabar('parametros')}>
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
            <Button color="primary" onClick={() => handleGrabar('transferencia')}>
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
                  <Input type="switch" checked={numeracionNeon} onChange={(e) => setNumeracionNeon(e.target.checked)} />
                </td>
                <td><i className="bi bi-info-circle text-muted" /></td>
              </tr>
              <tr>
                <td><strong>Argon</strong></td>
                <td>Formato AAMMJJNNNNN (año, mes, código diario, secuencial). Ej: 2501VT00001</td>
                <td>
                  <Input type="switch" checked={numeracionArgon} onChange={(e) => setNumeracionArgon(e.target.checked)} />
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
                  <Button color="primary" size="sm" className="ms-2">Grabar</Button>
                </td>
                <td>
                  <Input type="switch" checked={numeracionHelium} onChange={(e) => setNumeracionHelium(e.target.checked)} />
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
          <Button color="primary" onClick={() => handleGrabar('numeracion_avanzadas')}>
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
            <Button color="primary" onClick={() => handleGrabar('exportacion')}>
              Grabar
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ContabilidadConfiguracion;
