<#
.SYNOPSIS
  Tests the Quotes API (local or deployed) and runs the statelessness experiment of the lab.
.PARAMETER Local
  Tests http://localhost:7071 instead of the deployed Function App.
.PARAMETER Requests
  How many GET ?all=1 calls to make when checking whether added quotes persist.
.EXAMPLE
  .\scripts\05-test-quotes-api.ps1 -Local
.EXAMPLE
  .\scripts\05-test-quotes-api.ps1 -Requests 30
#>
param(
    [switch]$Local,
    [int]$Requests = 20
)
. "$PSScriptRoot\common.ps1"

if ($Local) {
    $apiBase = 'http://localhost:7071/api'
} else {
    $cfg = Get-DemoConfig
    $hostName = (Invoke-Az functionapp show --name $cfg.FunctionApp --resource-group $cfg.ResourceGroup --query defaultHostName --output tsv | Out-String).Trim()
    $apiBase = "https://$hostName/api"
}
Write-Ok "API: $apiBase"

Write-Step 'GET /hello'
Invoke-RestMethod "$apiBase/hello?name=Coban" | Format-List

Write-Step 'GET /quotes (random)'
Invoke-RestMethod "$apiBase/quotes" | Format-List

Write-Step 'POST /quotes with a valid body (expect 201)'
$body = @{ text = 'Talk is cheap. Show me the code.'; author = 'Linus Torvalds' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$apiBase/quotes" -ContentType 'application/json' -Body $body | ConvertTo-Json -Compress

Write-Step 'POST /quotes with an invalid body (expect 400)'
try {
    Invoke-RestMethod -Method Post -Uri "$apiBase/quotes" -ContentType 'application/json' -Body '{"text":""}'
    Write-Warning 'Expected a 400 but the request succeeded. Check your validation.'
} catch {
    Write-Ok "Got $([int]$_.Exception.Response.StatusCode) as expected"
}

Write-Step "Statelessness experiment: $Requests x GET /quotes?all=1"
$totals = @()
for ($i = 1; $i -le $Requests; $i++) {
    $totals += (Invoke-RestMethod "$apiBase/quotes?all=1").total
}
Write-Host "    Totals seen: $($totals -join ', ')"
$distinct = $totals | Sort-Object -Unique
if (@($distinct).Count -gt 1) {
    Write-Host '    Different totals -> requests hit different instances, each with its own memory!' -ForegroundColor Yellow
} else {
    Write-Host '    Same total every time (probably one instance). Wait a few idle minutes and run again:' -ForegroundColor Yellow
    Write-Host '    when the instance is recycled, the added quotes disappear.' -ForegroundColor Yellow
}
Write-Host ''
Write-Host 'Discussion: where should this data live? (Table Storage, Cosmos DB, Azure SQL...)' -ForegroundColor Cyan
