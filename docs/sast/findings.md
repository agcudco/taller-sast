# Hallazgos de Análisis Estático de Seguridad (SAST) — Semgrep

## Resumen del escaneo

- **Herramienta:** Semgrep CLI (`semgrep scan --config auto .`)
- **Reglas ejecutadas:** 442
- **Archivos analizados:** 115
- **Hallazgos totales:** 18 (18 bloqueantes)

## Listado de vulnerabilidades encontradas

| # | Archivo | Línea | Regla | Severidad | Descripción |
|---|---------|-------|-------|-----------|--------------|
| 1 | `apps/analisis-vulnerabilidades/backend/index.js` | 7 | express-check-csurf-middleware-usage | Alta | Falta middleware de protección CSRF en la app Express |
| 2 | `apps/analisis-vulnerabilidades/backend/index.js` | 53 | console-log-express | Media | Log injection: input de usuario no neutralizado en `console.log` |
| 3 | `apps/analisis-vulnerabilidades/backend/index.js` | 54 | express-sqlite-sqli | **Alta** | **SQL Injection** en `/api/categories/search` por concatenación directa del parámetro `name` |
| 4 | `apps/analisis-vulnerabilidades/backend/index.js` | 101 | console-log-express | Media | Log injection en `/api/products/search` |
| 5 | `apps/analisis-vulnerabilidades/backend/index.js` | 102 | express-sqlite-sqli | **Alta** | **SQL Injection** en `/api/products/search` por concatenación directa del parámetro `name` |
| 6 | `apps/analisis-vulnerabilidades/backend/index.js` | 154 | express-child-process | Crítica | Command Injection en `/api/exec`: el comando recibido por query string se ejecuta directamente con `exec()` |
| 7 | `apps/analisis-vulnerabilidades/backend/index.js` | 154 | detect-child-process | Crítica | Detección genérica de uso de `child_process` con input controlable por el usuario |
| 8 | `apps/analisis-vulnerabilidades/frontend/index.html` | 8, 100 | missing-integrity | Baja | Recursos cargados desde CDN sin atributo `integrity` (Subresource Integrity) |
| 9 | `apps/auth-service/Dockerfile` | 25 | missing-user | Media | El contenedor no define un `USER` no-root, por lo que el proceso corre como `root` |
| 10 | `apps/frontend/Dockerfile` | 23 | missing-user | Media | El contenedor no define un `USER` no-root |
| 11 | `apps/products/Dockerfile` | 22 | missing-user | Media | El contenedor no define un `USER` no-root |
| 12 | `apps/frontend/nginx.conf` | 16-18, 25-27 | possible-nginx-h2c-smuggling | Media | Configuración de proxy vulnerable a H2C smuggling |
| 13 | `docker-compose.yml` | 4 | no-new-privileges (auth-db) | Media | Servicio `auth-db` permite escalación de privilegios vía binarios setuid/setgid |
| 14 | `docker-compose.yml` | 4 | writable-filesystem-service (auth-db) | Baja | Servicio `auth-db` corre con sistema de archivos raíz de escritura |
| 15 | `docker-compose.yml` | 21 | no-new-privileges (product-db) | Media | Servicio `product-db` permite escalación de privilegios vía binarios setuid/setgid |
| 16 | `docker-compose.yml` | 21 | writable-filesystem-service (product-db) | Baja | Servicio `product-db` corre con sistema de archivos raíz de escritura |

> Nota: 18 hallazgos totales reportados por Semgrep; algunos comparten línea de código (ej. #6 y #7) por ser detectados por reglas distintas sobre el mismo patrón.

## Vulnerabilidad corregida

### SQL Injection — `/api/categories/search` (línea 54)

**Antes:**
```javascript
app.get('/api/categories/search', (req, res) => {
  const searchTerm = req.query.name || '';
  // Concatenación directa -> SQLi
  const query = `SELECT * FROM categories WHERE name LIKE '%${searchTerm}%'`;
  console.log('[SQLi Categories]', query);
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
```

**Después:**
```javascript
app.get('/api/categories/search', (req, res) => {
  const searchTerm = req.query.name || '';
  // Query parametrizada: el valor del usuario nunca se concatena al SQL
  const query = 'SELECT * FROM categories WHERE name LIKE ?';
  db.all(query, [`%${searchTerm}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
```

**Justificación técnica:**
El valor recibido en `req.query.name` se concatenaba directamente dentro del string SQL, permitiendo que un atacante inyectara cláusulas SQL arbitrarias (ej. `' OR '1'='1`) para alterar el comportamiento de la consulta, extraer datos no autorizados o, dependiendo del motor, ejecutar comandos adicionales. La corrección usa un **prepared statement** con placeholder (`?`), donde el driver `sqlite3` trata el valor de entrada estrictamente como dato y no como parte del código SQL, eliminando la posibilidad de inyección. Como efecto secundario, también se eliminó el `console.log` que exponía la query cruda (mitigando además el hallazgo de log injection en la misma línea).

## Resultado esperado tras la corrección

Al volver a ejecutar `semgrep scan --config auto .`, el hallazgo `express-sqlite-sqli` correspondiente a la línea 54 ya no debe aparecer, reduciendo el conteo total de 18 a 17 hallazgos (también desaparece el hallazgo de `console-log-express` asociado a la misma línea, por lo que el total puede bajar a 16).
