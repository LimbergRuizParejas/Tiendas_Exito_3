// 📌 src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  ClassSerializerInterceptor,
  Logger,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Reflector } from '@nestjs/core';
import * as express from 'express';
import { join } from 'path';

function sanitizePrefix(raw?: string) {
  const value = (raw ?? 'api').replace(/^\/+|\/+$/g, ''); // sin slashes a los lados
  return value.length ? value : 'api';
}

function parseOrigins(envList?: string): (string | RegExp)[] {
  // Permite CSV y espacios; soporta comodín simple *.dominio.com
  const defaults = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
  ];
  const list = (envList ?? '').split(',').map(s => s.trim()).filter(Boolean);
  const all = list.length ? list : defaults;
  return all.map(o => {
    if (o.startsWith('*.')) {
      // *.midominio.com -> /^https?:\/\/([^.]+\.)?midominio\.com(:\d+)?$/
      const host = o.slice(2).replace(/\./g, '\\.');
      return new RegExp(`^https?:\\/\\/([^.]+\\.)?${host}(?::\\d+)?$`, 'i');
    }
    return o;
  });
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // bufferLogs: true,  // habilítalo si aplicas Logger global
  });

  /* ==========================
     Prefijo global (/api)
  ========================== */
  const GLOBAL_PREFIX = sanitizePrefix(process.env.API_PREFIX);
  app.setGlobalPrefix(GLOBAL_PREFIX);

  /* ==========================
     Express settings
  ========================== */
  app.set('trust proxy', 1); // útil detrás de proxies (NGINX/Heroku/etc.)
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  /* ==========================
     Static files (uploads)
     http://localhost:3000/uploads/products/<archivo>
  ========================== */
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
    // setHeaders: (res) => res.setHeader('Cache-Control', 'public, max-age=3600'), // opcional
  });

  /* ==========================
     Límites de payload (JSON / form)
  ========================== */
  const MAX_PAYLOAD_MB = Number(process.env.MAX_PAYLOAD_MB ?? 10);
  app.use(express.json({ limit: `${MAX_PAYLOAD_MB}mb` }));
  app.use(express.urlencoded({ limit: `${MAX_PAYLOAD_MB}mb`, extended: true }));

  /* ==========================
     Validación global (DTOs)
     - whitelist: elimina props no declaradas
     - forbidNonWhitelisted: configurable por env (API_STRICT)
  ========================== */
  const API_STRICT =
    (process.env.API_STRICT ?? (process.env.NODE_ENV === 'production' ? 'true' : 'false'))
      .toLowerCase() === 'true';

// 📌 src/main.ts  (solo este bloque)
// 📌 src/main.ts  (solo este bloque)
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false, // ⬅️ antes estaba true
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
);


  // Serialización (excluir @Expose/@Exclude, transformers, etc.)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  /* ==========================
     Swagger
  ========================== */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API de Tienda de Abarrotes')
    .setDescription('📦 Documentación de la API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'Token JWT obtenido en login',
      },
      'access-token',
    )
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${GLOBAL_PREFIX}/docs`, app, swaggerDoc, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Tienda Abarrotes - API Docs',
  });

  /* ==========================
     CORS
     CORS_ORIGINS="http://foo.com, http://bar.com, *.mi-dominio.com"
  ========================== */
  const corsOrigins = parseOrigins(process.env.CORS_ORIGINS);
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    exposedHeaders: 'Content-Disposition',
  });

  /* ==========================
     Shutdown hooks (graceful)
  ========================== */
  app.enableShutdownHooks();

  /* ==========================
     Arranque
  ========================== */
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  const base = `http://localhost:${port}/${GLOBAL_PREFIX}`;
  logger.log('========================================');
  logger.log(`🚀 API:    ${base}`);
  logger.log(`📖 Docs:   ${base}/docs`);
  logger.log(`🖼  Files:  http://localhost:${port}/uploads/...`);
  logger.log(`🔒 Strict validation (API_STRICT): ${API_STRICT}`);
  logger.log(`🌐 CORS origins: ${corsOrigins.map(String).join(', ')}`);
  logger.log('========================================');
}

bootstrap();
