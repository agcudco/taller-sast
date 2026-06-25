# Guía Paso a Paso: Análisis, Mitigación de Vulnerabilidades y Dockerización

Esta guía documenta detalladamente el proceso para analizar el repositorio con **Semgrep**, identificar y corregir vulnerabilidades de seguridad, ajustar la configuración de infraestructura de **Docker Compose** y levantar la aplicación correctamente.

---

## Paso 1: Ejecutar el Análisis de Seguridad con Semgrep

Para auditar el código en busca de vulnerabilidades (SAST), se utiliza Semgrep. Ejecuta el siguiente comando en la raíz del proyecto:

```bash
semgrep ci
```
*O también puedes usar:*
```bash
semgrep scan
```

### Resultados del Análisis Inicial
Semgrep identificó varios hallazgos críticos en la aplicación de demostración `apps/analisis-vulnerabilidades/backend/index.js`:
1. **Inyección SQL (SQL Injection)** en las rutas `/api/categories/search` y `/api/products/search`.
2. **Inyección de Comandos (Command Injection)** en la ruta `/api/exec`.
3. **CORS Permisivo** configurado como `origin: '*'`.

---

## Paso 2: Corrección de las Vulnerabilidades Detectadas

Hemos modificado el código en [index.js](file:///D:/Septimo%20Semestre/Desarrollo%20de%20Sotfware/P3/Taller/taller-sast/apps/analisis-vulnerabilidades/backend/index.js) de la siguiente manera:

### 1. Inyección SQL (SQLi)
* **Código Vulnerable original (Concatenación de strings):**
  ```javascript
  const query = `SELECT * FROM categories WHERE name LIKE '%${searchTerm}%'`;
  db.all(query, (err, rows) => { ... });
  ```
* **Solución aplicada (Consultas Parametrizadas / Prepared Statements):**
  Al parametrizar las consultas usando el marcador de posición `?`, la base de datos trata el input del usuario estrictamente como datos, neutralizando cualquier intento de inyectar comandos SQL maliciosos:
  ```javascript
  const query = `SELECT * FROM categories WHERE name LIKE ?`;
  const likeTerm = `%${searchTerm}%`;
  db.all(query, [likeTerm], (err, rows) => { ... });
  ```

### 2. Inyección de Comandos (Command Injection)
* **Código Vulnerable original (Ejecución libre de comandos):**
  ```javascript
  const cmd = req.query.cmd || '';
  exec(cmd, (error, stdout, stderr) => { ... });
  ```
* **Solución aplicada (Lista Blanca Estricta / Validation Whitelist):**
  Nunca se debe permitir la ejecución de comandos arbitrarios proveídos por el usuario. Implementamos una validación estricta que solo permite comandos exactos y previamente aprobados:
  ```javascript
  const cmd = (req.query.cmd || '').trim();
  const allowedCommands = ['whoami', 'date', 'uptime'];

  if (!allowedCommands.includes(cmd)) {
    return res.status(400).json({ 
      error: 'Comando denegado. Solo se permiten: whoami, date, uptime' 
    });
  }
  exec(cmd, (error, stdout, stderr) => { ... });
  ```

---

## Paso 3: Corrección de Puertos e Infraestructura en Docker Compose

Al revisar el archivo [docker-compose.yml](file:///D:/Septimo%20Semestre/Desarrollo%20de%20Sotfware/P3/Taller/taller-sast/docker-compose.yml), se detectaron y corrigieron fallos de configuración críticos que impedían levantar y conectar los servicios:

1. **Ruta del Microservicio de Productos Incorrecta**:
   - Originalmente apuntaba a `./apps/product-service`, que no existía.
   - Se actualizó a `./apps/products` para coincidir con la estructura del monorepo.

2. **Desalineación de Puertos (Bugs de Conexión en Nginx)**:
   - Nginx (en el frontend) busca los microservicios en el puerto `3000` (e.g. `http://auth-service:3000` y `http://product-service:3000`).
   - Sin embargo, las aplicaciones NestJS venían configuradas para escuchar en `PORT ?? 8000` (auth-service) y `PORT ?? 3001` (products) si la variable de entorno `PORT` no existía.
   - **Solución:** Se añadió la variable de entorno `PORT: 3000` en la configuración de ambos servicios dentro del `docker-compose.yml` para forzar que escuchen internamente en el puerto esperado.

---

## Paso 4: Levantar y Validar la Aplicación con Docker Compose

Sigue estos pasos en tu terminal para compilar, levantar y verificar el correcto funcionamiento de los servicios:

### 1. Construir e iniciar contenedores en segundo plano:
```bash
docker-compose up --build -d
```

### 2. Verificar el estado de los contenedores:
```bash
docker-compose ps
```
Asegúrate de que todos los contenedores (`auth-db`, `product-db`, `auth-service`, `product-service`, `frontend`) estén en estado **Up**.

### 3. Ejecutar la semilla de base de datos (Crear usuarios iniciales):
```bash
docker-compose exec auth-service node dist/seeds/seed.js
```

### 4. Acceder al Frontend:
Abre tu navegador e ingresa a `http://localhost`. Puedes usar las siguientes credenciales para probar:

| Rol | Email | Contraseña |
| :--- | :--- | :--- |
| **Operador** | admin@example.com | Admin12345 |
| **Cliente** | cliente@example.com | Cliente123 |

### 5. Detener los servicios:
```bash
docker-compose down
```
*(Si deseas borrar también las bases de datos para reiniciar de cero, usa `docker-compose down -v`)*.
