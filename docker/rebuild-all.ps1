# ==============================================================================
# REBUILD ALL - Build và run lại toàn bộ hệ thống NHƯNG GIỮ NGUYÊN DATABASE
# Không xóa volumes, chỉ rebuild và restart services
# ==============================================================================

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "    REBUILD ALL (GIỮ NGUYÊN DATABASE)       " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Script này sẽ:" -ForegroundColor Yellow
Write-Host "  - Dừng tất cả services (trừ databases)" -ForegroundColor Yellow
Write-Host "  - Build lại tất cả services" -ForegroundColor Yellow
Write-Host "  - Khởi động lại toàn bộ hệ thống" -ForegroundColor Yellow
Write-Host "  - GIỮ NGUYÊN dữ liệu databases" -ForegroundColor Green
Write-Host ""

$env:DOCKER_BUILDKIT = "1"
$env:COMPOSE_DOCKER_CLI_BUILD = "1"

Write-Host "[1/6] Kiểm tra và khởi động databases..." -ForegroundColor Cyan
docker compose --profile databases up -d

Write-Host ""
Write-Host "[2/6] Đợi databases healthy (25 giây)..." -ForegroundColor Gray
Start-Sleep -Seconds 25

Write-Host ""
Write-Host "[3/6] Dừng các services (giữ databases chạy)..." -ForegroundColor Cyan
docker compose --profile gateway --profile services --profile frontend --profile monitoring stop 2>$null

Write-Host ""
Write-Host "[4/6] Xóa containers cũ (không xóa volumes)..." -ForegroundColor Cyan
docker compose --profile gateway --profile services --profile frontend --profile monitoring rm -f 2>$null

Write-Host ""
Write-Host "[5/6] Khởi động redis..." -ForegroundColor Cyan
docker compose --profile gateway up -d redis 2>$null
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "[6/6] Build và khởi động lại tất cả services..." -ForegroundColor Cyan
docker compose --profile gateway --profile services --profile frontend --profile monitoring up -d --build

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "       HOÀN TẤT REBUILD HỆ THỐNG           " -ForegroundColor Green
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
Write-Host "  Prometheus:    http://localhost:9091" -ForegroundColor White
Write-Host "  Grafana:       http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Trạng thái containers:" -ForegroundColor Cyan
docker compose --profile gateway --profile services --profile databases --profile frontend --profile monitoring ps
