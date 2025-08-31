"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const categorias_controller_1 = require("./categorias.controller");
const categorias_service_1 = require("./categorias.service");
const categorias_entity_1 = require("./categorias.entity");
let CategoriasModule = class CategoriasModule {
};
exports.CategoriasModule = CategoriasModule;
exports.CategoriasModule = CategoriasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([categorias_entity_1.Categoria]), // Registrar el repositorio de `Categoria`
        ],
        controllers: [categorias_controller_1.CategoriasController], // Controlador de categorías
        providers: [categorias_service_1.CategoriasService], // Servicio de categorías
        exports: [
            typeorm_1.TypeOrmModule, // Exportar para que otros módulos puedan usar `Categoria`
            categorias_service_1.CategoriasService, // Exportar el servicio si es necesario
        ],
    })
], CategoriasModule);
