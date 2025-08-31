"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CajaModule = void 0;
// 📌 src/caja/caja.module.ts
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
// ✅ Entidad
const caja_entity_1 = require("./caja.entity");
// ✅ Servicio y Controlador
const caja_service_1 = require("./caja.service");
const caja_controller_1 = require("./caja.controller");
let CajaModule = class CajaModule {
};
exports.CajaModule = CajaModule;
exports.CajaModule = CajaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // 👉 Se registra la entidad "Caja" en el repositorio de TypeORM
            typeorm_1.TypeOrmModule.forFeature([caja_entity_1.Caja]),
        ],
        controllers: [
            // 👉 Controlador que expone las rutas /caja
            caja_controller_1.CajaController,
        ],
        providers: [
            // 👉 Lógica de negocio
            caja_service_1.CajaService,
        ],
        exports: [
            // 👉 Exportamos el servicio y repositorio para poder reutilizar en otros módulos
            caja_service_1.CajaService,
            typeorm_1.TypeOrmModule,
        ],
    })
], CajaModule);
