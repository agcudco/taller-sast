# Correcciones Aplicadas para la Ejecución del Proyecto

**Autor:** David Moran  
**Proyecto:** Taller SAST — Monorepo con microservicios NestJS, frontend React y análisis estático con Semgrep

---

Este documento detalla los problemas encontrados durante el proceso de configuración y despliegue del monorepo, así como las soluciones aplicadas para lograr que todos los servicios (`auth-service`, `product-service`, `frontend` y las bases de datos PostgreSQL) se ejecutaran de forma correcta mediante Docker Compose.

---

## 1. Ruta de Construcción Incorrecta en `product-service`

**Archivo afectado:** `docker-compose.yml`

El contexto de construcción del servicio `product-service` apuntaba a `./apps/product-service`, pero el directorio real dentro del monorepo es `./apps/products`. Al no existir la ruta indicada, Docker fallaba inmediatamente durante el build sin generar imagen alguna.

```diff
  product-service:
-    build: ./apps/product-service
+    build: ./apps/products
```

---

## 2. Error de Compilación TypeScript por Import No Utilizado en el Frontend

**Archivo afectado:** `apps/frontend/src/contexts/AuthContext.tsx`

La construcción de la imagen de producción del frontend fallaba durante `npm run build` porque TypeScript, con la regla `noUnusedLocals` activa, rechazaba un import declarado que no se llegaba a usar en ningún punto del archivo:

```
error TS6133: 'apiRefresh' is declared but its value is never read.
```

Se eliminó el import innecesario para que la compilación pudiera completarse:

```diff
-import { login as apiLogin, register as apiRegister, refresh as apiRefresh } from '../api/auth';
+import { login as apiLogin, register as apiRegister } from '../api/auth';
```

---

## 3. Versión de Node.js Incompatible con NestJS 11 y Vite 8

**Archivos afectados:**  
- `apps/frontend/Dockerfile`  
- `apps/auth-service/Dockerfile`  
- `apps/products/Dockerfile`

Los Dockerfiles usaban `node:18-alpine` como imagen base. Las versiones actuales de Vite 8 y NestJS 11 requieren Node.js 20 o superior. En Node 18, Vite lanzaba el error `ReferenceError: CustomEvent is not defined`, bloqueando la build por completo.

Se actualizó la imagen base en los tres Dockerfiles:

```diff
-FROM node:18-alpine AS build
+FROM node:22-alpine AS build
```

---

## 4. Puerto Interno de los Microservicios Desalineado con la Configuración de Nginx

**Archivo afectado:** `docker-compose.yml`

El proxy inverso configurado en Nginx esperaba que los backends respondieran en el puerto `3000` dentro de sus contenedores. Sin embargo, `auth-service` usaba `process.env.PORT ?? 8000` y `product-service` usaba `process.env.PORT ?? 3001` como valores por defecto. Al no haber ninguna variable de entorno `PORT` definida en Docker Compose, ambos servicios se levantaban en puertos distintos al esperado, causando errores de conexión.

Se declaró explícitamente `PORT: 3000` en los dos servicios:

```diff
  auth-service:
    environment:
+     PORT: 3000
      DB_HOST: auth-db

  product-service:
    environment:
+     PORT: 3000
      DB_HOST: product-db
```

---

## 5. Conflicto de Puerto del Frontend con Servicios Locales del Sistema

**Archivo afectado:** `docker-compose.yml`

El frontend estaba mapeado al puerto `80` del host, que ya estaba ocupado por Apache (AppServ). Al intentar cambiarlo a `8080`, ese puerto también estaba en uso por XAMPP. Para evitar conflictos con cualquier servidor web local preexistente, se reasignó el mapeo a un puerto sin conflictos:

```diff
  frontend:
    ports:
-     - "80:80"
+     - "3005:80"
```

---

## 6. Peticiones del Frontend Bloqueadas por CORS

**Archivo afectado:** `docker-compose.yml`

Con el frontend corriendo en `http://localhost:3005`, las peticiones hacia los backends en los puertos `3000` y `3001` eran bloqueadas por el navegador. El backend no tenía definida la variable `ALLOWED_ORIGINS`, por lo que la cabecera `Access-Control-Allow-Origin` no era incluida en las respuestas y el browser rechazaba las llamadas.

Se añadió la variable en ambos servicios backend:

```diff
    environment:
      PORT: 3000
+     ALLOWED_ORIGINS: http://localhost:3005,http://localhost:3000,http://localhost:3001,http://localhost:5173
```

---

## 7. Ruta Base y Lógica Incorrectas en el Controlador de Productos

