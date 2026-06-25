# Mateo Sosa

Al realizar la ejecución del archivo [docker-compose](../docker-compose.yml), este daba errores debido a que el archivo [AuthContext](../apps/frontend/src/contexts/AuthContext.tsx) contenía un import inválido o no existente.

Además, se visualizó que existía una carpeta errónea en el archivo de compose, pues buscaba una carpeta _products-service_ la cual no existía, sino que fue renombrada a _products_.

## Escaneo de Vulnerabilidades sin Refactorizar

┌──────────────┐
│ Scan Summary │
└──────────────┘
✅ Scan completed successfully.
 • Findings: 18 (18 blocking)
 • Rules run: 442
 • Targets scanned: 115
 • Parsed lines: ~100.0%
 • Scan skipped: 
   ◦ Files matching .semgrepignore patterns: 4
 • Scan was limited to files tracked by git
 • For a detailed list of skipped files and lines, run semgrep with the --verbose flag
Ran 442 rules on 115 files: 18 findings.

## Error a refactorizar

docker-compose.yml:

❯❱ yaml.docker-compose.security.no-new-privileges.no-new-privileges
      ❰❰ Blocking ❱❱
      Service 'auth-db' allows for privilege escalation via setuid or setgid binaries. Add 'no-new-
      privileges:true' in 'security_opt' to prevent this.                                          
      Details: https://sg.run/0n8q
        4┆ auth-db:

## Refactorización

Se modifica el archivo de docker-compose para añadir la opción de seguridad que sugiere la herramienta _semgrep_.
El archivo modificado es el [docker-compose](../docker-compose.yml).

## Ejecución Final

──────────────┐
│ Scan Summary │
└──────────────┘
✅ Scan completed successfully.
 • Findings: 17 (17 blocking)
 • Rules run: 442
 • Targets scanned: 115
 • Parsed lines: ~100.0%
 • Scan skipped: 
   ◦ Files matching .semgrepignore patterns: 4
 • Scan was limited to files tracked by git
 • For a detailed list of skipped files and lines, run semgrep with the --verbose flag
Ran 442 rules on 115 files: 17 findings.

Como se puede observar, se añadió una nueva regla para el servicio de base de datos de _auth_.
Esta nueva regla redujo una vulnerabilidad final de las 18.

Este tipo de error es un Misconfiguration Configuration de Owasp.
