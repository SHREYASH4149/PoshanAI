# PoshanAI — PowerShell Setup Script for Windows
# Run: .\setup.ps1

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "   PoshanAI Setup Script (Windows)       " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Setup Client
Write-Host ""
Write-Host "Setting up Client..." -ForegroundColor Cyan
Set-Location .\client

if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created client\.env (fill in Firebase credentials)" -ForegroundColor Yellow
}

Write-Host "Installing client dependencies..." -ForegroundColor White
npm install

# Setup Server
Write-Host ""
Write-Host "Setting up Server..." -ForegroundColor Cyan
Set-Location ..\server

if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created server\.env (fill in OpenAI key if needed)" -ForegroundColor Yellow
}

Write-Host "Installing server dependencies..." -ForegroundColor White
npm install

Set-Location ..

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Edit client\.env with Firebase credentials" -ForegroundColor Yellow
Write-Host "  2. Start client:  cd client && npm run dev" -ForegroundColor Yellow
Write-Host "  3. Start server:  cd server && npm run dev" -ForegroundColor Yellow
Write-Host "  4. Open:          http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
