# ---------------------------------------------------------------
# Imagen de auth0-web (multi-stage)
#   1) build:   Node compila React con Vite -> archivos estáticos en /app/dist
#   2) runtime: Nginx sirve esos archivos (sin Node en producción)
# Construir (desde Clase16/):
#   docker build -t auth0-web ./auth0-web \
#     --build-arg VITE_AUTH0_DOMAIN=tu-tenant.us.auth0.com \
#     --build-arg VITE_AUTH0_CLIENT_ID=tu-client-id \
#     --build-arg VITE_AUTH0_AUDIENCE=https://api.demo-auth.local \
#     --build-arg VITE_API_URL=http://localhost:5080
# ---------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Vite "incrusta" las variables VITE_* en el JavaScript AL COMPILAR,
# por eso llegan como build-args y no como variables de entorno en tiempo de ejecución.
# Ninguna es secreta (una SPA no puede guardar secretos).
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE
ARG VITE_API_URL
ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN \
    VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID \
    VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE \
    VITE_API_URL=$VITE_API_URL

COPY . ./
RUN npm run build

FROM nginx:1.29-alpine AS runtime

# La imagen oficial de Nginx procesa /etc/nginx/templates/*.template con envsubst
# al arrancar: así el puerto sale de la variable PORT que define Render.
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

ARG APP_VERSION=local
RUN echo "{\"status\":\"ok\",\"version\":\"${APP_VERSION}\"}" > /usr/share/nginx/html/health.json

ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- "http://localhost:${PORT}/health" > /dev/null || exit 1
