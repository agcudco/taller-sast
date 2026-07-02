Ejecuta el comando de construcción y arranque:
```
docker-compose up --build
```

O en segundo plano:
```
docker-compose up --build -d
```

Verifica que todos los contenedores estén en estado Up:
```
docker-compose ps
```

Para crear los usuarios iniciales (operador y cliente), ejecuta la semilla:
```
docker-compose exec auth-service node dist/seeds/seed.js
```
Accede al frontend en http://localhost y utiliza las credenciales:

| Rol       | Email                | Contraseña   |
|-----------|----------------------|--------------|
| Operador  | admin@example.com    | Admin12345   |
| Cliente   | cliente@example.com  | Cliente123   |

Detener servicios
```
docker-compose down
```

Detener y eliminar volúmenes (borra las bases de datos):
```
docker-compose down -v
```

## Análisis con SonarQube Community

### Configuración inicial (una sola vez)

1. Levanta SonarQube (instancia del Lab 2 o perfil del monorepo):

```
docker compose --profile sonarqube up -d
```

2. Abre http://localhost:9000, crea el proyecto manualmente con key `taller-sast`.
3. Genera un token en **My Account → Security** y expórtalo:

```
export SONAR_TOKEN="tu_token"
export SONAR_HOST_URL="http://localhost:9000"
```

Agrega esas variables a tu `~/.zshrc` para no repetirlas.

### Análisis automático al hacer commit

El hook **pre-commit** ejecuta SonarQube automáticamente cuando el commit incluye cambios en código fuente (`apps/**/*.ts`, `.js`, `.tsx`, etc.).

Requisitos antes de commitear:
- SonarQube corriendo en `localhost:9000`
- `SONAR_TOKEN` exportado
- `sonar-scanner` instalado (`brew install sonar-scanner`)

Instalar hooks (después de clonar o la primera vez):

```
yarn install
# o, si yarn no está disponible:
sh scripts/setup-git-hooks.sh
```

Si el análisis falla, el commit se **bloquea** hasta corregir los problemas o resolver la configuración.

### Análisis manual

```
yarn sonar
```

Con cobertura de tests en los microservicios NestJS:

```
yarn sonar:coverage
```

### Análisis en GitHub (CI)

Al hacer **push** a `main` o ramas `taller_sast/**`, GitHub Actions levanta SonarQube Community, ejecuta el scanner y publica el resultado en el job.

Resultados locales: http://localhost:9000/dashboard?id=taller-sast