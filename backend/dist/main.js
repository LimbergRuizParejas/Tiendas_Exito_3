"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// 📌 src/main.ts
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_2 = require("@nestjs/core");
const express = __importStar(require("express"));
const path_1 = require("path");
function sanitizePrefix(raw) {
    const value = (raw ?? 'api').replace(/^\/+|\/+$/g, ''); // sin slashes a los lados
    return value.length ? value : 'api';
}
function parseOrigins(envList) {
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
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
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
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
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
    const API_STRICT = (process.env.API_STRICT ?? (process.env.NODE_ENV === 'production' ? 'true' : 'false'))
        .toLowerCase() === 'true';
    // 📌 src/main.ts  (solo este bloque)
    // 📌 src/main.ts  (solo este bloque)
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false, // ⬅️ antes estaba true
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    // Serialización (excluir @Expose/@Exclude, transformers, etc.)
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_2.Reflector)));
    /* ==========================
       Swagger
    ========================== */
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('API de Tienda de Abarrotes')
        .setDescription('📦 Documentación de la API')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'Token JWT obtenido en login',
    }, 'access-token')
        .build();
    const swaggerDoc = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup(`${GLOBAL_PREFIX}/docs`, app, swaggerDoc, {
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
