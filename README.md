# Desarrollo Web 2026

Repositorio base para almacenar los ejemplos, ejercicios y prácticas del curso de Desarrollo Web 2026.

La organización del material se hace por clase. Cada carpeta de clase debe tener su propio README.md con la información, instrucciones y notas específicas de esa sesión.

## Objetivo

- Centralizar los ejemplos desarrollados en clase.
- Separar el contenido por tema o sesión.
- Facilitar la revisión del avance del curso.
- Servir como base para reutilizar ejemplos en futuras clases.

## Estructura del repositorio

```text
.
├── Clase4/
│   ├── README.md
│   └── docker-compose.yaml
├── Clase4-1/
│   ├── static/
│   │   ├── Readme.md
│   │   ├── index.html
│   │   ├── app.js
│   │   └── styles.css
│   ├── nodejs/
│   │   ├── Readme.md
│   │   ├── package.json
│   │   └── src/
│   └── dotnet/
│       ├── Readme.md
│       ├── dotnet.csproj
│       ├── Controllers/
│       ├── Views/
│       └── wwwroot/
├── Clase7/
│   └── mvcEjemplo/
│       ├── mvcEjemplo.csproj
│       ├── Controllers/
│       ├── Models/
│       ├── Views/
│       └── wwwroot/
└── Clase8/
    └── mvcEjemplo1/
        ├── mvcEjemplo1.csproj
        ├── Controllers/
        ├── Models/
        ├── Views/
        └── wwwroot/
```

## Clases y ejemplos

### Clase 4

La documentación completa de esta clase está en [Clase4/README.md](Clase4/README.md).

### Clase 4-1

Incluye dos variantes del ejercicio:

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

## Notas

Este README raíz resume la estructura general del curso y las rutas principales de ejecución. Los detalles operativos deben vivir dentro del README.md de cada clase o subproyecto.