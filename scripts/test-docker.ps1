<#
.SYNOPSIS
  Ejecuta la suite de pruebas del ERP Genie 100% en Docker (sin Node/npm en el host).

.DESCRIPTION
  Requiere Docker Desktop. Para E2E, el stack erp-frontend-dev + gateway debe estar arriba
  (docker compose -f docker-compose.dev.yml up -d).

.PARAMETER Target
  unit   = P0 Jest/Vitest/pytest + Nest dominios
  smoke  = Playwright @smoke
  config = Playwright @config
  e2e    = Playwright smoke + config
  all    = unit + e2e

.EXAMPLE
  .\scripts\test-docker.ps1 unit
  .\scripts\test-docker.ps1 smoke
  .\scripts\test-docker.ps1 e2e
  .\scripts\test-docker.ps1 all
#>
param(
  [Parameter(Position = 0)]
  [ValidateSet('unit', 'smoke', 'config', 'e2e', 'all')]
  [string]$Target = 'unit'
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$NodeImg = 'node:20-alpine'
$PyImg = 'python:3.12-alpine'
$PwImg = 'mcr.microsoft.com/playwright:v1.63.0-jammy'

function Write-Step([string]$msg) {
  Write-Host ""
  Write-Host "==> $msg" -ForegroundColor Cyan
}

function Invoke-NodeDir([string]$WorkDir, [string]$Cmd, [switch]$IgnoreScripts) {
  $install = if ($IgnoreScripts) {
    'npm install --legacy-peer-deps --ignore-scripts'
  } else {
    'npm install --legacy-peer-deps'
  }
  docker run --rm `
    -v "${Root}:/app" `
    -w "/app/$WorkDir" `
    $NodeImg `
    sh -c "$install && $Cmd"
  if ($LASTEXITCODE -ne 0) { throw "Falló Node en $WorkDir" }
}

function Invoke-PyDir([string]$WorkDir, [string]$PipCmd, [string]$PytestCmd) {
  docker run --rm `
    -v "${Root}:/app" `
    -w "/app/$WorkDir" `
    $PyImg `
    sh -c "pip install -q $PipCmd && $PytestCmd"
  if ($LASTEXITCODE -ne 0) { throw "Falló Python en $WorkDir" }
}

function Invoke-Unit {
  Write-Step 'gateway-api (Jest + coverage P0)'
  Invoke-NodeDir 'gateway-api' 'npm test && npm run test:coverage'

  Write-Step 'frontReact (Vitest + coverage P0)'
  Invoke-NodeDir 'frontReact' 'npm test && npm run test:coverage'

  Write-Step 'InicioNestJs'
  Invoke-NodeDir 'InicioNestJs' 'npx jest --testPathPatterns="impuesto|auth.service"'

  Write-Step 'TerceroNestJs'
  Invoke-NodeDir 'TerceroNestJs' 'npx jest --testPathPatterns="tercero.(service|resolver).spec"'

  Write-Step 'ItemNestJs'
  Invoke-NodeDir 'ItemNestJs' 'npx jest --testPathPatterns="items\\.(service|resolver)\\.spec"'

  Write-Step 'InventarioNestJs'
  Invoke-NodeDir 'InventarioNestJs' 'npx jest --testPathPatterns="inventario\\.(service|resolver)\\.spec"'

  Write-Step 'FinancieroNestJs (--ignore-scripts por msnodesqlv8)'
  Invoke-NodeDir 'FinancieroNestJs' 'npx jest --testPathPatterns="financiero"' -IgnoreScripts

  Write-Step 'ContabilidadNestJs (--ignore-scripts por msnodesqlv8)'
  Invoke-NodeDir 'ContabilidadNestJs' 'npx jest --testPathPatterns="diario-contable"' -IgnoreScripts

  Write-Step 'BancoCajaNestJs'
  Invoke-NodeDir 'BancoCajaNestJs' 'npx jest --testPathPatterns="cuenta-bancaria"'

  Write-Step 'MenuNestJs'
  Invoke-NodeDir 'MenuNestJs' 'npx jest --testPathPatterns="autorizacion"'

  Write-Step 'FinancieroPython'
  Invoke-PyDir 'FinancieroPython' `
    '-r requirements.txt -r requirements-dev.txt' `
    'pytest --cov=services.factura_calc --cov-report=term-missing --cov-fail-under=80 && pytest tests/test_pago_pendiente.py'

  Write-Step 'ContabilidadWorker'
  Invoke-PyDir 'ContabilidadWorker' `
    '-r requirements.txt -r requirements-dev.txt' `
    'pytest --cov=worker --cov-report=term-missing --cov-fail-under=80'

  Write-Step 'InventarioPython'
  Invoke-PyDir 'InventarioPython' `
    '-r requirements-dev.txt sqlalchemy Flask-SQLAlchemy' `
    'pytest --cov=services.stock_service --cov=utils.sp --cov-report=term-missing --cov-fail-under=80 && pytest -m integration'

  Write-Step 'InicioPython (scope usuario)'
  Invoke-PyDir 'InicioPython' `
    '-r requirements-dev.txt' `
    'pytest'
}

function Invoke-E2e([string]$Grep) {
  Write-Step "Playwright ($Grep) — requiere erp-frontend-dev + gateway en :3000/:3002"
  $envFile = Join-Path $Root 'frontReact\.env.e2e'
  if (-not (Test-Path $envFile)) {
    Write-Host "Aviso: no existe frontReact\.env.e2e — los specs harán skip." -ForegroundColor Yellow
    Write-Host "Copia frontReact\.env.e2e.example y rellena E2E_USER_EMAIL / E2E_USER_PASSWORD."
  }

  docker run --rm `
    --add-host=host.docker.internal:host-gateway `
    -v "${Root}/frontReact:/app" `
    -w /app `
    -e E2E_BASE_URL=http://host.docker.internal:3000 `
    -e E2E_SCOPE=GLOBAL `
    -e E2E_MUTATE=0 `
    $PwImg `
    bash -c "npx playwright test --grep `"$Grep`" --reporter=list"
  if ($LASTEXITCODE -ne 0) { throw "Falló Playwright ($Grep)" }
}

Write-Host "ERP Genie — pruebas en Docker (target=$Target)" -ForegroundColor Green
Write-Host "Root: $Root"

switch ($Target) {
  'unit' { Invoke-Unit }
  'smoke' { Invoke-E2e '@smoke' }
  'config' { Invoke-E2e '@config' }
  'e2e' {
    Invoke-E2e '@smoke|@config'
  }
  'all' {
    Invoke-Unit
    Invoke-E2e '@smoke|@config'
  }
}

Write-Host ""
Write-Host "OK — $Target terminó correctamente." -ForegroundColor Green
