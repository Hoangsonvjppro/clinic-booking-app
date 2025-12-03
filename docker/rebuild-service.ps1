# ==============================================================================
# REBUILD SERVICE - Build và run lại một service cụ thể
# Usage: .\rebuild-service.ps1 -Service auth
#        .\rebuild-service.ps1 -Service doctor
#        .\rebuild-service.ps1 -Service patient
#        .\rebuild-service.ps1 -Service appointment
#        .\rebuild-service.ps1 -Service payment
#        .\rebuild-service.ps1 -Service notification
#        .\rebuild-service.ps1 -Service gateway
# ==============================================================================

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("auth", "doctor", "patient", "appointment", "payment", "notification", "gateway")]
    [string]$Service
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# Mapping service name to container name and port
$serviceMap = @{
    "auth" = @{ container = "Auth"; serviceName = "auth-service"; port = 8081; db = "postgres-auth" }
    "doctor" = @{ container = "Doctor"; serviceName = "doctor-service"; port = 8082; db = "postgres-doctor" }
    "patient" = @{ container = "Patient"; serviceName = "patient-service"; port = 8083; db = "postgres-patient" }
    "appointment" = @{ container = "Appointment"; serviceName = "appointment-service"; port = 8084; db = "postgres-appointment" }
    "payment" = @{ container = "Payment"; serviceName = "payment-service"; port = 8085; db = "postgres-payment" }
    "notification" = @{ container = "Notification"; serviceName = "notification-service"; port = 8086; db = "postgres-notification" }
    "gateway" = @{ container = "api-gateway"; serviceName = "api-gateway"; port = 8080; db = $null }
}

$info = $serviceMap[$Service]

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "    REBUILD SERVICE: $($Service.ToUpper())" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra database liên quan
if ($info.db) {
    $dbStatus = docker ps --filter "name=$($info.db)" --format "{{.Status}}" 2>$null
    if (-not $dbStatus) {
        Write-Host "[WARN] Database $($info.db) chưa chạy, khởi động..." -ForegroundColor Yellow
        docker compose --profile databases up -d $info.db
        Write-Host "  Đợi database khởi động (15 giây)..." -ForegroundColor Gray
        Start-Sleep -Seconds 15
    }
}

Write-Host ""
Write-Host "[1/3] Dừng service $Service..." -ForegroundColor Cyan
docker compose stop $info.serviceName 2>$null

Write-Host ""
Write-Host "[2/3] Xóa container cũ..." -ForegroundColor Cyan
docker compose rm -f $info.serviceName 2>$null

Write-Host ""
Write-Host "[3/3] Build và khởi động lại $Service..." -ForegroundColor Cyan
$env:DOCKER_BUILDKIT = "1"
$env:COMPOSE_DOCKER_CLI_BUILD = "1"

if ($Service -eq "gateway") {
    docker compose --profile gateway up -d --build $info.serviceName
} else {
    docker compose --profile services up -d --build $info.serviceName
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "    HOÀN TẤT REBUILD: $($Service.ToUpper())" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service URL: http://localhost:$($info.port)" -ForegroundColor White
Write-Host ""
Write-Host "Trạng thái container:" -ForegroundColor Cyan
docker ps --filter "name=$($info.container)" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
