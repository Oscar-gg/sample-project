# red-bicicletas week 3

Proyecto parte del curso:
Desarrollo del lado servidor: NodeJS, Express y MongoDB
Universidad Austral

## Instalación
```bash
git clone https://github.com/Oscar-gg/sample-project.git
cd week3-red-bicicletas
npm install
```
**Asegurar que Mongo esta instalado antes de correr**

## Correr programa:

- Correr mongod.exe
- Correr mongosh.exe

Correr en modo debug con Node
```bash
DEBUG=red_bicicletas:* npm run devstart
```

Tests con jasmine:
```bash
npm test
```

Endpoints para requests con Postman:
```
'/api/auth/authenticate' (post)
'/api/bicicletas/create' (post)
'/api/bicicletas/delete' (delete)
'/api/bicicletas/'       (get)

'/api/usuarios/'         (get)
'/api/usuarios/create'   (post)
'/api/usuarios/reservar' (post)
```