# Build Script for Freeter (Windows .exe)
# Usage: .\scripts\build-win.ps1

$ErrorActionPreference = "Continue"
$host.PrivateData.ErrorForegroundColor = 'Yellow'

function Stop-If-Error {
    param([string]$Message)
    if ($LASTEXITCODE -ne 0) {
        Write-Host "      ERROR: $Message" -ForegroundColor Red
        exit 1
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Freeter Windows Build Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Join-Path $PSScriptRoot ".."
$distPath = Join-Path $projectRoot "dist"

# 1. Kill any running Electron instances
Write-Host "[1/5] Killing running Electron processes..." -ForegroundColor Yellow
cmd /c "taskkill /f /im electron.exe /t 2>nul"
Start-Sleep -Seconds 3
$procs = Get-Process electron -ErrorAction SilentlyContinue
if ($procs) {
    $procs | Stop-Process -Force
    Start-Sleep -Seconds 3
    Write-Host "      Killed $($procs.Count) process(es)." -ForegroundColor Green
} else {
    Write-Host "      No running Electron processes found." -ForegroundColor Green
}

# 2. Clean build and dist directories
Write-Host "[2/5] Cleaning build/ and dist/ directories..." -ForegroundColor Yellow
$buildPath = Join-Path $projectRoot "build"
if (Test-Path $buildPath) {
    Remove-Item -Recurse -Force $buildPath
}
if (Test-Path $distPath) {
    Remove-Item -Recurse -Force $distPath
}
# Retry if dist is still locked
$retry = 0
while ((Test-Path $distPath) -and ($retry -lt 5)) {
    Start-Sleep -Seconds 2
    Remove-Item -Recurse -Force $distPath -ErrorAction SilentlyContinue
    $retry++
}
Write-Host "      Done." -ForegroundColor Green

# 3. Compile production build
Write-Host "[3/5] Compiling production build (renderer + main + preload)..." -ForegroundColor Yellow
npm run prod
Stop-If-Error "Build failed!"
Write-Host "      Done." -ForegroundColor Green

# 4. Package with electron-builder
Write-Host "[4/5] Packaging with electron-builder..." -ForegroundColor Yellow
npm run package
Stop-If-Error "Packaging failed!"
Write-Host "      Done." -ForegroundColor Green

# 5. Show output
Write-Host "[5/5] Build complete! Output files:" -ForegroundColor Green
Get-ChildItem -Path $distPath -Filter "Freeter*" | ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    Write-Host "      $($_.Name) ($sizeMB MB)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "To run unpacked: .\dist\win-unpacked\Freeter.exe" -ForegroundColor Cyan
