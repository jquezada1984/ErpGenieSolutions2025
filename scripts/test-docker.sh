#!/usr/bin/env bash
# Ejecuta pruebas del ERP Genie 100% en Docker (sin Node local).
# Uso: ./scripts/test-docker.sh unit|smoke|config|e2e|all
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
TARGET="${1:-unit}"
NODE_IMG=node:20-alpine
PY_IMG=python:3.12-alpine
PW_IMG=mcr.microsoft.com/playwright:v1.63.0-jammy

node_dir() {
  local dir="$1" cmd="$2" ignore="${3:-}"
  local install="npm install --legacy-peer-deps"
  [[ "$ignore" == "ignore" ]] && install="npm install --legacy-peer-deps --ignore-scripts"
  echo "==> $dir"
  docker run --rm -v "$ROOT:/app" -w "/app/$dir" "$NODE_IMG" sh -c "$install && $cmd"
}

py_dir() {
  local dir="$1" pip="$2" pytest="$3"
  echo "==> $dir"
  docker run --rm -v "$ROOT:/app" -w "/app/$dir" "$PY_IMG" sh -c "pip install -q $pip && $pytest"
}

run_unit() {
  node_dir gateway-api "npm test && npm run test:coverage"
  node_dir frontReact "npm test && npm run test:coverage"
  node_dir InicioNestJs 'npx jest --testPathPatterns="impuesto|auth.service"'
  node_dir TerceroNestJs 'npx jest --testPathPatterns="tercero.(service|resolver).spec"'
  node_dir ItemNestJs 'npx jest --testPathPatterns="items\\.(service|resolver)\\.spec"'
  node_dir InventarioNestJs 'npx jest --testPathPatterns="inventario\\.(service|resolver)\\.spec"'
  node_dir FinancieroNestJs 'npx jest --testPathPatterns="financiero"' ignore
  node_dir ContabilidadNestJs 'npx jest --testPathPatterns="diario-contable"' ignore
  node_dir BancoCajaNestJs 'npx jest --testPathPatterns="cuenta-bancaria"'
  node_dir MenuNestJs 'npx jest --testPathPatterns="autorizacion"'
  py_dir FinancieroPython "-r requirements.txt -r requirements-dev.txt" \
    "pytest --cov=services.factura_calc --cov-fail-under=80 && pytest tests/test_pago_pendiente.py"
  py_dir ContabilidadWorker "-r requirements.txt -r requirements-dev.txt" \
    "pytest --cov=worker --cov-fail-under=80"
  py_dir InventarioPython "-r requirements-dev.txt sqlalchemy Flask-SQLAlchemy" \
    "pytest --cov=services.stock_service --cov=utils.sp --cov-fail-under=80 && pytest -m integration"
  py_dir InicioPython "-r requirements-dev.txt" "pytest"
}

run_e2e() {
  local grep="$1"
  echo "==> Playwright ($grep)"
  docker run --rm --add-host=host.docker.internal:host-gateway \
    -v "$ROOT/frontReact:/app" -w /app \
    -e E2E_BASE_URL=http://host.docker.internal:3000 \
    -e E2E_SCOPE=GLOBAL -e E2E_MUTATE=0 \
    "$PW_IMG" bash -c "npx playwright test --grep \"$grep\" --reporter=list"
}

case "$TARGET" in
  unit) run_unit ;;
  smoke) run_e2e '@smoke' ;;
  config) run_e2e '@config' ;;
  e2e) run_e2e '@smoke|@config' ;;
  all) run_unit; run_e2e '@smoke|@config' ;;
  *) echo "Uso: $0 unit|smoke|config|e2e|all"; exit 1 ;;
esac
echo "OK — $TARGET"
