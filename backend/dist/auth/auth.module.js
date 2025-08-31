"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
// 📌 src/auth/auth.module.ts
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const usuarios_module_1 = require("../usuarios/usuarios.module");
const jwt_strategy_1 = require("./jwt.strategy");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const roles_guard_1 = require("./roles.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            /**
             * ✅ Passport con estrategia JWT por defecto
             */
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            /**
             * ✅ Configuración JWT
             * Los valores se leen de variables de entorno si existen
             */
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'secret_default',
                signOptions: {
                    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
                },
            }),
            /**
             * ✅ Importamos UsuariosModule
             * Envolvemos en forwardRef() para evitar error de dependencia circular
             */
            (0, common_1.forwardRef)(() => usuarios_module_1.UsuariosModule),
        ],
        controllers: [
            /**
             * ✅ Endpoints de login, registro y rutas protegidas
             */
            auth_controller_1.AuthController,
        ],
        providers: [
            /**
             * ✅ Servicio de autenticación con login/registro
             */
            auth_service_1.AuthService,
            /**
             * ✅ Estrategia JWT para validar tokens
             */
            jwt_strategy_1.JwtStrategy,
            /**
             * ✅ Guards de seguridad
             */
            jwt_auth_guard_1.JwtAuthGuard,
            roles_guard_1.RolesGuard,
        ],
        exports: [
            /**
             * ✅ Exportamos para que otros módulos puedan reutilizar
             */
            auth_service_1.AuthService,
            jwt_1.JwtModule,
            passport_1.PassportModule,
        ],
    })
], AuthModule);
