import { webcrypto } from 'crypto';

if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = webcrypto;
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //cabeceres de seguridad
  app.use(helmet())


  //CORS restringido
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: false
  })



  // Filtro global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  //validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, //rechaza peticiones con campos desconocidos
      transform: true, //convierte automaticamente los tipos
      transformOptions: { enableImplicitConversion: true }, //convierte tipos automaticamente
    })
  )


  await app.listen(process.env.PORT ?? 3001);
  console.log('Application is running on port', process.env.PORT ?? 3001)
}
bootstrap();

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Tema visual de PrimeReact (puedes cambiar el tema)
import 'primereact/resources/themes/lara-light-blue/theme.css';

// Core CSS de PrimeReact (a veces incluido en el tema, pero se recomienda)
import 'primereact/resources/primereact.min.css';

// Iconos
import 'primeicons/primeicons.css';

// Utilidades de espaciado y flex (opcional pero muy útil)
import 'primeflex/primeflex.css';

// Tus estilos globales (si los tienes)
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);