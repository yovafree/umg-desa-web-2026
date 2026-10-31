# Desarrollo Web 2026

Repositorio base para almacenar los ejemplos, ejercicios y prácticas del curso de Desarrollo Web 2026.

La organización del material se hace por clase. Cada carpeta de clase debe tener su propio README.md con la información, instrucciones y notas específicas de esa sesión.

## Objetivo

- Centralizar los ejemplos desarrollados en clase.
- Separar el contenido por tema o sesión.
- Facilitar la revisión del avance del curso.
- Servir como base para reutilizar ejemplos en futuras clases.

## Índice de clases

| Clase | Tema | Tecnologías | Carpeta |
|---|---|---|---|
| 4 | Servicios base con contenedores | Docker Compose, Nginx, MySQL | [Clase4](Clase4) |
| 4-1 | Sitio estático y variantes backend en contenedores | HTML/CSS/JS, Node.js + TypeScript, ASP.NET MVC, Docker | [Clase4-1](Clase4-1) |
| 7 | Patrón MVC | ASP.NET MVC | [Clase7](Clase7) |
| 8 | MVC con base de datos | ASP.NET MVC, EF Core, MySQL | [Clase8](Clase8) |
| 9 | CRUD con Express y vistas | Node.js, Express, Pug | [Clase9](Clase9) |
| 10 | TypeScript y primer proyecto React | TypeScript, React, Vite, MUI | [Clase10](Clase10) |
| 12 | Arquitecturas web, nube y serverless | Azure App Service, Blob Storage, Azure Functions, PowerShell | [Clase12](Clase12) |
| 13 | OWASP Top 10 y prácticas de seguridad | Node.js, Express, SQLite, helmet | [Clase13](Clase13) |
| 15 | Autenticación (local y con Auth0) | .NET 10 Minimal APIs, React, JWT, Auth0 | [Clase15](Clase15) |
| 16 | CI/CD, despliegue en la nube y observabilidad | GitHub Actions, Docker, GHCR, Render | [Clase16](Clase16) |

## Estructura del repositorio

```text
.
├── .github/
│   └── workflows/
│       └── clase16-ci-cd.yml        # pipeline CI/CD de la Clase 16
├── Clase4/                          # docker-compose con Nginx + MySQL
├── Clase4-1/
│   ├── static/                      # sitio estático (Spider-Man)
│   ├── nodejs/                      # variante Node.js + TypeScript
│   └── dotnet/                      # variante ASP.NET MVC (Superman)
├── Clase7/
│   └── mvcEjemplo/                  # ASP.NET MVC básico
├── Clase8/
│   └── mvcEjemplo1/                 # ASP.NET MVC + EF Core (MySQL)
├── Clase9/
│   └── Ejemplo1/                    # Express + Pug, CRUD en memoria
├── Clase10/
│   ├── 01-sintaxis-fundamental.ts … 05-react-primer-componente.tsx
│   └── ejemplo-react/my-app/        # React + Vite + MUI, CRUD de productos
├── Clase12/
│   ├── demos/                       # App Service, sitio estático, Azure Functions
│   ├── diagrams/                    # diagramas Mermaid
│   └── scripts/                     # automatización en PowerShell
├── Clase13/
│   └── owasp-demo/                  # código vulnerable vs. seguro
├── Clase15/
│   └── demo-auth/
│       ├── 01-local/                # Parte A: autenticación propia (JWT, 2FA)
│       └── 02-auth0/                # Parte B: Auth0 (OIDC + PKCE, RBAC)
├── Clase16/
│   ├── Auth.Auth0.Api/              # API de la Clase 15 lista para producción
│   ├── Auth.Auth0.Api.Tests/        # tests de integración que corre el CI
│   ├── auth0-web/                   # React servido con Nginx
│   └── docker-compose.yml
└── README.md
```

## Clases y ejemplos

### Clase 4

La documentación completa de esta clase está en [Clase4/README.md](Clase4/README.md).

Levanta un servidor `nginx` (puerto `8086`) y una base de datos `mysql` (puerto `8091`):

```bash
cd Clase4
docker compose up -d
```

### Clase 4-1

Incluye tres variantes del ejercicio:

