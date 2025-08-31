"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
/**
 * ✅ Importar módulos funcionales / de dominio
 */
const productos_module_1 = require("./productos/productos.module");
const categorias_module_1 = require("./categorias/categorias.module");
const marcas_module_1 = require("./marcas/marcas.module");
const inventario_module_1 = require("./inventario/inventario.module");
const chatbot_module_1 = require("./chatbot/chatbot.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const auth_module_1 = require("./auth/auth.module");
const caja_module_1 = require("./caja/caja.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            /**
             * 🌍 Configuración global
             * Permite acceder a variables de entorno desde cualquier módulo.
             */
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env', // ✅ lee las variables de entorno desde .env
            }),
            /**
             * 🗄️ Configuración TypeORM (PostgreSQL)
             * `autoLoadEntities: true` asegura que las entidades de todos los módulos se registren automáticamente.
             * `synchronize: true` solo debe usarse en desarrollo (⚠️ en producción se recomienda migraciones).
             */
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: Number(configService.get('DB_PORT', 5432)),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'postgres'),
                    database: configService.get('DB_NAME', 'tienda_exito'),
                    autoLoadEntities: true,
                    synchronize: configService.get('NODE_ENV') !== 'production',
                    logging: configService.get('NODE_ENV') !== 'production',
                }),
            }),
            /**
             * 📦 Módulos de negocio
             */
            productos_module_1.ProductosModule,
            categorias_module_1.CategoriasModule,
            marcas_module_1.MarcasModule,
            inventario_module_1.InventarioModule,
            chatbot_module_1.ChatbotModule,
            usuarios_module_1.UsuariosModule,
            auth_module_1.AuthModule,
            caja_module_1.CajaModule,
            /**
             * 🔐 JWT global
             * Configuración centralizada de JWT para que pueda ser reutilizado en cualquier módulo.
             */
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET', 'secret_default'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN', '2h'),
                    },
                }),
            }),
        ],
    })
], AppModule);
