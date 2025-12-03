# ==============================================================================
# STATUS - Xem trạng thái tất cả containers
# ==============================================================================

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "       TRẠNG THÁI HỆ THỐNG                  " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Containers đang chạy:" -ForegroundColor Yellow
Write-Host ""
docker compose --profile gateway --profile services --profile databases --profile frontend --profile monitoring ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "          SERVICE URLs                      " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend:      http://localhost:5173" -ForegroundColor White
Write-Host "  API Gateway:   http://localhost:8080" -ForegroundColor White
Write-Host "  Auth:          http://localhost:8081" -ForegroundColor White
Write-Host "  Doctor:        http://localhost:8082" -ForegroundColor White
Write-Host "  Patient:       http://localhost:8083" -ForegroundColor White
Write-Host "  Appointment:   http://localhost:8084" -ForegroundColor White
Write-Host "  Payment:       http://localhost:8085" -ForegroundColor White
Write-Host "  Notification:  http://localhost:8086" -ForegroundColor White
Write-Host ""
Write-Host "  Prometheus:    http://localhost:9091" -ForegroundColor Gray
Write-Host "  Grafana:       http://localhost:3001" -ForegroundColor Gray
Write-Host ""

# Kiểm tra health của các services
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "         HEALTH CHECK                       " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$services = @(
    @{ name = "Auth Service"; url = "http://localhost:8081/actuator/health" },
    @{ name = "Doctor Service"; url = "http://localhost:8082/actuator/health" },
    @{ name = "Patient Service"; url = "http://localhost:8083/actuator/health" },
    @{ name = "Appointment Service"; url = "http://localhost:8084/actuator/health" },
    @{ name = "Payment Service"; url = "http://localhost:8085/actuator/health" },
    @{ name = "Notification Service"; url = "http://localhost:8086/actuator/health" }
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri $service.url -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ $($service.name)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $($service.name) - Status: $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ✗ $($service.name) - Không thể kết nối" -ForegroundColor Red
    }
}

Write-Host ""
