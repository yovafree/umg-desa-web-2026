<#
.SYNOPSIS
  Demo 3 (part 1) - Runs the Quotes API Azure Functions project locally.
.DESCRIPTION
  Installs dependencies and starts the Functions host on http://localhost:7071.
  Endpoints:
    GET  http://localhost:7071/api/hello?name=Coban
    GET  http://localhost:7071/api/quotes
    POST http://localhost:7071/api/quotes
  Open demos/demo3-functions/frontend/index.html in the browser to test with fetch().
.EXAMPLE
  .\scripts\03-demo3-functions-local.ps1
#>
. "$PSScriptRoot\common.ps1"

Assert-Command npm  'Install Node.js 22.'
Assert-Command func 'Install Azure Functions Core Tools v4.'

$apiFolder = Join-Path $RepoRoot 'demos\demo3-functions\api'
$frontend  = Join-Path $RepoRoot 'demos\demo3-functions\frontend\config.js'

# Make sure the front end points to the local API
"// Overwritten by scripts/04-demo3-functions-deploy.ps1 with the public URL`nwindow.API_BASE = 'http://localhost:7071/api';" |
    Set-Content -Path $frontend -Encoding UTF8

Push-Location $apiFolder
try {
    Write-Step 'npm install'
    npm install --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw 'npm install failed' }

    Write-Step 'Starting the Functions host (Ctrl+C to stop)'
    Write-Ok 'GET  http://localhost:7071/api/hello?name=Coban'
    Write-Ok 'GET  http://localhost:7071/api/quotes'
    Write-Ok 'POST http://localhost:7071/api/quotes   -> run .\scripts\05-test-quotes-api.ps1 -Local in another terminal'
    func start --cors '*'
} finally { Pop-Location }
