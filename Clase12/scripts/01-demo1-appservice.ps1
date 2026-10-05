<#
.SYNOPSIS
  Demo 1 - Deploys the Express app in demos/demo1-appservice to Azure App Service (PaaS).
.PARAMETER Initials
  Your initials, used to build unique resource names (only needed the first time).
.PARAMETER Location
  Azure region. Azure for Students may block some regions; try centralus or westus2 if eastus2 fails.
.PARAMETER Sku
  App Service plan SKU. F1 is free (limited per region); use B1 if F1 is not available.
.PARAMETER RunLocalFirst
  Runs npm install and starts the app locally on http://localhost:3000 before deploying.
.EXAMPLE
  .\scripts\01-demo1-appservice.ps1 -Initials yd
.EXAMPLE
  .\scripts\01-demo1-appservice.ps1 -Initials yd -Location centralus -Sku B1
#>
param(
    [string]$Initials,
    [string]$Location,
    [ValidateSet('F1', 'B1')][string]$Sku = 'F1',
    [switch]$RunLocalFirst
)
. "$PSScriptRoot\common.ps1"

Assert-Command az 'Install the Azure CLI.'
Assert-AzLogin
$cfg = Get-DemoConfig -Initials $Initials -Location $Location
$appFolder = Join-Path $RepoRoot 'demos\demo1-appservice'

if ($RunLocalFirst) {
    Assert-Command npm 'Install Node.js 22.'
    Write-Step 'Running locally first (Ctrl+C to stop and continue with the deploy)'
    Push-Location $appFolder
    try {
        npm install --no-audit --no-fund
        Write-Ok 'Open http://localhost:3000'
        npm start
    } finally { Pop-Location }
}

Initialize-ResourceGroup $cfg

Write-Step "Deploying '$($cfg.WebAppName)' with az webapp up (plan $Sku, Node 22)"
Write-Host '    az webapp up creates the plan + web app, zips the folder and builds it in Azure.' -ForegroundColor DarkGray
Push-Location $appFolder
try {
    Invoke-Az webapp up `
        --name $cfg.WebAppName `
        --resource-group $cfg.ResourceGroup `
        --plan "plan-webclass-$($cfg.Initials)" `
        --runtime 'NODE:22-lts' `
        --sku $Sku `
        --location $cfg.Location `
        --output none
} finally { Pop-Location }

$hostName = (Invoke-Az webapp show --name $cfg.WebAppName --resource-group $cfg.ResourceGroup --query defaultHostName --output tsv | Out-String).Trim()
$url = "https://$hostName"

Write-Step 'Waiting for the app to answer (first start can take ~1 minute)'
$ok = $false
for ($i = 1; $i -le 12 -and -not $ok; $i++) {
    try {
        $health = Invoke-RestMethod -Uri "$url/api/health" -TimeoutSec 20
        $ok = $true
        Write-Ok ($health | ConvertTo-Json -Compress)
    } catch { Start-Sleep -Seconds 10 }
}
if (-not $ok) { Write-Warning 'The app is not answering yet. Check: Portal > App Service > Log stream' }

Write-Host ""
Write-Host "Demo 1 ready: $url" -ForegroundColor Green
Write-Host 'Show in the portal: Configuration (PORT / env vars), Log stream, Scale up / Scale out.' -ForegroundColor DarkGray
Start-Process $url
