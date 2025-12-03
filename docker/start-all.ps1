# ==============================================================================
# START ALL - Khởi động toàn bộ hệ thống
# ==============================================================================

Set-Location $PSScriptRoot

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "       KHỞI ĐỘNG TOÀN BỘ HỆ THỐNG          " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Thiết lập BuildKit
$env:DOCKER_BUILDKIT = "1"
$env:COMPOSE_DOCKER_CLI_BUILD = "1"

# Bước 1: Khởi động databases trước
Write-Host "[1/3] Khởi động databases..." -ForegroundColor Cyan
docker compose --profile databases up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "Lỗi khi khởi động databases!" -ForegroundColor Red
    exit 1
}

# Bước 2: Đợi databases healthy
Write-Host "[2/3] Đợi databases sẵn sàng (30 giây)..." -ForegroundColor Gray
Start-Sleep -Seconds 30

# Bước 3: Khởi động tất cả services (bao gồm cả redis trong profile gateway)
Write-Host "[3/3] Khởi động gateway, services, frontend, monitoring..." -ForegroundColor Cyan
docker compose --profile databases --profile gateway --profile services --profile frontend --profile monitoring up -d --build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Lỗi khi khởi động services!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "       HỆ THỐNG ĐÃ KHỞI ĐỘNG               " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "  Frontend:      http://localhost:5173" -ForegroundColor White
Write-Host "  API Gateway:   http://localhost:8080" -ForegroundColor White
Write-Host "  Auth:          http://localhost:8081" -ForegroundColor White
Write-Host "  Doctor:        http://localhost:8082" -ForegroundColor White
Write-Host "  Patient:       http://localhost:8083" -ForegroundColor White
Write-Host "  Appointment:   http://localhost:8084" -ForegroundColor White
Write-Host "  Payment:       http://localhost:8085" -ForegroundColor White
Write-Host "  Notification:  http://localhost:8086" -ForegroundColor White
Write-Host ""
Write-Host "Trạng thái containers:" -ForegroundColor Cyan
docker compose --profile gateway --profile services --profile databases --profile frontend --profile monitoring ps