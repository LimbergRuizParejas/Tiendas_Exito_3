"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const usuarios_entity_1 = require("./usuarios.entity");
const usuarios_controller_1 = require("./usuarios.controller");
const usuarios_service_1 = require("./usuarios.service");
const auth_module_1 = require("../auth/auth.module");
let UsuariosModule = class UsuariosModule {
};
exports.UsuariosModule = UsuariosModule;
exports.UsuariosModule = UsuariosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            /**
             * ✅ Registramos la entidad Usuario en TypeORM.
             * Esto nos permite inyectar el repositorio de Usuario en el servicio.
             */
            typeorm_1.TypeOrmModule.forFeature([usuarios_entity_1.Usuario]),
            /**
             * ✅ forwardRef() se usa para resolver posibles dependencias circulares
             * entre UsuariosModule y AuthModule.
             */
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [
            /**
             * ✅ Controlador que expone las rutas HTTP relacionadas con usuarios.
             */
            usuarios_controller_1.UsuariosController,
        ],
        providers: [
            /**
             * ✅ Servicio que contiene toda la lógica de negocio de usuarios.
             */
            usuarios_service_1.UsuariosService,
        ],
        exports: [
            /**
             * ✅ Exportamos tanto el servicio como TypeOrmModule
             * para que puedan ser utilizados en otros módulos (ej: AuthModule).
             */
            usuarios_service_1.UsuariosService,
            typeorm_1.TypeOrmModule,
        ],
    })
], UsuariosModule);
