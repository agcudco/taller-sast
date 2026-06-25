# Hallazgos Semgrep

## Escaneo inicial (14)

| # | Archivo | Línea | Regla |
|---|---------|-------|-------|
| 1 | analisis-vulnerabilidades/backend/index.js | 7 | express-check-csurf-middleware-usage |
| 2 | analisis-vulnerabilidades/backend/index.js | 53 | console-log-express |
| 3 | analisis-vulnerabilidades/backend/index.js | 54 | express-sqlite-sqli |
| 4 | analisis-vulnerabilidades/backend/index.js | 101 | console-log-express |
| 5 | analisis-vulnerabilidades/backend/index.js | 102 | express-sqlite-sqli |
| 6 | analisis-vulnerabilidades/backend/index.js | 154 | express-child-process |
| 7 | analisis-vulnerabilidades/backend/index.js | 154 | detect-child-process |
| 8 | analisis-vulnerabilidades/frontend/index.html | 8 | missing-integrity |
| 9 | analisis-vulnerabilidades/frontend/index.html | 100 | missing-integrity |
| 10 | auth-service/Dockerfile | 25 | missing-user |
| 11 | frontend/Dockerfile | 23 | missing-user |
| 12 | frontend/nginx.conf | 16 | possible-nginx-h2c-smuggling |
| 13 | frontend/nginx.conf | 25 | possible-nginx-h2c-smuggling |
| 14 | products/Dockerfile | 22 | missing-user |

(Rutas completas empiezan con `apps/`)

## Escaneo final (10)

Después de corregir SQLi ya no salen los de las líneas 53, 54, 101 y 102.

Los que quedaron son sobre todo CSRF, command injection, Dockerfiles y nginx.

JSON:
- `semgrep/semgrep-report-inicial.json`
- `semgrep/semgrep-report-final.json`
