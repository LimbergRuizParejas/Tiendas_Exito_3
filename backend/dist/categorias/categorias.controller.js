"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const categorias_service_1 = require("./categorias.service");
const create_categoria_dto_1 = require("./create-categoria.dto");
const update_categoria_dto_1 = require("./update-categoria.dto");
const public_decorator_1 = require("../auth/public.decorator");
let CategoriasController = class CategoriasController {
    constructor(categoriasService) {
        this.categoriasService = categoriasService;
    }
    /** GET /api/categorias (público mientras desarrollas) */
    findAll() {
        return this.categoriasService.findAll();
    }
    /** GET /api/categorias/:id (público mientras desarrollas) */
    findOne(id) {
        return this.categoriasService.findOne(id);
    }
    /** POST /api/categorias */
    create(dto) {
        return this.categoriasService.create(dto);
    }
    /** PUT /api/categorias/:id */
    update(id, dto) {
        return this.categoriasService.update(id, dto);
    }
    /** DELETE /api/categorias/:id */
    async remove(id) {
        await this.categoriasService.remove(id);
    }
};
exports.CategoriasController = CategoriasController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar categorías' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OK' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una categoría por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OK' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear categoría' }),
    (0, swagger_1.ApiBody)({ type: create_categoria_dto_1.CreateCategoriaDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Creado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_categoria_dto_1.CreateCategoriaDto]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar categoría' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiBody)({ type: update_categoria_dto_1.UpdateCategoriaDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Actualizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_categoria_dto_1.UpdateCategoriaDto]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar categoría' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Eliminado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoriasController.prototype, "remove", null);
exports.CategoriasController = CategoriasController = __decorate([
    (0, swagger_1.ApiTags)('Categorias'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('categorias') // => /api/categorias (por tu prefijo global)
    ,
    __metadata("design:paramtypes", [categorias_service_1.CategoriasService])
], CategoriasController);
