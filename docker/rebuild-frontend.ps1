# ==============================================================================
# REBUILD FRONTEND - Build và run lại frontend web
# ==============================================================================

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "         REBUILD FRONTEND WEB              " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Dừng frontend hiện tại..." -ForegroundColor Cyan
docker compose --profile frontend stop

Write-Host ""
Write-Host "[2/3] Xóa container cũ..." -ForegroundColor Cyan
docker compose --profile frontend rm -f

Write-Host ""
Write-Host "[3/3] Build và khởi động lại frontend..." -ForegroundColor Cyan
$env:DOCKER_BUILDKIT = "1"
$env:COMPOSE_DOCKER_CLI_BUILD = "1"

docker compose --profile frontend up -d --build

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "       HOÀN TẤT REBUILD FRONTEND           " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend URL: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Trạng thái container:" -ForegroundColor Cyan
docker compose --profile frontend ps
