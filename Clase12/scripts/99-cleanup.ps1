<#
.SYNOPSIS
  Deletes everything created by the demos (the whole resource group) and the local state file.
.PARAMETER Force
  Skips the confirmation prompt.
.EXAMPLE
  .\scripts\99-cleanup.ps1
#>
param([switch]$Force)
. "$PSScriptRoot\common.ps1"

$rg = 'rg-webclass'
if (Test-Path $StateFile) { $rg = (Get-Content $StateFile -Raw | ConvertFrom-Json).ResourceGroup }

& az group show --name $rg --output none 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Ok "Resource group '$rg' does not exist. Nothing to delete in Azure."
} else {
    Write-Step "Resources in '$rg':"
    & az resource list --resource-group $rg --query '[].{name:name, type:type}' --output table

    if (-not $Force) {
        $answer = Read-Host "`nDelete resource group '$rg' and ALL its resources? (y/N)"
        if ($answer -notin @('y', 'Y', 'yes')) { Write-Host 'Cancelled.'; return }
    }
    Invoke-Az group delete --name $rg --yes --no-wait
    Write-Ok 'Deletion started in the background (takes a few minutes).'
    Write-Host "    Check with: az group show --name $rg" -ForegroundColor DarkGray
}

if (Test-Path $StateFile) {
    Remove-Item $StateFile -Force
    Write-Ok 'Local state removed. Next run will generate new resource names.'
}
$cfgJs = Join-Path $RepoRoot 'demos\demo3-functions\frontend\config.js'
"// Overwritten by scripts/04-demo3-functions-deploy.ps1 with the public URL`nwindow.API_BASE = 'http://localhost:7071/api';" |
    Set-Content -Path $cfgJs -Encoding UTF8
