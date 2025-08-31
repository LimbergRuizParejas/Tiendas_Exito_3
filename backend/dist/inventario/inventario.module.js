"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventarioModule = void 0;
// 📂 backend/src/inventario/inventario.module.ts
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const inventario_entity_1 = require("./inventario.entity");
const inventario_service_1 = require("./inventario.service");
const inventario_controller_1 = require("./inventario.controller");
let InventarioModule = class InventarioModule {
};
exports.InventarioModule = InventarioModule;
exports.InventarioModule = InventarioModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([inventario_entity_1.Inventario]),
            // Fallback global para uploads del módulo (el controlador puede sobreescribir storage)
            platform_express_1.MulterModule.register({
                limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
            }),
        ],
        controllers: [inventario_controller_1.InventarioController],
        providers: [inventario_service_1.InventarioService],
        exports: [typeorm_1.TypeOrmModule, inventario_service_1.InventarioService],
    })
], InventarioModule);
