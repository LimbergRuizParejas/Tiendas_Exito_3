"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarcasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const marcas_controller_1 = require("./marcas.controller");
const marcas_service_1 = require("./marcas.service");
const marcas_entity_1 = require("./marcas.entity");
let MarcasModule = class MarcasModule {
};
exports.MarcasModule = MarcasModule;
exports.MarcasModule = MarcasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([marcas_entity_1.Marca])],
        controllers: [marcas_controller_1.MarcasController],
        providers: [marcas_service_1.MarcasService],
        exports: [typeorm_1.TypeOrmModule, marcas_service_1.MarcasService],
    })
], MarcasModule);
