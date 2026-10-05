<#
.SYNOPSIS
  Demo 2 - Hosts demos/demo2-static-site/site as a static website on Azure Blob Storage.
.PARAMETER SourceFolder
  Folder to upload. Defaults to the demo site; you can point it to any HTML/React build folder.
.EXAMPLE
  .\scripts\02-demo2-static-site.ps1 -Initials yd
.EXAMPLE
  .\scripts\02-demo2-static-site.ps1 -SourceFolder C:\projects\landing\dist
#>
param(
    [string]$Initials,
    [string]$Location,
    [string]$SourceFolder
)
. "$PSScriptRoot\common.ps1"

Assert-Command az 'Install the Azure CLI.'
Assert-AzLogin
$cfg = Get-DemoConfig -Initials $Initials -Location $Location
if (-not $SourceFolder) { $SourceFolder = Join-Path $RepoRoot 'demos\demo2-static-site\site' }
if (-not (Test-Path (Join-Path $SourceFolder 'index.html'))) { throw "index.html not found in $SourceFolder" }

Initialize-ResourceGroup $cfg

Write-Step "Storage account '$($cfg.StaticStorage)'"
Invoke-Az storage account create `
    --name $cfg.StaticStorage `
    --resource-group $cfg.ResourceGroup `
    --location $cfg.Location `
    --sku Standard_LRS `
    --kind StorageV2 `
    --output none
Write-Ok 'Storage account ready'

Write-Step 'Enabling static website hosting (creates the $web container)'
$key = (Invoke-Az storage account keys list --account-name $cfg.StaticStorage --resource-group $cfg.ResourceGroup --query '[0].value' --output tsv | Out-String).Trim()
Invoke-Az storage blob service-properties update `
    --account-name $cfg.StaticStorage `
    --account-key $key `
    --static-website `
    --index-document index.html `
    --404-document 404.html `
    --output none

Write-Step "Uploading $SourceFolder"
# '$web' must stay in single quotes in PowerShell
Invoke-Az storage blob upload-batch `
    --account-name $cfg.StaticStorage `
    --account-key $key `
    --source $SourceFolder `
    --destination '$web' `
    --overwrite `
    --output none

$url = (Invoke-Az storage account show --name $cfg.StaticStorage --resource-group $cfg.ResourceGroup --query 'primaryEndpoints.web' --output tsv | Out-String).Trim()

Write-Host ""
Write-Host "Demo 2 ready: $url" -ForegroundColor Green
Write-Host "Try a missing page to see the custom 404: $($url)does-not-exist" -ForegroundColor DarkGray
Start-Process $url
