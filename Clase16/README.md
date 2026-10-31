# Clase 16 · CI/CD con GitHub Actions y despliegue en Render

Última clase del curso. Tomamos la demo **Parte B · Auth0** de la [Clase 15](../Clase15/demo-auth/README.md) (`02-auth0`) y la llevamos a producción:

- **CI** (integración continua): cada pull request compila, prueba y valida la API y el frontend.
- **CD** (despliegue continuo): cada push a `main` construye las imágenes Docker, las publica en GitHub Container Registry (GHCR) y las despliega en **Render**.
- **Health checks**: la API expone `/health/live` y `/health/ready`. Render los usa para decidir si una versión nueva recibe tráfico, y el pipeline espera a que la versión nueva esté sana.
- **Logs**: logs estructurados en JSON (API y Nginx) que se ven en la pestaña **Logs** de Render.

```text
 Pull request ──► CI ─────────────────────────────── ✔ / ✘ en el PR (no se despliega nada)
                  ├─ API: restore, build, tests (xUnit)
                  └─ Web: npm ci, lint, build

 Push a main ───► CI ──► publish ─────────────► deploy-api ──► deploy-web ──► smoke-tests
                          docker build + push    deploy hook     deploy hook    curl a producción
                          ghcr.io/…:<sha>        + espera        + espera       (200/401/CORS)
                                                 /health/ready   /health
                                                 == <sha>        == <sha>
```

## Contenido

```text
Clase16/
├── Auth.Auth0.Api/            # API .NET 10 (la de la Clase 15 + health checks, logs y CORS configurable)
│   ├── Health/                # Auth0HealthCheck (readiness) y HealthResponseWriter (JSON con versión)
│   ├── Dockerfile             # multi-stage: sdk -> aspnet (alpine), usuario no-root, HEALTHCHECK
│   └── requests.http          # incluye /health/live, /health/ready y /api/demo/error
├── Auth.Auth0.Api.Tests/      # tests de integración (WebApplicationFactory) que corre el CI
├── auth0-web/                 # React + Vite + TS (sin cambios en el código)
│   ├── Dockerfile             # multi-stage: node (build) -> nginx (runtime)
│   └── nginx/default.conf.template   # puerto ${PORT}, /health, SPA fallback, access log JSON
├── Clase16.sln
├── docker-compose.yml         # mismos contenedores en local, con healthchecks
├── .env.example               # variables para docker compose
└── README.md

.github/workflows/clase16-ci-cd.yml   # el pipeline (GitHub solo lee workflows en la raíz del repo)
```

### Qué cambió respecto a la Clase 15

