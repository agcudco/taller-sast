# Informe de Semgrep y correcciones sugeridas

## Resumen
Se ejecutó Semgrep en la raíz del repositorio con el comando:

```bash
semgrep scan --config auto --json
```

Resultado general:
- 115 archivos analizados
- 446 reglas ejecutadas
- 15 hallazgos
- 15 hallazgos marcados como blocking

## Hallazgos detectados

| Archivo | Línea | Regla | Severidad | Corrección sugerida |
| --- | ---: | --- | --- | --- |
| [.github/workflows/semgrep.yml](../.github/workflows/semgrep.yml#L29) | 29 | yaml.github-actions.security.github-actions-mutable-action-tag.github-actions-mutable-action-tag | WARNING | Fijar la acción `actions/checkout` a un SHA completo en lugar de usar `@v6`. |
| [apps/analisis-vulnerabilidades/backend/index.js](../apps/analisis-vulnerabilidades/backend/index.js#L7) | 7 | javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage | WARNING | Agregar protección CSRF con `csurf` o validación equivalente si la app usa cookies/sesión. |
| [apps/analisis-vulnerabilidades/backend/index.js](../apps/analisis-vulnerabilidades/backend/index.js#L53) | 53 | javascript.express.log.console-log-express.console-log-express | WARNING | Evitar registrar entrada del usuario sin sanitizar; normalizar o codificar antes de loguear. |
| [apps/analisis-vulnerabilidades/backend/index.js](../apps/analisis-vulnerabilidades/backend/index.js#L54) | 54 | javascript.express.express-sqlite-sqli.express-sqlite-sqli | WARNING | Cambiar concatenación de SQL por consultas parametrizadas o statements preparados. |
| [apps/analisis-vulnerabilidades/backend/index.js](../apps/analisis-vulnerabilidades/backend/index.js#L101) | 101 | javascript.express.log.console-log-express.console-log-express | WARNING | Evitar registrar entrada del usuario sin sanitizar; normalizar o codificar antes de loguear. |
| [apps/analisis-vulnerabilidades/backend/index.js](../apps/analisis-vulnerabilidades/backend/index.js#L102) | 102 | javascript.express.express-sqlite-sqli.express-sqlite-sqli | WARNING | Cambiar concatenación de SQL por consultas parametrizadas o statements preparados. |
| [apps/analisis-vulnerabilidades/backend/index.js](../apps/analisis-vulnerabilidades/backend/index.js#L154) | 154 | javascript.express.express-child-process.express-child-process | WARNING | Evitar pasar datos del usuario a `child_process`; validar, sanear o rediseñar la ejecución. |
| [apps/analisis-vulnerabilidades/backend/index.js](../apps/analisis-vulnerabilidades/backend/index.js#L154) | 154 | javascript.lang.security.detect-child-process.detect-child-process | WARNING | Eliminar dependencia de `child_process` con datos controlados por el usuario o encapsular la entrada. |
| [apps/analisis-vulnerabilidades/frontend/index.html](../apps/analisis-vulnerabilidades/frontend/index.html#L8) | 8 | html.security.audit.missing-integrity.missing-integrity | WARNING | Agregar atributo `integrity` a los recursos externos cargados desde CDN. |
| [apps/analisis-vulnerabilidades/frontend/index.html](../apps/analisis-vulnerabilidades/frontend/index.html#L100) | 100 | html.security.audit.missing-integrity.missing-integrity | WARNING | Agregar atributo `integrity` a los recursos externos cargados desde CDN. |
| [apps/auth-service/Dockerfile](../apps/auth-service/Dockerfile#L25) | 25 | dockerfile.security.missing-user.missing-user | WARNING | Definir un usuario no root con `USER` antes de terminar el Dockerfile. |
| [apps/frontend/Dockerfile](../apps/frontend/Dockerfile#L23) | 23 | dockerfile.security.missing-user.missing-user | WARNING | Definir un usuario no root con `USER` antes de terminar el Dockerfile. |
| [apps/frontend/nginx.conf](../apps/frontend/nginx.conf#L16) | 16 | generic.nginx.security.possible-h2c-smuggling.possible-nginx-h2c-smuggling | WARNING | Restringir o eliminar headers `Upgrade` si no hay necesidad real de WebSocket/h2c. |
| [apps/frontend/nginx.conf](../apps/frontend/nginx.conf#L25) | 25 | generic.nginx.security.possible-h2c-smuggling.possible-nginx-h2c-smuggling | WARNING | Restringir o eliminar headers `Upgrade` si no hay necesidad real de WebSocket/h2c. |
| [apps/products/Dockerfile](../apps/products/Dockerfile#L22) | 22 | dockerfile.security.missing-user.missing-user | WARNING | Definir un usuario no root con `USER` antes de terminar el Dockerfile. |

## Correcciones recomendadas

### 1) Workflow de GitHub Actions
- Reemplazar `actions/checkout@v6` por un commit SHA fijo.
- Esto reduce el riesgo de supply chain por tags mutables.

### 2) Backend de análisis de vulnerabilidades
- Agregar protección CSRF si el flujo usa cookies o sesión.
- Evitar `console.log` con datos crudos del usuario.
- Cambiar queries SQL concatenadas por consultas parametrizadas.
- Evitar `child_process` con entrada del usuario; si es inevitable, validar estrictamente la entrada.

### 3) Frontend HTML
- Agregar `integrity` a los recursos externos que se cargan desde CDN.
- Verificar que el `crossorigin` corresponda si el recurso lo requiere.

### 4) Dockerfiles
- Definir un usuario no root en `apps/auth-service/Dockerfile`, `apps/frontend/Dockerfile` y `apps/products/Dockerfile`.
- Idealmente crear el usuario durante el build y terminar con `USER <usuario>`.

### 5) Nginx
- Revisar la configuración de `Upgrade` en `apps/frontend/nginx.conf`.
- Si no se usa WebSocket, no reenviar el header `Upgrade`.
- Si sí se usa, permitir solo `websocket` y no `h2c`.

## Nota
Este archivo documenta el resultado de Semgrep y las correcciones sugeridas. No se modificó el código fuente en esta pasada.
