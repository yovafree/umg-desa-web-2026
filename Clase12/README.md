# Web Architectures, Cloud Services & Serverless — Azure demos

Companion repository for the Web Development class. It contains the slides for Gamma, the diagrams in Mermaid and PowerShell scripts that run every demo on Azure.

## Repository structure

```
webclass-azure-demos/
├── diagrams/
│   └── instructor-guide-demos-diagrams.md                  # Diagrams for Web Architectures
├── demos/
│   ├── demo1-appservice/          # Express app -> Azure App Service
│   ├── demo2-static-site/site/    # Static site -> Blob Storage static website
│   └── demo3-functions/
│       ├── api/                   # Azure Functions (Node.js v4): hello + quotes
│       │   └── bonus/             # Timer trigger for the lab bonus
│       └── frontend/              # index.html that consumes the API with fetch()
└── scripts/                       # PowerShell automation (see below)
```

## Prerequisites

- Windows PowerShell 5.1 or PowerShell 7+
- [Node.js 22 LTS](https://nodejs.org)
- Azure CLI: `winget install -e --id Microsoft.AzureCLI`
- Azure Functions Core Tools v4: `npm install -g azure-functions-core-tools@4 --unsafe-perm true`
- An Azure subscription (Azure for Students works)

If PowerShell blocks the scripts, allow them for the current session only:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## Running the class

Run everything from the repository root.

| Step | Command | What it does |
|---|---|---|
| 0 | `.\scripts\00-check-prereqs.ps1` | Checks Node, npm, Azure CLI, Core Tools and Azure login |
| 1 | `.\scripts\01-demo1-appservice.ps1 -Initials yd` | Deploys the Express app to App Service and opens it |
| 2 | `.\scripts\02-demo2-static-site.ps1` | Publishes the static site on Blob Storage and opens it |
| 3 | `.\scripts\03-demo3-functions-local.ps1` | Runs the Functions locally on http://localhost:7071 |
| 4 | `.\scripts\04-demo3-functions-deploy.ps1 -UploadFrontend` | Creates the Function App (Flex Consumption) and publishes the API |
| 5 | `.\scripts\05-test-quotes-api.ps1` | Tests the endpoints and runs the statelessness experiment |
| 99 | `.\scripts\99-cleanup.ps1` | Deletes the resource group and resets the local state |

`-Initials` is only needed on the first run. The scripts generate unique names (for example `app-webclass-yd-4821`) and save them in `scripts/.state.json`, so every script and the cleanup use the same resources.

### Useful options

```powershell
# Region blocked by the Azure for Students policy? Choose another one (first run only)
.\scripts\01-demo1-appservice.ps1 -Initials yd -Location centralus

# Free F1 plan not available? Use Basic
.\scripts\01-demo1-appservice.ps1 -Sku B1

# Run the Express app locally before deploying
.\scripts\01-demo1-appservice.ps1 -RunLocalFirst

# Upload your own static site or React build
.\scripts\02-demo2-static-site.ps1 -SourceFolder C:\projects\landing\dist

# Test the API running locally (with 03 running in another terminal)
.\scripts\05-test-quotes-api.ps1 -Local
```

## Lab — Quotes API

`demos/demo3-functions/api/src/functions/quotes.js` is the reference solution. It keeps the quotes in memory on purpose: after deploying, run `05-test-quotes-api.ps1` and discuss why the added quotes do not persist (instances are ephemeral and do not share memory).

## Costs and cleanup

| Resource | Cost |
|---|---|
| App Service F1 | Free (B1 has a cost per hour) |
| Storage accounts | Cents per month |
| Function App (Flex Consumption) | Monthly free grant; class usage stays within it |

Always finish with:

```powershell
.\scripts\99-cleanup.ps1
```

## Troubleshooting

| Problem | Fix |
|---|---|
| `RequestDisallowedByAzure` | Region blocked by policy: run `99-cleanup.ps1`, then use `-Location centralus` or `westus2` |
| `The name ... is already taken` | Run `99-cleanup.ps1` to generate a new suffix |
| `--flexconsumption-location` not recognized | Update the CLI: `az upgrade` |
| `func` not found | Install Core Tools v4 and open a new terminal |
| 404 right after publishing the functions | Wait 1–2 minutes and try again |
| CORS error in the browser | Portal → Function App → API → CORS |
| Scripts blocked | `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` |
