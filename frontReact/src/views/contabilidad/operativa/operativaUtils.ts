export const formatMoneda = (n: number) =>
  Number(n).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const rangoAnioActual = () => {
  const y = new Date().getFullYear();
  return { desde: `${y}-01-01`, hasta: `${y}-12-31` };
};

export const GET_PLAN_Y_CUENTAS = `
  query PlanYCuentas($id_empresa: String!, $id_plan_contable: String!) {
    planContableActivo(id_empresa: $id_empresa) {
      id_plan_contable
      nombre
    }
    cuentasContablesPorPlan(id_plan_contable: $id_plan_contable, page: 1, limit: 5000) {
      items {
        id_cuenta_contable
        codigo
        nombre
      }
    }
    diariosContables(id_empresa: $id_empresa) {
      id_diario_contable
      codigo
      nombre
    }
  }
`;
