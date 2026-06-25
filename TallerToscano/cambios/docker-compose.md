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

## Cómo lo probé

```bash
docker compose up --build -d
docker compose ps
docker compose exec auth-service node dist/seeds/seed.js
docker compose down
docker compose up -d
```

Puertos:
- frontend: 80
- auth-service: 3000
- product-service: 3001
