/* eslint-disable no-console */

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, Request, Response, urlencoded } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';

const isDev = process.env.NODE_ENV === 'development';

// Генерируем уникальный ID процесса
const processId = Math.random().toString(36).substring(2, 15);

async function bootstrap() {
  console.log(`[server/src/main.ts:${processId}] Starting server process...`);
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(helmet());
  app.use(json({ limit: '10kb' }));
  app.use(urlencoded({ extended: true, limit: '10kb' }));

  /* app.use(
   *   cors({
   *     origin: [> isDev ? 'http://localhost:5173' : <] '*', // exact origin of your frontend (no '*') if you use credentials
   *     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   *     credentials: true, // allow cookies
   *     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
   *   }),
   * );
   */

  const clientAppUrl = process.env.CLIENT_APP_URL;
  app.enableCors({
    // In production, specify allowed origins
    origin: isDev ? clientAppUrl : '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.setGlobalPrefix('api/v1');

  await app.listen(3000);
  console.log(
    `[${processId}] Application is running on: ${await app.getUrl()}`,
  );
}

// Обработчики сигналов для корректного завершения
process.on('SIGTERM', () => {
  console.log(`[${processId}] Received SIGTERM, shutting down gracefully...`);
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log(`[${processId}] Received SIGINT, shutting down gracefully...`);
  process.exit(0);
});

bootstrap().catch((err) => {
  console.error(`[${processId}] Fatal error during startup:`, err);
  process.exit(1);
});
