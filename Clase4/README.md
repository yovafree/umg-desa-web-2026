# Clase 4

Esta clase incluye una configuración con Docker Compose para levantar servicios base del entorno de práctica.

## Componentes

- `nginx`: servidor web expuesto en el puerto `8086`
- `mysql`: base de datos MySQL expuesta en el puerto `8091`

## Requisitos

- Docker
- Docker Compose

## Uso

Para levantar los servicios:

```bash
docker compose up -d
```

Para detenerlos:

```bash
docker compose down
```

## Archivos

- `docker-compose.yaml`: definición de los servicios de la clase