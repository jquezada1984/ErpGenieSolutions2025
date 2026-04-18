import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Alert, Spinner } from 'reactstrap';
import { gql, useQuery } from '@apollo/client';
import type { ItemFormValues } from '../schemas/itemSchema';
import SearchableSelect from '../../../components/SearchableSelect';
import {
  type CuentaContableCatalogItem,
  filterCuentasParaCampo,
  toSelectOptions,
} from '../utils/cuentasContablesFilters';

type Props = {
  data: Partial<ItemFormValues>;
  onChange: (d: Partial<ItemFormValues>) => void;
  uiRules?: {
    mostrarCuentaVenta: boolean;
    mostrarCuentaCompra: boolean;
    mostrarCuentasEspeciales: boolean;
  };
};

/**
 * Consumo vía cliente Apollo por defecto (`mainClient` en main.tsx) → Gateway `.../graphql` → InicioNestJs.
 * No usar URL directa al puerto 3001 desde el front.
 */
const CUENTAS_CONTABLES_QUERY = gql`
  query CuentasContablesCatalogo {
    cuentasContables {
      id_cuenta_contable
      codigo
      nombre
      descripcion
      tipo_cuenta
      permite_movimientos
      estado
    }
  }
`;

const SeccionItemContabilidad: React.FC<Props> = ({ data, onChange, uiRules }) => {
  const [f, setF] = useState({
    cuenta_venta: '',
    cuenta_venta_intracomunitaria: '',
    cuenta_venta_exportacion: '',
    cuenta_compra: '',
    cuenta_compra_intracomunitaria: '',
    cuenta_compra_importacion: '',
  });

  const { data: gqlData, loading, error } = useQuery<{ cuentasContables: CuentaContableCatalogItem[] }>(
    CUENTAS_CONTABLES_QUERY,
    { fetchPolicy: 'cache-and-network' }
  );

  const cuentasRaw = gqlData?.cuentasContables ?? [];

  const opcionesCuentaVenta = useMemo(
    () => toSelectOptions(filterCuentasParaCampo('cuenta_venta', cuentasRaw)),
    [cuentasRaw]
  );
  const opcionesCuentaVentaIntracomunitaria = useMemo(
    () => toSelectOptions(filterCuentasParaCampo('cuenta_venta_intracomunitaria', cuentasRaw)),
    [cuentasRaw]
  );
  const opcionesCuentaVentaExportacion = useMemo(
    () => toSelectOptions(filterCuentasParaCampo('cuenta_venta_exportacion', cuentasRaw)),
    [cuentasRaw]
  );
  const opcionesCuentaCompra = useMemo(
    () => toSelectOptions(filterCuentasParaCampo('cuenta_compra', cuentasRaw)),
    [cuentasRaw]
  );
  const opcionesCuentaCompraIntracomunitaria = useMemo(
    () => toSelectOptions(filterCuentasParaCampo('cuenta_compra_intracomunitaria', cuentasRaw)),
    [cuentasRaw]
  );
  const opcionesCuentaCompraImportacion = useMemo(
    () => toSelectOptions(filterCuentasParaCampo('cuenta_compra_importacion', cuentasRaw)),
    [cuentasRaw]
  );

  useEffect(
    () =>
      setF((p) => ({
        ...p,
        cuenta_venta: data.cuenta_venta ?? '',
        cuenta_venta_intracomunitaria: data.cuenta_venta_intracomunitaria ?? '',
        cuenta_venta_exportacion: data.cuenta_venta_exportacion ?? '',
        cuenta_compra: data.cuenta_compra ?? '',
        cuenta_compra_intracomunitaria: data.cuenta_compra_intracomunitaria ?? '',
        cuenta_compra_importacion: data.cuenta_compra_importacion ?? '',
      })),
    [
      data.cuenta_venta,
      data.cuenta_venta_intracomunitaria,
      data.cuenta_venta_exportacion,
      data.cuenta_compra,
      data.cuenta_compra_intracomunitaria,
      data.cuenta_compra_importacion,
    ]
  );

  const setCuentaField = useCallback(
    (field: keyof typeof f, val: string | null) => {
      const value = val ?? '';
      const u = { ...f, [field]: value };
      setF(u);
      onChange({ ...data, ...u });
    },
    [f, data, onChange]
  );

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4">
          <i className="fas fa-calculator text-primary me-2" />
          Contabilidad
        </h5>

        {loading && cuentasRaw.length === 0 && (
          <div className="d-flex align-items-center gap-2 text-muted mb-3">
            <Spinner size="sm" />
            <span>Cargando catálogo de cuentas contables…</span>
          </div>
        )}

        {error && (
          <Alert color="warning" className="mb-3">
            No se pudo cargar el catálogo de cuentas contables vía GraphQL. Los combos quedarán vacíos hasta
            que el gateway e InicioNestJs respondan. ({error.message})
          </Alert>
        )}

        <Row>
          <Col md={12}>
            <h6 className="text-muted mb-2">Cuentas de venta</h6>
          </Col>
          {uiRules?.mostrarCuentaVenta !== false && (
            <Col md={6}>
              <FormGroup>
                <Label for="cuenta_venta">Cuenta venta</Label>
                <SearchableSelect
                  value={f.cuenta_venta || null}
                  onChange={(v) => setCuentaField('cuenta_venta', v)}
                  options={opcionesCuentaVenta}
                  placeholder="Seleccione cuenta contable venta"
                  isLoading={loading}
                />
              </FormGroup>
            </Col>
          )}
          {uiRules?.mostrarCuentasEspeciales !== false && (
            <Col md={6}>
              <FormGroup>
                <Label for="cuenta_venta_intracomunitaria">Cuenta venta intracomunitaria</Label>
                <SearchableSelect
                  value={f.cuenta_venta_intracomunitaria || null}
                  onChange={(v) => setCuentaField('cuenta_venta_intracomunitaria', v)}
                  options={opcionesCuentaVentaIntracomunitaria}
                  placeholder="Seleccione cuenta venta intracomunitaria"
                  isLoading={loading}
                />
              </FormGroup>
            </Col>
          )}
          {uiRules?.mostrarCuentasEspeciales !== false && (
            <Col md={6}>
              <FormGroup>
                <Label for="cuenta_venta_exportacion">Cuenta venta exportación</Label>
                <SearchableSelect
                  value={f.cuenta_venta_exportacion || null}
                  onChange={(v) => setCuentaField('cuenta_venta_exportacion', v)}
                  options={opcionesCuentaVentaExportacion}
                  placeholder="Seleccione cuenta venta exportación"
                  isLoading={loading}
                />
              </FormGroup>
            </Col>
          )}
        </Row>
        <Row className="mt-3">
          <Col md={12}>
            <h6 className="text-muted mb-2">Cuentas de compra</h6>
          </Col>
          {uiRules?.mostrarCuentaCompra !== false && (
            <Col md={6}>
              <FormGroup>
                <Label for="cuenta_compra">Cuenta compra</Label>
                <SearchableSelect
                  value={f.cuenta_compra || null}
                  onChange={(v) => setCuentaField('cuenta_compra', v)}
                  options={opcionesCuentaCompra}
                  placeholder="Seleccione cuenta contable compra"
                  isLoading={loading}
                />
              </FormGroup>
            </Col>
          )}
          {uiRules?.mostrarCuentasEspeciales !== false && (
            <Col md={6}>
              <FormGroup>
                <Label for="cuenta_compra_intracomunitaria">Cuenta compra intracomunitaria</Label>
                <SearchableSelect
                  value={f.cuenta_compra_intracomunitaria || null}
                  onChange={(v) => setCuentaField('cuenta_compra_intracomunitaria', v)}
                  options={opcionesCuentaCompraIntracomunitaria}
                  placeholder="Seleccione cuenta compra intracomunitaria"
                  isLoading={loading}
                />
              </FormGroup>
            </Col>
          )}
          {uiRules?.mostrarCuentasEspeciales !== false && (
            <Col md={6}>
              <FormGroup>
                <Label for="cuenta_compra_importacion">Cuenta compra importación</Label>
                <SearchableSelect
                  value={f.cuenta_compra_importacion || null}
                  onChange={(v) => setCuentaField('cuenta_compra_importacion', v)}
                  options={opcionesCuentaCompraImportacion}
                  placeholder="Seleccione cuenta compra importación"
                  isLoading={loading}
                />
              </FormGroup>
            </Col>
          )}
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionItemContabilidad;
