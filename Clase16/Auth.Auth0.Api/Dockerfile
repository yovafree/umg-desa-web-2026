# ---------------------------------------------------------------
# Imagen de Auth.Auth0.Api (multi-stage)
#   1) build:   SDK completo para compilar y publicar
#   2) runtime: solo el runtime de ASP.NET (imagen más pequeña y con menos superficie de ataque)
# Construir (desde Clase16/):  docker build -t auth0-api ./Auth.Auth0.Api
# ---------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /src

# Primero solo el .csproj: si no cambian las dependencias, Docker reutiliza la capa del restore.
COPY Auth.Auth0.Api.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS runtime
WORKDIR /app
COPY --from=build /app ./

# Versión desplegada (commit SHA). La envía GitHub Actions como build-arg y
# la API la muestra en /health/ready para verificar qué versión está en producción.
ARG APP_VERSION=local
ENV APP_VERSION=$APP_VERSION \
    ASPNETCORE_ENVIRONMENT=Production \
    PORT=8080

EXPOSE 8080

# Health check del contenedor (lo usa Docker / docker compose; Render usa su propio health check).
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- "http://localhost:${PORT}/health/live" > /dev/null || exit 1

# Nunca correr como root: las imágenes de .NET traen el usuario "app".
USER $APP_UID

ENTRYPOINT ["dotnet", "Auth.Auth0.Api.dll"]
