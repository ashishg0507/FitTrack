# PowerShell script to install self-signed certificate to Windows Trusted Root Certificate Authorities
# This will make the certificate trusted, removing the browser warning

$ErrorActionPreference = "Stop"

$certDir = Join-Path $PSScriptRoot "ssl"
$certPath = Join-Path $certDir "cert.pem"

Write-Host "Installing SSL certificate to Windows Trusted Root Certificate Authorities..." -ForegroundColor Cyan
Write-Host ""

# Check if certificate exists
if (-not (Test-Path $certPath)) {
    Write-Host "❌ Certificate not found at: $certPath" -ForegroundColor Red
    Write-Host "Please run 'npm run generate-cert' first to generate the certificate." -ForegroundColor Yellow
    exit 1
}

try {
    # Import the certificate to the Trusted Root Certificate Authorities store
    # This requires administrator privileges
    $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($certPath)
    $store = New-Object System.Security.Cryptography.X509Certificates.X509Store([System.Security.Cryptography.X509Certificates.StoreName]::Root, [System.Security.Cryptography.X509Certificates.StoreLocation]::LocalMachine)
    
    Write-Host "Opening certificate store..." -ForegroundColor Yellow
    $store.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)
    
    Write-Host "Adding certificate to Trusted Root Certificate Authorities..." -ForegroundColor Yellow
    $store.Add($cert)
    
    $store.Close()
    
    Write-Host ""
    Write-Host "✅ Certificate installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "The certificate is now trusted by Windows and your browsers." -ForegroundColor Cyan
    Write-Host "You may need to:" -ForegroundColor Yellow
    Write-Host "  1. Restart your browser" -ForegroundColor Yellow
    Write-Host "  2. Clear browser cache if the warning persists" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Certificate Details:" -ForegroundColor Cyan
    Write-Host "  Subject: $($cert.Subject)" -ForegroundColor White
    Write-Host "  Issuer: $($cert.Issuer)" -ForegroundColor White
    Write-Host "  Valid Until: $($cert.NotAfter)" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "❌ Error installing certificate: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "This script requires Administrator privileges." -ForegroundColor Yellow
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To run as Administrator:" -ForegroundColor Cyan
    Write-Host "  1. Right-click PowerShell" -ForegroundColor White
    Write-Host "  2. Select 'Run as Administrator'" -ForegroundColor White
    Write-Host "  3. Navigate to the project directory" -ForegroundColor White
    Write-Host "  4. Run: .\server\install-cert.ps1" -ForegroundColor White
    exit 1
}

