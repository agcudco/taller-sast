##  Pruebas Realizadas y Corrección de Errores

Durante la fase de pruebas del sistema se realizó un análisis estático de código utilizando la herramienta **Semgrep** con el objetivo de identificar errores que afectaran la compilación, ejecución y calidad general del proyecto.

### Error Detectado

En el primer escaneo realizado por Semgrep se identificó un error de TypeScript que impedía la construcción correcta de la aplicación dentro del entorno Docker. El error reportado fue el siguiente:

```text
src/contexts/AuthContext.tsx(3,65): error TS6133:
'apiRefresh' is declared but its value is never read.
```

Este mensaje indica que la función o variable `apiRefresh` fue declarada o importada dentro del archivo `AuthContext.tsx`, pero no estaba siendo utilizada en ninguna parte del código. Debido a la configuración del compilador TypeScript, este tipo de errores detienen el proceso de compilación, provocando que el contenedor Docker no pueda iniciar correctamente.

### Análisis del Problema

Al revisar el archivo afectado se encontró una importación similar a la siguiente:

```typescript
import { apiLogin, apiLogout, apiRefresh } from '../services/auth';
```

Se verificó que la función `apiRefresh` no era utilizada dentro del componente, por lo que el compilador generaba automáticamente el error TS6133.

### Solución Implementada

Para solucionar el inconveniente se eliminó la importación innecesaria de `apiRefresh`, manteniendo únicamente las dependencias utilizadas por el módulo de autenticación. Posteriormente se recompiló el proyecto y se ejecutó nuevamente el análisis con Semgrep para validar la corrección.

### Evidencias de las Pruebas

#### Prueba 1: Escaneo Inicial de Errores

Se ejecutó Semgrep sobre el código fuente y se detectó el error TS6133 relacionado con la variable `apiRefresh`, impidiendo la compilación correcta del proyecto.

**Evidencia:** `Escaneo de los errores.png`

#### Prueba 2: Corrección del Código

Se modificó el archivo `AuthContext.tsx`, eliminando la importación que no estaba siendo utilizada y verificando que no existieran dependencias afectadas.

**Evidencia:** `Volver a escanear ya corrigiendo los errores.png`

#### Prueba 3: Validación Posterior

Se ejecutó nuevamente Semgrep después de aplicar la corrección. El análisis confirmó que el error había sido eliminado y que el proyecto podía compilarse correctamente.

**Evidencia:** `Escaneo realizado corregido los errores.png`

### Resultado Obtenido

Después de aplicar la corrección, el sistema completó satisfactoriamente el proceso de compilación y despliegue en Docker. Asimismo, el análisis estático realizado con Semgrep confirmó la eliminación del error detectado.

### Conclusión

Las pruebas realizadas permitieron identificar y corregir oportunamente un error de TypeScript que impedía la ejecución del sistema. Gracias al uso de Semgrep como herramienta de análisis estático, se mejoró la calidad del código y se garantizó el correcto funcionamiento de la aplicación dentro del entorno Docker.
