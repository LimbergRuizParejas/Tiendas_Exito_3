"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const productos_controller_1 = require("./productos.controller");
const productos_service_1 = require("./productos.service");
const productos_entity_1 = require("./productos.entity");
const categorias_module_1 = require("../categorias/categorias.module"); // Correcta ruta
const marcas_module_1 = require("../marcas/marcas.module"); // Correcta ruta
let ProductosModule = class ProductosModule {
};
exports.ProductosModule = ProductosModule;
exports.ProductosModule = ProductosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([productos_entity_1.Producto]),
            categorias_module_1.CategoriasModule, // Importar el módulo de categorías
            marcas_module_1.MarcasModule, // Importar el módulo de marcas
        ],
        controllers: [productos_controller_1.ProductosController],
        providers: [productos_service_1.ProductosService],
        exports: [productos_service_1.ProductosService], // Exportar si es necesario
    })
], ProductosModule);
