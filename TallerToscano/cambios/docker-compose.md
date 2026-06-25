# Docker Compose - corrección

Cuando fui a levantar la app me di cuenta que el compose no compilaba bien el servicio de productos.

## Error

En `docker-compose.yml` decía:

```yaml
product-service:
  build: ./apps/product-service
```

Esa carpeta no existe. El microservicio está en `apps/products`.

## Cambio

```yaml
product-service:
  build: ./apps/products
```

También quité `version: '3.8'` porque Compose me avisaba que ya no se usa.

Agregué `PORT: 3000` en auth-service y product-service. Sin eso auth levantaba en el puerto 8000 por defecto y no respondía en el 3000 del compose.

## Cómo lo probé

```bash
docker compose up --build -d
docker compose ps
docker compose exec auth-service node dist/seeds/seed.js
docker compose down
docker compose up -d
```

Resultado de las pruebas:
- frontend responde 200 en http://localhost
- login con admin@example.com funciona en http://localhost:3000/auth/login
- product-service responde con token JWT
- después de `down` y `up -d` todo sigue levantando bien

Puertos:
- frontend: 80
- auth-service: 3000
- product-service: 3001
