# Shared helpers for the demo scripts. Dot-source it: . "$PSScriptRoot\common.ps1"
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$script:RepoRoot  = Split-Path -Parent $PSScriptRoot
$script:StateFile = Join-Path $PSScriptRoot '.state.json'

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Ok {
    param([string]$Message)
    Write-Host "    $Message" -ForegroundColor Green
}

# Runs the Azure CLI, echoes the command (useful when projecting) and stops on failure.
# Usage: Invoke-Az group create --name rg-webclass --location eastus2
function Invoke-Az {
    Write-Host "    az $($args -join ' ')" -ForegroundColor DarkGray
    $output = & az @args
    if ($LASTEXITCODE -ne 0) {
        throw "Azure CLI command failed (exit code $LASTEXITCODE): az $($args -join ' ')"
    }
    return $output
}

function Assert-Command {
    param([string]$Name, [string]$InstallHint)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "'$Name' was not found. $InstallHint"
    }
}

function Assert-AzLogin {
    & az account show --output none 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Step 'You are not logged in to Azure. Opening az login...'
        & az login --output none
        if ($LASTEXITCODE -ne 0) { throw 'az login failed.' }
    }
    $sub = (& az account show --query name --output tsv)
    Write-Ok "Using subscription: $sub"
}

# Returns the names for every resource. Created on the first run and saved in
# scripts/.state.json so all scripts (and the cleanup) use the same names.
function Get-DemoConfig {
    param([string]$Initials, [string]$Location)

    if (Test-Path $script:StateFile) {
        $cfg = Get-Content $script:StateFile -Raw | ConvertFrom-Json
        if ($Location -and $Location -ne $cfg.Location) {
            # Lets you retry in another region (e.g. no quota in the saved one) without cleaning up.
            Write-Warning "Changing saved location '$($cfg.Location)' -> '$Location'."
            $cfg.Location = $Location
            $cfg | ConvertTo-Json | Set-Content -Path $script:StateFile -Encoding UTF8
        }
        return $cfg
    }

    if (-not $Initials) {
        throw 'First run: pass your initials, e.g.  .\01-demo1-appservice.ps1 -Initials yd'
    }
    if (-not $Location) { $Location = 'eastus2' }

    $i = ($Initials -replace '[^a-zA-Z0-9]', '').ToLower()
    if ($i.Length -gt 6) { $i = $i.Substring(0, 6) }
    if ($i.Length -eq 0) { throw 'Initials must contain letters or digits.' }
    $suffix = Get-Random -Minimum 1000 -Maximum 9999

    $cfg = [pscustomobject]@{
        ResourceGroup = 'rg-webclass'
        Location      = $Location
        Initials      = $i
        Suffix        = $suffix
        WebAppName    = "app-webclass-$i-$suffix"
        StaticStorage = "stweb$i$suffix"      # storage names: 3-24 chars, lowercase letters and digits
        FuncStorage   = "stfunc$i$suffix"
        FunctionApp   = "func-webclass-$i-$suffix"
    }
    $cfg | ConvertTo-Json | Set-Content -Path $script:StateFile -Encoding UTF8
    Write-Ok "Saved resource names to $script:StateFile"
    return $cfg
}

function Initialize-ResourceGroup {
    param($Cfg)
    $existing = (& az group show --name $Cfg.ResourceGroup --query location --output tsv 2>$null)
    if ($LASTEXITCODE -eq 0 -and $existing) {
        # A resource group can hold resources from other regions, so it is reused as is.
        Write-Step "Resource group '$($Cfg.ResourceGroup)' already exists in '$existing' (resources go to '$($Cfg.Location)')"
        return
    }
    Write-Step "Resource group '$($Cfg.ResourceGroup)' in '$($Cfg.Location)'"
    Invoke-Az group create --name $Cfg.ResourceGroup --location $Cfg.Location --output none
    Write-Ok 'Resource group ready'
}
