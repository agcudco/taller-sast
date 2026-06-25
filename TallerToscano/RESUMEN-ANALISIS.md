# Resumen del análisis

Corri Semgrep sobre la carpeta `apps/` con:

```bash
semgrep scan --config=auto apps/
```

## Resultado inicial

Encontré **14 hallazgos**. Lo más importante estaba en `apps/analisis-vulnerabilidades`:

- SQL Injection en los endpoints de búsqueda
- Command Injection en `/api/exec` (parece intencional para la demo)
- Falta de CSRF en Express
- Algunos warnings en Dockerfiles y nginx

El reporte completo está en `semgrep/semgrep-report-inicial.json`.

## Vulnerabilidad que corregí

Elegí la **SQL Injection** porque era clara y estaba en código que yo podía arreglar sin romper el resto del taller.

**Archivo:** `apps/analisis-vulnerabilidades/backend/index.js`  
**Endpoints:** `/api/categories/search` y `/api/products/search`

El problema era que el parámetro `name` se metía directo en la query:

```javascript
const query = `SELECT * FROM categories WHERE name LIKE '%${searchTerm}%'`;
```

Con algo como `name=' OR '1'='1` se podía manipular la consulta.

Lo cambié a consulta parametrizada:

```javascript
const query = 'SELECT * FROM categories WHERE name LIKE ?';
db.all(query, [`%${searchTerm}%`], (err, rows) => { ... });
```

Hice lo mismo en la búsqueda de productos. También quité los `console.log` que imprimían la query armada.

Después de corregir, volví a escanear y bajó a **10 hallazgos**. Se fueron los 4 relacionados con SQLi y esos logs.

## Docker Compose

Al intentar levantar la app vi que `docker-compose.yml` tenía:

```yaml
build: ./apps/product-service
```

Pero la carpeta real es `apps/products`. Corregí eso y quité `version: '3.8'` que ya no hace falta.

## Lo que dejé pendiente

- Command Injection en `/api/exec`
- XSS en el frontend (innerHTML)
- CSRF
- Dockerfiles corriendo como root

No los toqué porque el taller pedía corregir una vulnerabilidad y que la app siguiera funcionando.