**Archivo afectado:** `apps/products/src/product/product.controller.ts`

El controlador tenía `@Controller('product')` como ruta base, mientras que el frontend enviaba peticiones a `/products`. Esto generaba respuestas `404` en todas las operaciones sobre productos. Adicionalmente, existía un decorador `@Post()` duplicado y los IDs de tipo UUID se casteaban innecesariamente a número con `+id`.

```diff
-@Controller('product')
+@Controller('products')
 export class ProductController {
-  @Post()
   @Post()
   ...
   @Get(':id')
   findOne(@Param('id') id: string) {
-    return this.productService.findOne(+id);
+    return this.productService.findOne(id);
   }
```

---

## 8. Entidad `Category` Faltante en el Módulo de Productos

**Archivo afectado:** `apps/products/src/product/product.module.ts`

El módulo de productos solo registraba la entidad `Product` en `TypeOrmModule.forFeature`. Al intentar inyectar el repositorio de `Category` en el servicio, NestJS lanzaba un error de resolución de dependencias al arrancar el contenedor.

```diff
-  imports: [TypeOrmModule.forFeature([Product]), CategoryModule, AuthModule],
+  imports: [TypeOrmModule.forFeature([Product, Category]), CategoryModule, AuthModule],
```

---

## 9. Servicio de Productos sin Implementación Real (Solo Scaffold)

**Archivo afectado:** `apps/products/src/product/product.service.ts`

El archivo contenía únicamente el código autogenerado por el CLI de NestJS, devolviendo strings estáticos en lugar de interactuar con la base de datos. Ninguna operación sobre productos se persistía ni se recuperaba correctamente.

Se reescribió el servicio completo con TypeORM, incluyendo:

- Inyección de los repositorios de `Product` y `Category`.
- Validación de nombre duplicado al momento de crear un producto.
- Resolución de la relación con categorías a partir del `categoryId` recibido en el DTO.
- Carga de relaciones con el formato de objeto (`relations: { category: true }`) compatible con TypeORM v1.x.

---

## 10. Vulnerabilidad de Command Injection en el Endpoint `/api/exec`

**Archivo afectado:** `apps/analisis-vulnerabilidades/backend/index.js`  
**Regla Semgrep:** `javascript.express.express-child-process` / `tainted-os-command-child-process`

El endpoint recibía un parámetro `cmd` directamente desde la query string y lo ejecutaba sin ningún tipo de validación mediante `exec()`. Esto constituye una vulnerabilidad crítica de ejecución remota de comandos (RCE), ya que cualquier usuario podría enviar instrucciones arbitrarias al sistema operativo del servidor.

**Código vulnerable:**

```js
app.get('/api/exec', (req, res) => {
  const cmd = req.query.cmd || '';
  exec(cmd, (error, stdout, stderr) => {
    res.json({ stdout, stderr });
  });
});
```

**Corrección aplicada:**

Se sustituyó `exec()` por `execFile()` y se definió una lista blanca de comandos permitidos. El endpoint ahora rechaza cualquier entrada que no corresponda a una clave válida dentro del mapa de comandos controlados:

```js
const { execFile } = require('child_process');

const allowed = {
  date: ['date'],
  list: ['ls', '-la']
};

app.get('/api/exec', (req, res) => {
  const cmd = req.query.cmd;

  if (!allowed.hasOwnProperty(cmd)) {
    return res.status(400).json({ error: 'Comando no permitido' });
  }

  execFile(allowed[cmd][0], allowed[cmd].slice(1), (error, stdout, stderr) => {
    if (error) {
      return res.json({ error: error.message, stderr });
    }
    res.json({ stdout, stderr });
  });
});
```

Con esta corrección, el flujo de datos contaminado (taint) queda interrumpido antes de llegar al proceso hijo. Semgrep deja de reportar la vulnerabilidad como bloqueante y el pipeline de CI continúa sin interrupciones.

---

## Estado Final del Proyecto

- Todos los servicios compilan y arrancan correctamente mediante `docker compose up -d --build`.
- Las bases de datos inicializan su esquema de forma automática al primer arranque.
- El frontend es accesible en `http://localhost:3005/`.
- El registro e inicio de sesión operan correctamente contra `auth-service` en `http://localhost:3000/`.
- La gestión completa de productos (crear, listar, actualizar, eliminar) funciona contra `product-service` en `http://localhost:3001/products`.
- El análisis SAST con Semgrep se ejecuta de forma exitosa y los resultados se publican en Semgrep Cloud Platform sin bloquear el pipeline.