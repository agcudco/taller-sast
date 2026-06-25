# Errores Corregidos para Levantar el Proyecto

Este documento resume los problemas identificados y solucionados para lograr levantar el monorepo y todos sus servicios (`auth-service`, `product-service`, `frontend` y las bases de datos PostgreSQL) mediante Docker Compose de forma correcta.

---

## 1. Ruta Incorrecta de Construcción (Build Context) en `product-service`
* **Archivo afectado:** [docker-compose.yml](file:///c:/Users/Abner/Desktop/Semestre1-2026/softareSeguro/Unidad3/taller-sast/docker-compose.yml)
* **Descripción:** 
  La configuración de Docker Compose para el servicio `product-service` especificaba que el contexto de construcción estaba en `./apps/product-service`. Sin embargo, la carpeta correspondiente al microservicio de productos en el monorepo se llama **`products`** (`./apps/products`). Esto causaba que la compilación de la imagen Docker fallara inmediatamente al no encontrar el directorio.
* **Solución:**
  Se actualizó el parámetro `build` del servicio `product-service` apuntándolo a la ruta correcta.

```diff
  product-service:
-    build: ./apps/product-service
+    build: ./apps/products
     container_name: product-service
```

---

## 2. Error de Compilación TypeScript en el Frontend (Unused Local)
* **Archivo afectado:** [AuthContext.tsx](file:///c:/Users/Abner/Desktop/Semestre1-2026/softareSeguro/Unidad3/taller-sast/apps/frontend/src/contexts/AuthContext.tsx)
* **Descripción:**
  Durante la fase de construcción de la imagen de producción del frontend, el comando `npm run build` fallaba debido a que la regla `noUnusedLocals` (o similar) de TypeScript denegaba la compilación al detectar un import declarado que nunca era leído:
  ```text
  src/contexts/AuthContext.tsx(3,65): error TS6133: 'apiRefresh' is declared but its value is never read.
  ```
* **Solución:**
  Se retiró el import no utilizado `refresh as apiRefresh` de la línea 3 del archivo.

```diff
-import { login as apiLogin, register as apiRegister, refresh as apiRefresh } from '../api/auth';
+import { login as apiLogin, register as apiRegister } from '../api/auth';
```

---

## 3. Incompatibilidad de Motores (Node.js Engine Conflicts) con NestJS 11 y Vite 8
* **Archivos afectados:** 
  * [apps/frontend/Dockerfile](file:///c:/Users/Abner/Desktop/Semestre1-2026/softareSeguro/Unidad3/taller-sast/apps/frontend/Dockerfile)
  * [apps/auth-service/Dockerfile](file:///c:/Users/Abner/Desktop/Semestre1-2026/softareSeguro/Unidad3/taller-sast/apps/auth-service/Dockerfile)
  * [apps/products/Dockerfile](file:///c:/Users/Abner/Desktop/Semestre1-2026/softareSeguro/Unidad3/taller-sast/apps/products/Dockerfile)
* **Descripción:**
  Los Dockerfiles originales utilizaban la imagen base `node:18-alpine`. Al compilar el frontend con Vite 8 y los backends con NestJS 11, se producían advertencias y errores críticos debido a que las dependencias modernas requieren Node.js versión `20` o superior (por ejemplo, Vite fallaba con `ReferenceError: CustomEvent is not defined` en Node 18).
* **Solución:**
  Se actualizaron las imágenes base de los contenedores de Node.js a **`node:22-alpine`** para asegurar total compatibilidad.

```diff
# Ejemplo en los Dockerfiles
-FROM node:18-alpine AS build
+FROM node:22-alpine AS build
```

---

## 4. Conflicto y Desalineación de Puertos Internos de los Microservicios
* **Archivo afectado:** [docker-compose.yml](file:///c:/Users/Abner/Desktop/Semestre1-2026/softareSeguro/Unidad3/taller-sast/docker-compose.yml)
* **Descripción:**
  El proxy inverso de Nginx (`frontend/nginx.conf`) y las configuraciones de docker-compose asumían que las aplicaciones NestJS escucharían en el puerto **`3000`** dentro de sus respectivos contenedores. Sin embargo:
  * El código de NestJS de `auth-service` escuchaba en `process.env.PORT ?? 8000`.
  * El código de NestJS de `product-service` escuchaba en `process.env.PORT ?? 3001`.
  
  Al no tener configurada la variable de entorno `PORT` en `docker-compose.yml`, los servicios se levantaban internamente en los puertos `8000` y `3001`. Por lo tanto, el mapeo de puertos y la redirección de Nginx a través del puerto `3000` fallaban con errores de conexión.
* **Solución:**
  Se agregó la variable de entorno `PORT: 3000` en la configuración de ambos servicios de backend dentro del archivo `docker-compose.yml`.

```diff
  auth-service:
    build: ./apps/auth-service
    container_name: auth-service
    ports:
      - "3000:3000"
    environment:
+     PORT: 3000
      DB_HOST: auth-db
      ...

  product-service:
    build: ./apps/products
    container_name: product-service
    ports:
      - "3001:3000"
    environment:
+     PORT: 3000
      DB_HOST: product-db
      ...
```

---

## 5. Conflicto de los Puertos 80 y 8080 del Frontend con Servidores Locales Activos (Apache/AppServ/XAMPP)
* **Archivo afectado:** [docker-compose.yml](file:///c:/Users/Abner/Desktop/Semestre1-2026/softareSeguro/Unidad3/taller-sast/docker-compose.yml)
* **Descripción:**
  El frontend de Docker Compose originalmente estaba mapeado para responder en el puerto de host `80`. Sin embargo, en el sistema del usuario ya existía un servidor web Apache (AppServ) corriendo en el puerto `80`. Al intentar cambiar al puerto `8080`, se detectó otro servidor Apache (XAMPP) ocupando ese puerto. Esto impedía visualizar el frontend de la aplicación.
* **Solución:**
  Se modificó el mapeo de puertos del host del contenedor `frontend` a **`3005:80`** en el archivo `docker-compose.yml` para evitar cualquier conflicto con servicios locales comunes.

```diff
  frontend:
    build: ./apps/frontend
    container_name: frontend
    ports:
-     - "80:80"
+     - "3005:80"
```

---

## 6. Peticiones de API Bloqueadas por Política de CORS
* **Archivo afectado:** [docker-compose.yml](file:///c:/Users/Abner/Desktop/Semestre1-2026/softareSeguro/Unidad3/taller-sast/docker-compose.yml)
* **Descripción:**
  El frontend (que ahora corre en `http://localhost:3005`) realiza peticiones directamente a los microservicios en `http://localhost:3000` y `http://localhost:3001`. Sin embargo, al no estar definida la variable de entorno `ALLOWED_ORIGINS` en el backend, la configuración de CORS fallaba y el navegador bloqueaba las llamadas de red por seguridad (error: `No 'Access-Control-Allow-Origin' header is present`).
* **Solución:**
  Se agregó la variable de entorno `ALLOWED_ORIGINS` en `docker-compose.yml` para habilitar el acceso explícito desde el origen del frontend y puertos de desarrollo comunes.

```diff
  # En auth-service y product-service:
    environment:
      PORT: 3000
+     ALLOWED_ORIGINS: http://localhost:3005,http://localhost:3000,http://localhost:3001,http://localhost:5173
```

---

## 7. Desajuste de Rutas e ID en el Controlador de Productos
* **Archivo afectado:** [product.controller.ts](file:///c:/Users/Abner/Desktop/Semestre1-2026/softareSeguro/Unidad3/taller-sast/apps/products/src/product/product.controller.ts)
* **Descripción:**
  * El controlador de productos tenía la ruta base `@Controller('product')`, pero el frontend realiza peticiones hacia `/products` (puerto `3001`). Esto generaba errores `404 Not Found` en el navegador al intentar cargar o modificar productos.
  * Tenía un decorador `@Post()` duplicado en la creación de productos.
  * Los parámetros de ID de ruta (`:id`) se recibían como `string`, pero se casteaban de forma innecesaria a `number` (`+id`) antes de pasarlos al servicio, a pesar de que los identificadores de la entidad son de tipo UUID (cadenas de texto).
* **Solución:**
  * Se corrigió la ruta base del controlador a `@Controller('products')`.
  * Se eliminó el decorador `@Post()` duplicado.
  * Se ajustaron los métodos para pasar directamente el `id` como `string` al servicio sin el casteo numérico.

```diff
-@Controller('product')
+@Controller('products')
 export class ProductController {
   ...
-  @Post()
   // Solo operadores pueden crear productos
   @Post()
   ...
   @Get(':id')
   findOne(@Param('id') id: string) {
-    return this.productService.findOne(+id);
+    return this.productService.findOne(id);
   }
```

---

## 8. Repositorio de Categorías no Registrado en el Módulo de Productos
* **Archivo afectado:** [product.module.ts](file:///c:/Users/Abner/Desktop/Semestre1-2026/softareSeguro/Unidad3/taller-sast/apps/products/src/product/product.module.ts)
* **Descripción:**
  El microservicio requiere la relación entre `Product` y `Category`. Sin embargo, `product.module.ts` solo registraba el repositorio de `Product` en `TypeOrmModule.forFeature([Product])`. Al intentar inyectar el repositorio de `Category` en `ProductService`, NestJS lanzaba un error de resolución de dependencias durante el inicio de la aplicación.
* **Solución:**
  Se importó y agregó la entidad `Category` dentro del `TypeOrmModule.forFeature` en la sección de imports del módulo de productos.

```diff
 @Module({
-  imports: [TypeOrmModule.forFeature([Product]), CategoryModule, AuthModule],
+  imports: [TypeOrmModule.forFeature([Product, Category]), CategoryModule, AuthModule],
   controllers: [ProductController],
```

---

## 9. Servicio de Productos Vacío (Scaffold Inicial)
* **Archivo afectado:** [product.service.ts](file:///c:/Users/Abner/Desktop/Semestre1-2026/softareSeguro/Unidad3/taller-sast/apps/products/src/product/product.service.ts)
* **Descripción:**
  El archivo `product.service.ts` contenía únicamente una plantilla autogenerada por NestJS que retornaba strings fijos (por ejemplo, `This action returns all product`). No existía comunicación real con la base de datos PostgreSQL, lo que impedía que los productos creados se guardaran o que se listaran en la interfaz del frontend.
* **Solución:**
  Se reescribió por completo el servicio para implementar los métodos CRUD utilizando TypeORM:
  * Inyección del repositorio de `Product` y `Category`.
  * Validación de duplicados por nombre al crear productos.
  * Relación con categorías resolviendo la ID de categoría indicada en el DTO (`categoryId`).
  * Consultas configuradas para cargar la relación de categorías (`relations: { category: true }`) de forma segura y compatible con TypeORM v1.x (usando el formato de objeto en lugar del arreglo de strings deprecado).

---

## Estado Actual
* Todos los servicios compilan e inicializan de manera correcta y saludable.
* Las bases de datos configuran su esquema automáticamente.
* El **frontend** funciona en **`http://localhost:3005/`**.
* El inicio de sesión y registro de usuarios funciona mediante `auth-service` en `http://localhost:3000/`.
* La creación, actualización, eliminación y listado de productos se realiza correctamente contra `product-service` en `http://localhost:3001/products` con soporte total de base de datos.