| Cambio | Archivo | Por qué |
|---|---|---|
| Escucha en `PORT` si existe | `Program.cs` | Render indica el puerto con la variable `PORT` |
| CORS desde `Cors:AllowedOrigins` | `Program.cs`, `appsettings.json` | En producción el origen es `https://…onrender.com`, no `localhost:5173` |
| Auth0 por variables de entorno | `Program.cs` | `Auth0__Domain` / `Auth0__Audience` (en contenedores no hay `user-secrets`) |
| `/health/live` y `/health/ready` | `Program.cs`, `Health/` | Liveness vs readiness (ver [Health checks](#health-checks)) |
| Logs JSON + un log por petición | `Program.cs`, `appsettings.json` | Logs fáciles de filtrar en Render |
| `/api/demo/error` | `Program.cs` | Provocar un 500 y ver el stack trace en los logs |
| `APP_VERSION` | `Dockerfile`, `HealthResponseWriter.cs` | Saber qué commit está corriendo en producción |
| Tests de integración | `Auth.Auth0.Api.Tests/` | Sin tests, el CI solo comprueba que compila |

## Requisitos

- Lo mismo que la Clase 15: .NET 10 SDK, Node.js 22+, cuenta de Auth0 ya configurada ([Configuración de Auth0](../Clase15/demo-auth/README.md#configuración-de-auth0)).
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para probar los contenedores en local; el CI no lo necesita).
- Una cuenta de [GitHub](https://github.com) con el repositorio del curso (o un fork) y GitHub Actions habilitado.
- Una cuenta gratuita de [Render](https://render.com) (se puede entrar con GitHub).

---

## Paso 1 · Probar en local

### 1.1 Sin Docker (igual que en la Clase 15)

```bash
cd Clase16/Auth.Auth0.Api
dotnet user-secrets set "Auth0:Domain" "tu-tenant.us.auth0.com"
dotnet run                             # http://localhost:5080

cd ../auth0-web
cp .env.example .env                   # mismos valores que en la Clase 15
npm install
npm run dev                            # http://localhost:5173
```

> `UserSecretsId` es el mismo que el de la Clase 15, así que si ya lo configuraste allí, la API lo encuentra.

Prueba los health checks con [Auth.Auth0.Api/requests.http](Auth.Auth0.Api/requests.http) o:

```bash
curl http://localhost:5080/health/live
curl http://localhost:5080/health/ready
```

Y los tests que correrá el CI:

```bash
cd Clase16
dotnet test
```

### 1.2 Con Docker Compose (los mismos contenedores que irán a Render)

```bash
cd Clase16
cp .env.example .env                   # PowerShell: Copy-Item .env.example .env
# edita .env con AUTH0_DOMAIN, AUTH0_CLIENT_ID y AUTH0_AUDIENCE
docker compose up --build
```

- Web: http://localhost:5173 · API: http://localhost:5080 (mismos puertos, así no hay que tocar Auth0 ni CORS).
- `docker compose ps` muestra `(health: starting)` → `(healthy)`. La web **no arranca** hasta que la API está `healthy` (`depends_on: condition: service_healthy`).
- `docker compose logs -f api` muestra los logs en JSON, igual que en Render.
- `docker inspect --format '{{json .State.Health}}' clase16-api-1` muestra el historial del HEALTHCHECK.

---

## Paso 2 · Configurar GitHub (primera ejecución del pipeline)

En el repositorio: **Settings → Secrets and variables → Actions**.

### 2.1 Variables (pestaña *Variables*)

No son secretas (terminan dentro del JavaScript que descarga cualquier navegador), por eso van como *variables* y no como *secrets*.

| Variable | Valor | Para qué |
|---|---|---|
| `AUTH0_DOMAIN` | `tu-tenant.us.auth0.com` | build de la web |
| `AUTH0_CLIENT_ID` | Client ID de la SPA en Auth0 | build de la web |
| `AUTH0_AUDIENCE` | `https://api.demo-auth.local` | build de la web |
| `RENDER_API_URL` | *(vacía por ahora — Paso 4)* | URL de la API para la web, deploy y smoke tests |
| `RENDER_WEB_URL` | *(vacía por ahora — Paso 4)* | deploy y smoke tests |

### 2.2 Permisos del `GITHUB_TOKEN`

**Settings → Actions → General → Workflow permissions**: basta con el valor por defecto (*Read repository contents*). El job `publish` pide `packages: write` de forma explícita para subir a GHCR.

### 2.3 Primer push

```bash
git add Clase16 .github/workflows/clase16-ci-cd.yml
git commit -m "Clase16: CI/CD con GitHub Actions hacia Render"
git push
```

En la pestaña **Actions** verás `Clase16 · CI/CD Render`. Como `RENDER_API_URL` está vacía:

- ✅ `API · build y tests`, ✅ `Web · lint y build`, ✅ `Docker · publicar en GHCR`
- ⏭️ `deploy-api`, `deploy-web` y `smoke-tests` se **omiten** (aún no hay servicios en Render)

> El pipeline solo se dispara con cambios dentro de `Clase16/` o del propio workflow (`paths:`), para no desplegar cuando cambian otras clases. También se puede lanzar a mano con **Run workflow** (`workflow_dispatch`).

### 2.4 Hacer públicas las imágenes

GHCR crea los paquetes como **privados**. En tu perfil/organización → **Packages** → `clase16-auth0-api` → **Package settings** → **Change visibility → Public**. Repite con `clase16-auth0-web`.

> Alternativa (si deben ser privadas): en Render, **Settings → Registry Credentials** → agrega `ghcr.io` con tu usuario de GitHub y un *Personal Access Token (classic)* con permiso `read:packages`, y selecciónalo al crear cada servicio.

Imágenes publicadas (cada una con dos tags: el SHA del commit y `latest`):

```text
ghcr.io/<owner>/clase16-auth0-api:<sha>
ghcr.io/<owner>/clase16-auth0-web:<sha>
```

---

## Paso 3 · Crear los servicios en Render

Render despliega **imágenes ya construidas** ("Existing Image"): la imagen se construye y se prueba una sola vez en GitHub Actions, y es exactamente esa la que llega a producción.

### 3.1 API

**New → Web Service → Existing Image**

| Campo | Valor |
|---|---|
| Image URL | `ghcr.io/<owner>/clase16-auth0-api:latest` |
| Name | `clase16-auth0-api` (define la URL: `https://clase16-auth0-api.onrender.com`; si el nombre está tomado, Render agrega un sufijo) |
| Region | la más cercana (p. ej. *Ohio* o *Virginia*) |
| Instance Type | **Free** |
| Environment Variables | ver tabla |
| Advanced → Health Check Path | **`/health/ready`** |

| Variable de entorno | Valor |
|---|---|
| `Auth0__Domain` | `tu-tenant.us.auth0.com` |
| `Auth0__Audience` | `https://api.demo-auth.local` |
| `Cors__AllowedOrigins__0` | URL de la web (Paso 3.2), p. ej. `https://clase16-auth0-web.onrender.com` (sin `/` final) |

> `__` (doble guion bajo) es como .NET representa `:` en variables de entorno: `Auth0__Domain` ≡ `Auth0:Domain`. `PORT` no hace falta: Render la define y la API la lee.

### 3.2 Web

**New → Web Service → Existing Image**

| Campo | Valor |
|---|---|
| Image URL | `ghcr.io/<owner>/clase16-auth0-web:latest` |
| Name | `clase16-auth0-web` |
| Instance Type | **Free** |
| Advanced → Health Check Path | **`/health`** |

No necesita variables de entorno: las `VITE_*` se "incrustan" al compilar (son `build-args` en el workflow).

> Crea primero ambos servicios (aunque la web aún apunte a `localhost`): así conoces las dos URLs y luego las completas en la API (CORS) y en GitHub.

### 3.3 Deploy hooks

En cada servicio: **Settings → Deploy Hook** → copia la URL (`https://api.render.com/deploy/srv-…?key=…`). **Es un secreto**: quien la tenga puede desplegar tu servicio.

Los servicios con imagen **no** se redespliegan solos cuando se publica una imagen nueva; el pipeline llama al deploy hook pasándole `imgURL=ghcr.io/…:<sha>` para indicar qué versión exacta desplegar.

---

## Paso 4 · Conectar todo

### 4.1 GitHub

**Settings → Secrets and variables → Actions**

| Tipo | Nombre | Valor |
|---|---|---|
| Secret | `RENDER_DEPLOY_HOOK_API` | deploy hook de la API |
| Secret | `RENDER_DEPLOY_HOOK_WEB` | deploy hook de la web |
| Variable | `RENDER_API_URL` | `https://clase16-auth0-api.onrender.com` (sin `/` final) |
| Variable | `RENDER_WEB_URL` | `https://clase16-auth0-web.onrender.com` (sin `/` final) |

### 4.2 Auth0

Dashboard → **Applications → *tu SPA* → Settings**. Agrega la URL de la web **sin borrar** las de localhost (separadas por coma):

| Campo | Valor |
|---|---|
| Allowed Callback URLs | `http://localhost:5173, https://clase16-auth0-web.onrender.com` |
| Allowed Logout URLs | `http://localhost:5173, https://clase16-auth0-web.onrender.com` |
| Allowed Web Origins | `http://localhost:5173, https://clase16-auth0-web.onrender.com` |

### 4.3 Primer despliegue completo

**Actions → Clase16 · CI/CD Render → Run workflow** (rama `main`). Ahora la web se compila con la URL real de la API y se ejecutan todos los jobs:

1. `publish` construye y sube las imágenes `:<sha>`.
2. `deploy-api` llama al deploy hook y consulta `/health/ready` cada 15 s hasta que responde `Healthy` **con `version` igual al SHA del commit** (máx. 10 min).
3. `deploy-web` hace lo mismo con `/health`.
4. `smoke-tests` verifica en producción: web `200`, `/api/public` `200`, `/api/private` sin token `401`, `/health/live` `200` y que CORS permita el origen de la web.
5. El resumen del run (*Summary*) muestra las URLs y la versión desplegada.

El job de deploy usa el *environment* `production` (GitHub lo crea automáticamente la primera vez). En **Settings → Environments → production** puedes agregar **Required reviewers**: el pipeline se detiene antes de desplegar hasta que alguien lo apruebe. Esa es la diferencia entre *continuous delivery* (con aprobación) y *continuous deployment* (automático).

Abre la web, inicia sesión con Auth0 y usa **Probar API**: el flujo es el mismo de la Clase 15, ahora en HTTPS y en la nube.

---

## Health checks

| Ruta | Servicio | Qué revisa | Uso |
|---|---|---|---|
| `/health/live` | API | Que el proceso responda (sin dependencias) | `HEALTHCHECK` de Docker, smoke test |
| `/health/ready` | API | Lo anterior **+** que Auth0 (`/.well-known/openid-configuration`) sea accesible | Health check de Render, espera del pipeline |
| `/health` | Web | Que Nginx sirva archivos | Health check de Render, `HEALTHCHECK` de Docker |
| `/api/health` | API | Endpoint simple de la Clase 15 (se conserva) | — |

Respuesta de `/health/ready` (HTTP `200` si todo está `Healthy`, `503` si algo falla):

```json
{
  "status": "Healthy",
  "version": "5ce15dc8b1…",
  "environment": "Production",
  "checks": {
    "self":  { "status": "Healthy", "description": "La API está en ejecución" },
    "auth0": { "status": "Healthy", "description": "Auth0 OIDC accesible (tu-tenant.us.auth0.com)" }
  }
}
```

**Liveness vs readiness**: *live* responde "¿el proceso está vivo?" (si falla, hay que reiniciarlo); *ready* responde "¿puede atender peticiones de verdad?" (si Auth0 no es accesible, la API no puede validar ningún token, así que no debería recibir tráfico).

**Cómo los usa Render**: al desplegar, Render levanta la versión nueva junto a la anterior y solo le pasa el tráfico cuando el *Health Check Path* responde `2xx`/`3xx`. Si nunca lo logra, el deploy se marca como fallido y **la versión anterior sigue atendiendo** (zero-downtime deploy). Si una instancia ya en ejecución falla el health check durante varios minutos, Render la reinicia. Todo queda registrado en la pestaña **Events** del servicio.

## Logs

Ambos servicios escriben a **stdout** (como debe hacerlo un contenedor) y Render lo muestra en la pestaña **Logs** del servicio, con búsqueda y filtro por fecha.

**API** (JSON, una línea por evento):

```json
{"Timestamp":"2026-11-07T15:02:11.481Z","LogLevel":"Information","Category":"Auth.Auth0.Api","Message":"Auth.Auth0.Api iniciada. Versión 5ce15dc…, entorno Production, CORS https://clase16-auth0-web.onrender.com", …}
{"Timestamp":"…","LogLevel":"Information","Category":"Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware","State":{"Method":"GET","Path":"/health/ready","StatusCode":200,"Duration":12.4}}
{"Timestamp":"…","LogLevel":"Information","Category":"Program","Message":"Acceso a /api/private por auth0|6543…","State":{"Sub":"auth0|6543…"}}
{"Timestamp":"…","LogLevel":"Error","Category":"Microsoft.AspNetCore.Diagnostics.ExceptionHandlerMiddleware","Exception":"System.InvalidOperationException: Error de demostración…"}
```

**Web** (access log de Nginx en JSON):

```json
{"time":"2026-11-07T15:03:40+00:00","method":"GET","path":"/assets/index-mznzeAGS.js","status":200,"bytes":455030,"durationMs":"0.000"}
```

Búsquedas útiles en Render → Logs:

| Buscar | Para ver |
|---|---|
| `iniciada` | Cada arranque de la API, con versión y orígenes CORS |
| `"StatusCode":500` | Peticiones con error |
| `"LogLevel":"Error"` | Excepciones con su stack trace |
| `health/ready` | Las llamadas del health check de Render |
| `/api/private` | Quién accede (log estructurado con `Sub`) |

> En local: `docker compose logs -f api` muestra lo mismo. Con `dotnet run` (Development) los logs se ven como texto normal; el JSON solo se activa fuera de Development.

---

## Demos sugeridas para la clase

1. **CI que bloquea un error**: en una rama, cambia un `Assert` en [ApiTests.cs](Auth.Auth0.Api.Tests/ApiTests.cs) (o rompe un tipo en el frontend) y abre un PR. El check queda en rojo, se puede descargar el artefacto `resultados-tests-api` y **no se despliega nada**. Opcional: **Settings → Branches → Branch protection** para exigir que el CI pase antes de hacer merge.
2. **Despliegue continuo**: cambia un texto visible en [App.tsx](auth0-web/src/App.tsx) o en `/api/public`, haz merge y observa el pipeline completo, el job esperando el health check y la nueva versión en `/health/ready`.
3. **Health check que salva producción**: en Render → API → Environment, cambia `Auth0__Domain` a un dominio que no exista y guarda (Render redespliega). `/health/ready` de la nueva instancia devuelve `503`, el deploy falla en **Events** y la versión anterior **sigue funcionando**. Restaura el valor correcto.
4. **Leer logs de un error**: llama a `GET /api/demo/error` y busca el stack trace en Render → Logs. Nota que el cliente solo recibe un `ProblemDetails` genérico (no se filtran detalles internos).
5. **Rollback**: en Render → API → Events, usa **Rollback** sobre un deploy anterior; o en GitHub → Actions, **Re-run all jobs** de un run viejo (vuelve a desplegar la imagen con ese SHA, que sigue en GHCR).

## Problemas comunes

| Síntoma | Causa probable / solución |
|---|---|
| `publish` falla: *Falta la variable de repositorio AUTH0_…* | Crear las variables del [Paso 2.1](#21-variables-pestaña-variables) |
| `publish` falla con `denied` / `403` al hacer push | El paquete ya existe y no está vinculado al repo: **Package settings → Manage Actions access → Add repository** con rol *Write* |
| Render: *failed to pull image* / *unauthorized* | El paquete en GHCR es privado: hazlo público o configura *Registry Credentials* ([Paso 2.4](#24-hacer-públicas-las-imágenes)) |
| `deploy-api` agota los 10 min | Revisa Render → Events/Logs. Normalmente `Auth0__Domain` mal escrito (`/health/ready` = `503`) o la API no arrancó por falta de configuración |
| La primera petición tarda ~1 min | Plan Free: el servicio se duerme tras 15 min sin tráfico y despierta con la siguiente petición (*cold start*). El pipeline usa `--max-time 60` por eso |
| La web dice *Falta configurar Auth0* | Las `VITE_*` estaban vacías al compilar: revisa las variables de GitHub y vuelve a ejecutar el workflow |
| Error de CORS en el navegador / smoke test `CORS devolvió ''` | `Cors__AllowedOrigins__0` en Render debe ser **exactamente** la URL de la web (con `https://`, sin `/` final) |
| Auth0: *Callback URL mismatch* | Falta la URL de Render en *Allowed Callback URLs* ([Paso 4.2](#42-auth0)) |
| La web llama a `localhost:5080` en producción | `RENDER_API_URL` estaba vacía cuando se construyó la imagen: complétala y vuelve a ejecutar el workflow |
| VS Code marca *Context access might be invalid* en el workflow | Normal hasta que las variables/secrets existan en GitHub; no afecta la ejecución |

## Resumen de configuración

| Dónde | Qué |
|---|---|
| GitHub → Variables | `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_AUDIENCE`, `RENDER_API_URL`, `RENDER_WEB_URL` |
| GitHub → Secrets | `RENDER_DEPLOY_HOOK_API`, `RENDER_DEPLOY_HOOK_WEB` |
| GHCR | Paquetes `clase16-auth0-api` y `clase16-auth0-web` públicos (o credenciales en Render) |
| Render → API | Imagen `…/clase16-auth0-api:latest`, health check `/health/ready`, env `Auth0__Domain`, `Auth0__Audience`, `Cors__AllowedOrigins__0` |
| Render → Web | Imagen `…/clase16-auth0-web:latest`, health check `/health` |
| Auth0 → SPA | URL de la web en Callback, Logout y Web Origins |
