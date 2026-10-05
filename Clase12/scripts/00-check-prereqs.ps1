<#
.SYNOPSIS
  Checks the tools needed for the class: Node.js, npm, Azure CLI, Functions Core Tools.
.EXAMPLE
  .\scripts\00-check-prereqs.ps1
#>
. "$PSScriptRoot\common.ps1"
$ErrorActionPreference = 'Continue'

$checks = @(
    @{ Name = 'node'; Args = '--version'; Hint = 'Install Node.js 22 LTS: https://nodejs.org' },
    @{ Name = 'npm';  Args = '--version'; Hint = 'Comes with Node.js' },
    @{ Name = 'az';   Args = '--version'; Hint = 'winget install -e --id Microsoft.AzureCLI' },
    @{ Name = 'func'; Args = '--version'; Hint = 'npm install -g azure-functions-core-tools@4 --unsafe-perm true  (or: winget install Microsoft.Azure.FunctionsCoreTools)' }
)

$allOk = $true
Write-Step 'Checking prerequisites'
foreach ($c in $checks) {
    if (Get-Command $c.Name -ErrorAction SilentlyContinue) {
        $version = Invoke-Expression "$($c.Name) $($c.Args)" 2>$null | Select-Object -First 1
        Write-Ok ("{0,-5} {1}" -f $c.Name, $version)
    } else {
        $allOk = $false
        Write-Host ("    {0,-5} NOT FOUND -> {1}" -f $c.Name, $c.Hint) -ForegroundColor Red
    }
}

if (Get-Command node -ErrorAction SilentlyContinue) {
    $major = [int]((node --version).TrimStart('v').Split('.')[0])
    if ($major -lt 22) { Write-Warning "Node.js $major detected. The demos target Node.js 22." }
}

if (Get-Command func -ErrorAction SilentlyContinue) {
    if (-not ((func --version) -like '4.*')) { Write-Warning 'Azure Functions Core Tools v4 is required.' }
}

if (Get-Command az -ErrorAction SilentlyContinue) {
    & az account show --output none 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "Azure login OK: $(az account show --query name -o tsv)"
    } else {
        Write-Host '    Not logged in to Azure -> run: az login' -ForegroundColor Yellow
    }
}

if ($allOk) { Write-Host "`nAll set. Start with .\scripts\01-demo1-appservice.ps1 -Initials <yours>" -ForegroundColor Green }
else { Write-Host "`nInstall the missing tools, open a NEW terminal and run this script again." -ForegroundColor Yellow }
