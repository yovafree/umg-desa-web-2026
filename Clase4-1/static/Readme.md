# Construir imagen de docker

docker build -t spiderverse:v1.0 .

# Ejecutar la imagen:

docker run -p 8091:80 spiderverse:v1.0

# Versionamiento de imagenes:

docker build -t spiderverse:v2.0 .

docker run -d -p 8091:80 spiderverse:v1.0

docker run -d -p 8092:80 spiderverse:v2.0


# Versión 3

docker build -t spiderverse:v3.0 .

docker run -d -p 8093:80 spiderverse:v3.0