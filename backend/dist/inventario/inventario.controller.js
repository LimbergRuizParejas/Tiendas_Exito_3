"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventarioController = void 0;
// 📂 backend/src/inventario/inventario.controller.ts
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = __importStar(require("fs"));
const platform_express_1 = require("@nestjs/platform-express");
const inventario_service_1 = require("./inventario.service");
const crear_inventario_dto_1 = require("./crear-inventario.dto");
const update_inventory_dto_1 = require("./update-inventory.dto");
const update_stock_dto_1 = require("./update-stock.dto");
const swagger_1 = require("@nestjs/swagger");
const UPLOAD_DIR = (0, path_1.join)(process.cwd(), 'uploads', 'products');
const MAX_FILE_MB = 5;
// Asegura que exista el directorio para subidas
function ensureDir(dir) {
    try {
        fs.mkdirSync(dir, { recursive: true });
    }
    catch {
        /* no-op */
    }
}
// Filtro de archivos por mimetype (defensa temprana)
function imageFileFilter(_req, file, cb) {
    if (/^image\/(png|jpe?g|webp|gif)$/i.test(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Tipo de archivo no permitido. Use PNG, JPG, JPEG, WEBP o GIF.'), false);
    }
}
const storage = (0, multer_1.diskStorage)({
    destination: (_req, _file, cb) => {
        ensureDir(UPLOAD_DIR);
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${unique}${(0, path_1.extname)(file.originalname)}`);
    },
});
let InventarioController = class InventarioController {
    constructor(inventarioService) {
        this.inventarioService = inventarioService;
    }
    // -------------------------------------------------------------------------
    // READ (ENDPOINTS ESTÁTICOS PRIMERO PARA EVITAR COLISIÓN DE RUTAS)
    // -------------------------------------------------------------------------
    async findAll() {
        return this.inventarioService.findAll();
    }
    async getSummary() {
        return this.inventarioService.getSummary();
    }
    async findGroupedByCategoryAndBrand() {
        return this.inventarioService.findGroupedByCategoryAndBrand();
    }
    async findByBarcode(codigo) {
        const code = (codigo ?? '').trim();
        if (!code)
            return null;
        return this.inventarioService.findByBarcode(code);
    }
    async findOne(id) {
        return this.inventarioService.findOne(id);
    }
    // -------------------------------------------------------------------------
    // CREATE (multipart/form-data con imagen opcional)
    // -------------------------------------------------------------------------
    async create(dto, file) {
        if (process.env.NODE_ENV !== 'production') {
            console.log('POST /inventory BODY:', dto);
            console.log('POST /inventory FILE?:', !!file);
        }
        const imagenPath = file ? `/uploads/products/${file.filename}` : undefined;
        return this.inventarioService.create({ ...dto, imagenPath });
    }
    // -------------------------------------------------------------------------
    // UPDATE (multipart/form-data con posible reemplazo de imagen)
    // -------------------------------------------------------------------------
    async update(id, dto, file) {
        if (process.env.NODE_ENV !== 'production') {
            console.log('PUT /inventory/:id BODY:', dto);
            console.log('PUT /inventory/:id FILE?:', !!file);
        }
        const extra = file ? { imagenPath: `/uploads/products/${file.filename}` } : {};
        return this.inventarioService.update(id, { ...dto, ...extra });
    }
    // -------------------------------------------------------------------------
    // PATCH stock
    // -------------------------------------------------------------------------
    async updateStock(id, dto) {
        return this.inventarioService.updateStock(id, dto.cantidad);
    }
    // -------------------------------------------------------------------------
    // DELETE
    // -------------------------------------------------------------------------
    async delete(id) {
        await this.inventarioService.delete(id);
    }
};
exports.InventarioController = InventarioController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Listar inventario' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Listado del inventario' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Resumen del inventario (totales)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('grouped'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Inventario agrupado por categoría y marca' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "findGroupedByCategoryAndBrand", null);
__decorate([
    (0, common_1.Get)('by-barcode/:codigo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un producto por código de barras' }),
    (0, swagger_1.ApiParam)({ name: 'codigo', required: true, description: 'Código de barras (solo dígitos)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Producto encontrado (o null si no existe)' }),
    __param(0, (0, common_1.Param)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "findByBarcode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un producto por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, description: 'ID numérico del producto' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Producto encontrado' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', {
        storage,
        fileFilter: imageFileFilter,
        limits: { fileSize: MAX_FILE_MB * 1024 * 1024 },
    }))
    // Pipe a nivel de método para convivir con multipart (evita que el campo de archivo
    // choque con forbidNonWhitelisted del pipe global)
    ,
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear producto con imagen opcional' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['nombreProducto', 'cantidad', 'precio', 'categoriaId', 'marcaId'],
            properties: {
                nombreProducto: { type: 'string' },
                codigoBarras: { type: 'string', nullable: true, example: '7501031311309', description: 'Solo dígitos (3–64)' },
                cantidad: { type: 'number' },
                precio: { type: 'number' },
                categoriaId: { type: 'number' },
                marcaId: { type: 'number' },
                fechaCaducidad: { type: 'string', format: 'date', nullable: true },
                imagen: { type: 'string', format: 'binary', nullable: true, description: `Máx ${MAX_FILE_MB}MB` },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Producto creado' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Datos inválidos' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Conflicto (p.ej. código de barras duplicado)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /image\/(png|jpe?g|webp|gif)$/i })
        .addMaxSizeValidator({ maxSize: MAX_FILE_MB * 1024 * 1024 })
        .build({ fileIsRequired: false }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_inventario_dto_1.CrearInventarioDto, Object]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', {
        storage,
        fileFilter: imageFileFilter,
        limits: { fileSize: MAX_FILE_MB * 1024 * 1024 },
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar producto (con o sin nueva imagen)' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, description: 'ID numérico del producto' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                nombreProducto: { type: 'string' },
                codigoBarras: { type: 'string', nullable: true, example: '7501031311309', description: 'Solo dígitos (3–64)' },
                cantidad: { type: 'number' },
                precio: { type: 'number' },
                categoriaId: { type: 'number' },
                marcaId: { type: 'number' },
                fechaCaducidad: { type: 'string', format: 'date', nullable: true },
                imagen: { type: 'string', format: 'binary', nullable: true, description: `Máx ${MAX_FILE_MB}MB` },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Producto actualizado' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Datos inválidos' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Producto no encontrado' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Conflicto (p.ej. código de barras duplicado)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /image\/(png|jpe?g|webp|gif)$/i })
        .addMaxSizeValidator({ maxSize: MAX_FILE_MB * 1024 * 1024 })
        .build({ fileIsRequired: false }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_inventory_dto_1.UpdateInventoryDto, Object]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/stock'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar sólo el stock (cantidad)' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, description: 'ID numérico del producto' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Stock actualizado' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Datos inválidos' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_stock_dto_1.UpdateStockDto]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar producto' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, description: 'ID numérico del producto' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Eliminado' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventarioController.prototype, "delete", null);
exports.InventarioController = InventarioController = __decorate([
    (0, swagger_1.ApiTags)('Inventario'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('inventory') // => /api/inventory (por tu prefijo global)
    ,
    __metadata("design:paramtypes", [inventario_service_1.InventarioService])
], InventarioController);
