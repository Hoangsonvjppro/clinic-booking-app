# ==============================================================================
# RESET ALL - Xóa tất cả containers, images, volumes và rebuild từ đầu
# CẢNH BÁO: Script này sẽ xóa TẤT CẢ dữ liệu bao gồm cả databases!
# ==============================================================================

param(
    [switch]$Force,
    [switch]$SkipConfirm
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "============================================" -ForegroundColor Red
Write-Host "       FULL RESET - XÓA TẤT CẢ DỮ LIỆU      " -ForegroundColor Red
Write-Host "============================================" -ForegroundColor Red
Write-Host ""
Write-Host "Script này sẽ:" -ForegroundColor Yellow
Write-Host "  - Dừng và xóa tất cả containers" -ForegroundColor Yellow
Write-Host "  - Xóa tất cả volumes (DATABASE SẼ BỊ XÓA!)" -ForegroundColor Yellow
Write-Host "  - Xóa tất cả images đã build" -ForegroundColor Yellow
Write-Host "  - Build và khởi chạy lại toàn bộ hệ thống" -ForegroundColor Yellow
Write-Host ""

if (-not $SkipConfirm) {
    $confirm = Read-Host "Bạn có chắc chắn muốn tiếp tục? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Host "Đã hủy thao tác." -ForegroundColor Green
        exit 0
    }
}

Write-Host ""
Write-Host "[1/5] Dừng và xóa tất cả containers..." -ForegroundColor Cyan
docker compose --profile gateway --profile services --profile databases --profile frontend --profile monitoring down -v --remove-orphans

Write-Host ""
Write-Host "[2/5] Xóa các images đã build..." -ForegroundColor Cyan
$images = @(
    "docker-api-gateway",
    "docker-auth-service",
    "docker-doctor-service", 
    "docker-patient-service",
    "docker-appointment-service",
    "docker-payment-service",
    "docker-notification-service",
    "docker-frontend-web"
)

foreach ($image in $images) {
    $existingImage = docker images -q $image 2>$null
    if ($existingImage) {
        Write-Host "  Xóa image: $image" -ForegroundColor Gray
        docker rmi $image -f 2>$null
    }
}

Write-Host ""
Write-Host "[3/5] Dọn dẹp Docker system..." -ForegroundColor Cyan
docker system prune -f

Write-Host ""
Write-Host "[4/5] Building lại tất cả services..." -ForegroundColor Cyan
$env:DOCKER_BUILDKIT = "1"
$env:COMPOSE_DOCKER_CLI_BUILD = "1"

Write-Host ""
Write-Host "[5/5] Khởi động tất cả services..." -ForegroundColor Cyan

# Khởi động databases trước
docker compose --profile databases up -d

Write-Host "  Đợi databases khởi động và healthy (35 giây)..." -ForegroundColor Gray
Start-Sleep -Seconds 35

# Khởi động redis
docker compose --profile gateway up -d redis 2>$null
Start-Sleep -Seconds 5

# Khởi động các services còn lại
docker compose --profile databases --profile gateway --profile services --profile frontend --profile monitoring up -d --build

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "       HOÀN TẤT RESET VÀ KHỞI ĐỘNG         " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Trạng thái containers:" -ForegroundColor Cyan
docker compose --profile gateway --profile services --profile databases --profile frontend --profile monitoring ps
