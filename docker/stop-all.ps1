# ==============================================================================
# STOP ALL - Dừng tất cả containers
# ==============================================================================

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "          DỪNG TẤT CẢ SERVICES             " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

docker compose --profile gateway --profile services --profile databases --profile frontend --profile monitoring stop

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "       ĐÃ DỪNG TẤT CẢ SERVICES             " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