- [Clase4-1/static](Clase4-1/static): sitio web estático con temática de Spider-Man, selector de color, selector de universos y animaciones.
- [Clase4-1/nodejs](Clase4-1/nodejs): proyecto Node.js con TypeScript como variante backend del ejercicio.
- [Clase4-1/dotnet](Clase4-1/dotnet): aplicativo ASP.NET MVC con blog de Superman y variantes del multiverso.

#### Sitio estático

La documentación específica está en [Clase4-1/static/Readme.md](Clase4-1/static/Readme.md).

Comandos principales:

```bash
docker build -t spiderverse:v2.0 .
docker run -d -p 8092:80 spiderverse:v2.0
```

#### Aplicativo ASP.NET MVC

La documentación específica está en [Clase4-1/dotnet/Readme.md](Clase4-1/dotnet/Readme.md).

Comandos principales:

```bash
docker build -t spiderversemvc:v1.0 .
docker run -p 8094:8080 spiderversemvc:v1.0
```

### Clase 7

Contiene el proyecto [Clase7/mvcEjemplo](Clase7/mvcEjemplo), un ejemplo ASP.NET MVC con:

- Controlador principal `HomeController`.
- Modelo `Persona` para pruebas de vistas y paso de datos.
- Vistas base, alternativa de layout (`_Layout2.cshtml`) y parcial de login (`_Login.cshtml`).

Si necesitas ejecutar esta clase localmente:

```bash
dotnet run --project Clase7/mvcEjemplo/mvcEjemplo.csproj
```

### Clase 8

Contiene el proyecto [Clase8/mvcEjemplo1](Clase8/mvcEjemplo1), un ejemplo ASP.NET MVC conectado a base de datos con Entity Framework Core (MySQL):

- `CursoDbContext` como contexto de EF Core, con el `DbSet<Categoria>`.
- Modelo `Categoria` (Id, Nombre, Descripcion, Estado).
- `CategoriasController` con la acción `Index` para listar categorías desde la base de datos.

Si necesitas ejecutar esta clase localmente:

```bash
dotnet run --project Clase8/mvcEjemplo1/mvcEjemplo1.csproj
```

### Clase 9

Contiene el proyecto [Clase9/Ejemplo1](Clase9/Ejemplo1), una aplicación Express con vistas Pug y operaciones CRUD en memoria para:

- Productos.
- Clientes.
- Controladores, modelos, rutas y vistas organizados por recurso.

Para ejecutar esta clase localmente:

```bash
cd Clase9/Ejemplo1
npm install
npm run dev
```

