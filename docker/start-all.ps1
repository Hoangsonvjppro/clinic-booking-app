# Set error action to stop on first error
$ErrorActionPreference = "Stop"

# Navigate to docker directory to ensure correct context
Set-Location $PSScriptRoot

# Pull images first to avoid build delays
Write-Host "Pulling latest images..." -ForegroundColor Cyan
docker compose pull --quiet

# Build only changed services in parallel
Write-Host "Building services..." -ForegroundColor Cyan
$env:DOCKER_BUILDKIT = "1"
$env:COMPOSE_DOCKER_CLI_BUILD = "1"

docker compose --profile gateway --profile databases --profile services --profile monitoring --profile frontend up -d --build