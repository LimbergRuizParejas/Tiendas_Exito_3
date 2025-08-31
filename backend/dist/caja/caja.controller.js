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
exports.CajaController = void 0;
// 📂 src/caja/caja.controller.ts
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const caja_service_1 = require("./caja.service");
const create_caja_dto_1 = require("./dto/create-caja.dto");
const update_caja_dto_1 = require("./dto/update-caja.dto");
const public_decorator_1 = require("../auth/public.decorator");
let CajaController = class CajaController {
    constructor(cajaService) {
        this.cajaService = cajaService;
    }
    /**
     * 🟢 Crear un nuevo registro de caja
     * POST /api/caja
     */
    async create(dto) {
        return this.cajaService.create(dto);
    }
    /**
     * 🟢 Listar todos los registros de caja
     * GET /api/caja
     * (Temporalmente público para desarrollo)
     */
    async findAll() {
        return this.cajaService.findAll();
    }
    /**
     * 🟢 Obtener un registro por ID
     * GET /api/caja/:id
     * (Temporalmente público para desarrollo)
     */
    async findOne(id) {
        return this.cajaService.findOne(id);
    }
    /**
     * 🟢 Actualizar un registro por ID
     * PUT /api/caja/:id
     */
    async update(id, dto) {
        return this.cajaService.update(id, dto);
    }
    /**
     * 🟢 Eliminar un registro por ID
     * DELETE /api/caja/:id
     * Devuelve 204 No Content si todo va bien.
     */
    async remove(id) {
        await this.cajaService.remove(id);
        // 204: sin contenido
    }
};
exports.CajaController = CajaController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear registro de caja' }),
    (0, swagger_1.ApiBody)({ type: create_caja_dto_1.CreateCajaDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Registro creado correctamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_caja_dto_1.CreateCajaDto]),
    __metadata("design:returntype", Promise)
], CajaController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los registros de caja' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de registros obtenida correctamente',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CajaController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener registro por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Registro obtenido correctamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Registro no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CajaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar registro por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiBody)({ type: update_caja_dto_1.UpdateCajaDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Registro actualizado correctamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Registro no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_caja_dto_1.UpdateCajaDto]),
    __metadata("design:returntype", Promise)
], CajaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar registro por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Registro eliminado correctamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Registro no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CajaController.prototype, "remove", null);
exports.CajaController = CajaController = __decorate([
    (0, swagger_1.ApiTags)('Caja') // 👉 Grupo en Swagger
    ,
    (0, swagger_1.ApiBearerAuth)('access-token') // 👉 Muestra el botón Authorize (los GET son @Public por ahora)
    ,
    (0, common_1.Controller)('caja') // Con app.setGlobalPrefix('api') => /api/caja
    ,
    __metadata("design:paramtypes", [caja_service_1.CajaService])
], CajaController);
