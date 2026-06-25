# Taller SAST - jatoscano6

Trabajo del taller de Software Seguro. Analicé el repo `taller-sast` con Semgrep y corregí una vulnerabilidad.

**Estudiante:** Alejandro Toscano  
**Rama:** `taller_sast/jatoscano6`  
**Fecha:** 25/06/2026

## Qué hay en esta carpeta

- `RESUMEN-ANALISIS.md` - lo que encontré con Semgrep y qué cambié
- `PASOS-TALLER.md` - pasos que seguí del taller
- `semgrep/` - reportes JSON antes y después de la corrección
- `cambios/` - detalle de los cambios en código

## Comandos que usé

Instalé Semgrep con Homebrew:

```bash
brew install semgrep
semgrep --version
```

Escaneo del proyecto:

```bash
cd taller-sast
semgrep scan --config=auto apps/
```

Para subir resultados a la web de Semgrep tuve que usar `--oss-only` porque me fallaba el motor Pro:

```bash
semgrep login
semgrep ci --oss-only
```

## Cambios que hice

1. SQL Injection en `apps/analisis-vulnerabilidades/backend/index.js` (búsqueda de categorías y productos)
2. Ruta incorrecta en `docker-compose.yml` (`product-service` apuntaba a una carpeta que no existe)

## Docker

```bash
docker compose up --build -d
docker compose ps
docker compose exec auth-service node dist/seeds/seed.js
```

Frontend: http://localhost  
Usuario: admin@example.com / Admin12345

Probé bajar y volver a subir y sigue funcionando:

```bash
docker compose down
docker compose up -d
```

**Correcciones extra que tuve que hacer para que levante:**
- Ruta `./apps/products` en el compose (antes decía `product-service`)
- Variable `PORT: 3000` en auth-service y product-service (si no, auth quedaba en 8000)
- Node 20 en los Dockerfiles (Nest 11 pide node >= 20)
- Quité un import sin usar en `AuthContext.tsx` que rompía el build del frontend

## Resultados Semgrep

| Escaneo | Hallazgos |
|---------|-----------|
| Inicial | 14 |
| Después de corregir | 10 |
