# Pasos del taller

Lista de lo que hice para el taller SAST.

## 1. Rama de trabajo

```bash
git checkout -b taller_sast/jatoscano6
```

## 2. Escaneo con Semgrep

```bash
semgrep scan --config=auto apps/
semgrep scan --config=auto apps/ --json -o TallerToscano/semgrep/semgrep-report-inicial.json
```

Salieron 14 hallazgos. Los anoté en `cambios/hallazgos-semgrep.md`.

## 3. Documentación

Armé esta carpeta `TallerToscano/` con el resumen, los JSON y la explicación de los cambios.

## 4. Corrección de vulnerabilidad

Corregí SQL Injection en `apps/analisis-vulnerabilidades/backend/index.js`.

Detalle en `cambios/sql-injection.md`.

## 5. Docker Compose

Corregí la ruta del servicio de productos en `docker-compose.yml`.

Detalle en `cambios/docker-compose.md`.

Comandos para probar:

```bash
docker compose up --build -d
docker compose ps
docker compose exec auth-service node dist/seeds/seed.js
docker compose down
docker compose up -d
```

Credenciales del README principal del repo:
- admin@example.com / Admin12345
- cliente@example.com / Cliente123

## 6. Re-escaneo

```bash
semgrep scan --config=auto apps/
semgrep scan --config=auto apps/ --json -o TallerToscano/semgrep/semgrep-report-final.json
```

Quedaron 10 hallazgos (antes 14).

## 7. Subir cambios

```bash
git add .
git commit -m "taller sast: corrijo sqli y docker-compose"
git push -u origin taller_sast/jatoscano6
```