La aplicación queda disponible en [http://localhost:3000](http://localhost:3000). El listado de productos se muestra en `/productos` y el de clientes en `/clientes`.

### Clase 10

Introducción a TypeScript y a React. Contiene:

- Archivos de práctica independientes, en orden:
  - [01-sintaxis-fundamental.ts](Clase10/01-sintaxis-fundamental.ts): `let`/`const`, tipado explícito e inferido.
  - [02-estructuras-control.ts](Clase10/02-estructuras-control.ts): condicionales y ciclos.
  - [03-tipos-y-funciones.ts](Clase10/03-tipos-y-funciones.ts): interfaces y funciones tipadas.
  - [04-js-vs-ts-comparacion.ts](Clase10/04-js-vs-ts-comparacion.ts): el mismo problema en JavaScript y en TypeScript.
  - [05-react-primer-componente.tsx](Clase10/05-react-primer-componente.tsx): primer componente de React.
- [Clase10/ejemplo-react/my-app](Clase10/ejemplo-react/my-app): app React + Vite + TypeScript con Material UI (MUI). Es un CRUD de productos con diálogo de formulario y un *fake backend* en memoria que simula latencia de red ([productosApi.ts](Clase10/ejemplo-react/my-app/src/services/productosApi.ts)).

Para ejecutar un archivo de práctica:

```bash
cd Clase10
npx ts-node 01-sintaxis-fundamental.ts
```

Para ejecutar la app React:

```bash
cd Clase10/ejemplo-react/my-app
npm install
npm run dev
```

La aplicación queda disponible en [http://localhost:5173](http://localhost:5173).

### Clase 12

Arquitecturas web, servicios en la nube y serverless con Azure. La documentación completa (en inglés) está en [Clase12/README.md](Clase12/README.md). Incluye tres demos automatizadas con scripts de PowerShell:

- **Demo 1**: app Express desplegada en Azure App Service ([demos/demo1-appservice](Clase12/demos/demo1-appservice)).
- **Demo 2**: sitio estático publicado en Azure Blob Storage ([demos/demo2-static-site](Clase12/demos/demo2-static-site)).
- **Demo 3**: API con Azure Functions (Node.js v4) y un frontend que la consume con `fetch()` ([demos/demo3-functions](Clase12/demos/demo3-functions)).
- Diagramas Mermaid de las arquitecturas en [Clase12/diagrams](Clase12/diagrams).

Requiere Azure CLI, Azure Functions Core Tools v4 y una suscripción de Azure (Azure for Students funciona). Los scripts se ejecutan en orden desde `Clase12/`:

```powershell
cd Clase12
.\scripts\00-check-prereqs.ps1
.\scripts\01-demo1-appservice.ps1 -Initials yd
# ... 02 a 05, ver Clase12/README.md
.\scripts\99-cleanup.ps1          # elimina los recursos de Azure al terminar
```

### Clase 13

Contiene [Clase13/owasp-demo](Clase13/owasp-demo), una app didáctica que compara código **vulnerable** y **seguro** según el OWASP Top 10:2025: inyección SQL, contraseñas en MD5 vs. bcrypt, enumeración de usuarios y fuerza bruta, IDOR, escalada de privilegios, XSS almacenado, encabezados de seguridad (`helmet`), manejo de errores y registro.

Requiere Node.js 22.13 o superior (usa `node:sqlite`, sin instalar base de datos):

```bash
cd Clase13/owasp-demo
npm install
npm start
```

- Versión vulnerable: [http://localhost:3000/vuln.html](http://localhost:3000/vuln.html)
- Versión segura: [http://localhost:3000/seguro.html](http://localhost:3000/seguro.html)

> ⚠️ Las rutas `/vuln/*` son intencionalmente vulnerables: ejecuta la app solo en tu máquina. Usuarios de prueba y ejercicios guiados en [Clase13/owasp-demo/README.md](Clase13/owasp-demo/README.md).

### Clase 15

Contiene [Clase15/demo-auth](Clase15/demo-auth), una demo de autenticación en dos partes (.NET 10 Minimal APIs + React/Vite/TypeScript):

- Parte A (`01-local`): registro, hash de contraseñas, JWT HS256, CORS, rate limiting y 2FA con TOTP.
- Parte B (`02-auth0`): login con Auth0 (OIDC + PKCE), validación con JWKS y permisos RBAC.

Cada paso tiene un tag (`parteA-paso01` … `parteB-paso06`). Instrucciones en [Clase15/demo-auth/README.md](Clase15/demo-auth/README.md) y guion en [Clase15/demo-auth/GUION-DEMO.md](Clase15/demo-auth/GUION-DEMO.md).

### Clase 16

Contiene [Clase16](Clase16), la demo `02-auth0` de la Clase 15 preparada para producción:

- CI/CD con GitHub Actions ([.github/workflows/clase16-ci-cd.yml](.github/workflows/clase16-ci-cd.yml)): build, tests, imágenes Docker en GitHub Container Registry (GHCR) y despliegue automatizado en Render.
- Health checks (`/health/live`, `/health/ready`) y logs estructurados en JSON observables desde Render.
- `docker-compose.yml` para probar en local los mismos contenedores que se despliegan.

Configuración completa (GitHub, Render y Auth0) en [Clase16/README.md](Clase16/README.md).

## Notas

- Este README raíz resume la estructura general del curso y las rutas principales de ejecución. Los detalles operativos deben vivir dentro del README.md de cada clase o subproyecto.
- Ningún secreto se versiona: los archivos `.env` están ignorados y cada proyecto incluye un `.env.example` cuando lo necesita.
- El `.gitignore` raíz ignora los lockfiles (`package-lock.json`); las Clases 15 y 16 los versionan con su propio `.gitignore` para que `npm ci` (CI y Docker) instale versiones exactas.
