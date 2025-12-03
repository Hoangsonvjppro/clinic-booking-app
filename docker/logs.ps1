# ==============================================================================
# LOGS - Xem logs của một service hoặc tất cả
# Usage: .\logs.ps1                    # Xem logs tất cả
#        .\logs.ps1 -Service auth      # Xem logs auth service
#        .\logs.ps1 -Service doctor    # Xem logs doctor service
#        .\logs.ps1 -Follow            # Xem logs realtime
# ==============================================================================

param(
    [ValidateSet("all", "auth", "doctor", "patient", "appointment", "payment", "notification", "gateway", "frontend", "databases")]
    [string]$Service = "all",
    [switch]$Follow,
    [int]$Tail = 100
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$serviceMap = @{
    "auth" = "auth-service"
    "doctor" = "doctor-service"
    "patient" = "patient-service"
    "appointment" = "appointment-service"
    "payment" = "payment-service"
    "notification" = "notification-service"
    "gateway" = "api-gateway"
    "frontend" = "frontend-web"
}

$followFlag = if ($Follow) { "-f" } else { "" }

if ($Service -eq "all") {
    Write-Host "Logs của tất cả services (tail=$Tail):" -ForegroundColor Cyan
    docker compose --profile gateway --profile services --profile databases --profile frontend --profile monitoring logs --tail $Tail $followFlag
}
elseif ($Service -eq "databases") {
    Write-Host "Logs của databases (tail=$Tail):" -ForegroundColor Cyan
    docker compose --profile databases logs --tail $Tail $followFlag
}
else {
    $containerName = $serviceMap[$Service]
    Write-Host "Logs của $Service (tail=$Tail):" -ForegroundColor Cyan
    docker compose logs --tail $Tail $followFlag $containerName
}
