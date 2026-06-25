# Reporte de Semgrep

## Resultado inicial del escaneo CI

El primer escaneo ejecutado en modo CI/Semgrep Cloud reporto:

```text
CI scan completed successfully.
Findings: 29 (0 blocking)
Rules run: 125942
Targets scanned: 114
Parsed lines: ~100.0%
Scan skipped:
  - Files matching .semgrepignore patterns: 4
Scan was limited to files tracked by git
No blocking findings so exiting with code 0
```

Resultados publicados en Semgrep Cloud:

- https://semgrep.dev/orgs/camilo_orrico-personal-org/findings?repo=local_scan/taller-sast&ref=taller-sast/caorrico
- https://semgrep.dev/orgs/camilo_orrico-personal-org/supply-chain/vulnerabilities?repo=local_scan/taller-sast&ref=taller-sast/caorrico

## Resumen del analisis local

Se ejecuto Semgrep con la configuracion automatica:

```bash
semgrep scan --config auto
```

Resultado general del escaneo local ejecutado despues:

- Archivos analizados: 117
- Reglas ejecutadas: 442
- Hallazgos encontrados: 15
- Hallazgos bloqueantes: 15

La diferencia entre ambos resultados se debe a que el escaneo CI/Semgrep Cloud ejecuto muchas mas reglas, incluyendo analisis de plataforma y supply chain, mientras que el escaneo local con `--config auto` ejecuto un conjunto menor de reglas sobre el checkout local.

## Hallazgos reportados

Semgrep reporto las siguientes categorias de hallazgos:

| Severidad | Regla | Archivo |
| --- | --- | --- |
| CRITICAL | `javascript.express.express-child-process.express-child-process` | `apps/analisis-vulnerabilidades/backend/index.js` |
| ERROR | `javascript.lang.security.detect-child-process.detect-child-process` | `apps/analisis-vulnerabilidades/backend/index.js` |
| ERROR | `dockerfile.security.missing-user.missing-user` | `apps/auth-service/Dockerfile` |
| ERROR | `dockerfile.security.missing-user.missing-user` | `apps/frontend/Dockerfile` |
| ERROR | `dockerfile.security.missing-user.missing-user` | `apps/products/Dockerfile` |
| INFO | `javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage` | `apps/analisis-vulnerabilidades/backend/index.js` |
| WARNING | `html.security.audit.missing-integrity.missing-integrity` | `apps/analisis-vulnerabilidades/frontend/index.html` |
| WARNING | `generic.nginx.security.possible-h2c-smuggling.possible-nginx-h2c-smuggling` | `apps/frontend/nginx.conf` |

Nota: algunas reglas aparecen mas de una vez porque Semgrep detecto el mismo patron en varias lineas o bloques del mismo archivo.

## Vulnerabilidad corregida

Se corrigio una sola vulnerabilidad, tal como se solicito:

| Regla | Archivo corregido | Problema |
| --- | --- | --- |
| `dockerfile.security.missing-user.missing-user` | `apps/auth-service/Dockerfile` | El contenedor podia ejecutarse como usuario `root` por no declarar un usuario no privilegiado. |

## Correccion aplicada

En `apps/auth-service/Dockerfile` se agrego:

```dockerfile
USER node
```

Con esto, el contenedor de `auth-service` se ejecuta con el usuario no privilegiado `node`, incluido por defecto en la imagen oficial de Node.

## Verificacion

Despues de aplicar la correccion, se ejecuto Semgrep nuevamente sobre el Dockerfile corregido:

```bash
semgrep scan --config auto apps/auth-service/Dockerfile
```

Resultado:

- Archivo analizado: `apps/auth-service/Dockerfile`
- Hallazgos encontrados: 0
- Hallazgos bloqueantes: 0

## Hallazgos no corregidos

Los demas hallazgos se dejaron sin cambios para cumplir la indicacion de corregir solo una vulnerabilidad.
