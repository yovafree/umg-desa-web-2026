# Construir imagen de docker

docker build -t supermanversemvc:v1.0 .

# Ejecutar la imagen:

docker run -p 8094:8080 supermanversemvc:v1.0

# Nueva versión

docker build -f Dockerfile.prod -t supermanversemvc:v2.0 .

docker run -p 8095:8080 supermanversemvc:v2.0
