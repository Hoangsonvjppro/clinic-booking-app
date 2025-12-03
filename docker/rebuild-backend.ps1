# ==============================================================================
# REBUILD ALL BACKEND SERVICES - Build và run lại tất cả microservices
# Giữ nguyên databases
# ==============================================================================

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "    REBUILD ALL BACKEND SERVICES            " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra databases đang chạy
$dbRunning = docker compose --profile databases ps --format "{{.State}}" 2>$null | Where-Object { $_ -eq "running" }
if (-not $dbRunning) {
    Write-Host "[INFO] Databases chưa chạy, khởi động databases..." -ForegroundColor Yellow
    docker compose --profile databases up -d
    Write-Host "  Đợi databases khởi động (20 giây)..." -ForegroundColor Gray
    Start-Sleep -Seconds 20
}

Write-Host ""
Write-Host "[1/3] Dừng các backend services hiện tại..." -ForegroundColor Cyan
docker compose --profile services --profile gateway stop

Write-Host ""
Write-Host "[2/3] Xóa containers của backend services..." -ForegroundColor Cyan
docker compose --profile services --profile gateway rm -f

Write-Host ""
Write-Host "[3/3] Build và khởi động lại backend services..." -ForegroundColor Cyan
$env:DOCKER_BUILDKIT = "1"
$env:COMPOSE_DOCKER_CLI_BUILD = "1"

docker compose --profile services --profile gateway up -d --build

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "    HOÀN TẤT REBUILD BACKEND SERVICES       " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend Services:" -ForegroundColor Cyan
Write-Host "  - API Gateway:      http://localhost:8080" -ForegroundColor White
Write-Host "  - Auth Service:     http://localhost:8081" -ForegroundColor White
Write-Host "  - Doctor Service:   http://localhost:8082" -ForegroundColor White
Write-Host "  - Patient Service:  http://localhost:8083" -ForegroundColor White
Write-Host "  - Appointment:      http://localhost:8084" -ForegroundColor White
Write-Host "  - Payment Service:  http://localhost:8085" -ForegroundColor White
Write-Host "  - Notification:     http://localhost:8086" -ForegroundColor White
Write-Host ""
Write-Host "Trạng thái containers:" -ForegroundColor Cyan
docker compose --profile services --profile gateway ps
