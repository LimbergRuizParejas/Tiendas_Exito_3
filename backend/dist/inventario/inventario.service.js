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
exports.InventarioService = void 0;
// 📂 backend/src/inventario/inventario.service.ts
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const inventario_entity_1 = require("./inventario.entity");
const stripUndefined = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
/** Convierte un web-path (/uploads/...) a ruta de FS */
function toFsPathFromWebAsset(webPath) {
    if (!webPath)
        return null;
    // Sólo permitimos rutas bajo /uploads/ por seguridad
    if (!webPath.startsWith('/uploads/'))
        return null;
    return path.resolve(process.cwd(), '.' + webPath);
}
/** Intenta borrar un archivo sin romper el flujo */
async function safeUnlink(filePath) {
    try {
        if (!filePath)
            return;
        await fs.unlink(filePath);
    }
    catch {
        // no-op
    }
}
let InventarioService = class InventarioService {
    constructor(inventarioRepository) {
        this.inventarioRepository = inventarioRepository;
    }
    // -----------------------------
    // READ
    // -----------------------------
    async findAll() {
        try {
            // Relaciones eager ya están en la entidad; igual forzamos orden
            return await this.inventarioRepository.find({ order: { id: 'DESC' } });
        }
        catch (error) {
            console.error('Error al obtener el inventario:', error);
            throw new common_1.InternalServerErrorException('No se pudo obtener el inventario.');
        }
    }
    async findOne(id) {
        try {
            const item = await this.inventarioRepository.findOne({ where: { id } });
            if (!item)
                throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado.`);
            return item;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            console.error('Error en findOne:', error);
            throw new common_1.InternalServerErrorException('No se pudo obtener el producto.');
        }
    }
    async findByBarcode(codigo) {
        try {
            const code = (codigo ?? '').trim();
            if (!code)
                return null;
            return await this.inventarioRepository.findOne({ where: { codigoBarras: code } });
        }
        catch (error) {
            console.error('Error en findByBarcode:', error);
            throw new common_1.InternalServerErrorException('No se pudo buscar por código de barras.');
        }
    }
    async getSummary() {
        try {
            const result = await this.inventarioRepository
                .createQueryBuilder('inventario')
                .select('SUM(inventario.cantidad)', 'totalProductos')
                .addSelect('SUM(inventario.cantidad * inventario.precio)', 'totalValor')
                .getRawOne();
            return {
                totalProductos: parseInt(result?.totalProductos || '0', 10),
                totalValor: parseFloat(result?.totalValor || '0'),
            };
        }
        catch (error) {
            console.error('Error al obtener el resumen:', error);
            throw new common_1.InternalServerErrorException('No se pudo obtener el resumen del inventario.');
        }
    }
    // -----------------------------
    // CREATE
    // -----------------------------
    async create(dto) {
        try {
            const payload = stripUndefined({
                ...dto,
                // permitir limpiar fecha si llega '' (desde formulario)
                fechaCaducidad: dto.fechaCaducidad === '' ? null : dto.fechaCaducidad,
            });
            const entity = this.inventarioRepository.create(payload);
            return await this.inventarioRepository.save(entity);
        }
        catch (error) {
            // 23505 = unique_violation (p.ej., codigoBarras duplicado)
            if (error?.code === '23505') {
                throw new common_1.ConflictException('Ya existe un producto con el mismo código de barras.');
            }
            console.error('Error al crear producto:', error);
            throw new common_1.InternalServerErrorException('No se pudo crear el producto.');
        }
    }
    // -----------------------------
    // GROUPED
    // -----------------------------
    async findGroupedByCategoryAndBrand() {
        try {
            return await this.inventarioRepository
                .createQueryBuilder('inventario')
                .innerJoin('inventario.categoria', 'categoria')
                .innerJoin('inventario.marca', 'marca')
                .select([
                'categoria.nombre AS categoria',
                'marca.nombre AS marca',
                'SUM(inventario.cantidad) AS totalCantidad',
                'SUM(inventario.cantidad * inventario.precio) AS totalValor',
            ])
                .groupBy('categoria.nombre')
                .addGroupBy('marca.nombre')
                .getRawMany();
        }
        catch (error) {
            console.error('Error al agrupar inventario:', error);
            throw new common_1.InternalServerErrorException('No se pudo agrupar el inventario.');
        }
    }
    // -----------------------------
    // UPDATE
    // -----------------------------
    async update(id, dto) {
        const producto = await this.inventarioRepository.findOne({ where: { id } });
        if (!producto)
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado.`);
        try {
            // permitir limpiar fecha si llega '' (desde formulario)
            if (dto.fechaCaducidad === '')
                dto.fechaCaducidad = null;
            // si cambia imagen, borrar la anterior
            if (dto.imagenPath && dto.imagenPath !== producto.imagenPath) {
                await safeUnlink(toFsPathFromWebAsset(producto.imagenPath));
            }
            Object.assign(producto, stripUndefined(dto));
            return await this.inventarioRepository.save(producto);
        }
        catch (error) {
            if (error?.code === '23505') {
                throw new common_1.ConflictException('Ya existe un producto con el mismo código de barras.');
            }
            console.error('Error al actualizar producto:', error);
            throw new common_1.InternalServerErrorException('No se pudo actualizar el producto.');
        }
    }
    // -----------------------------
    // STOCK
    // -----------------------------
    async updateStock(id, cantidad) {
        if (!Number.isInteger(cantidad) || cantidad < 0) {
            throw new common_1.BadRequestException('La cantidad debe ser un entero >= 0.');
        }
        const producto = await this.inventarioRepository.findOne({ where: { id } });
        if (!producto)
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado.`);
        try {
            producto.cantidad = cantidad;
            return await this.inventarioRepository.save(producto);
        }
        catch (error) {
            console.error('Error al actualizar stock:', error);
            throw new common_1.InternalServerErrorException('No se pudo actualizar el stock.');
        }
    }
    // -----------------------------
    // DELETE
    // -----------------------------
    async delete(id) {
        // buscamos para poder limpiar la imagen en disco si existe
        const producto = await this.inventarioRepository.findOne({ where: { id } });
        if (!producto)
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado.`);
        try {
            await this.inventarioRepository.delete(id);
            await safeUnlink(toFsPathFromWebAsset(producto.imagenPath));
        }
        catch (error) {
            console.error('Error al eliminar producto:', error);
            throw new common_1.InternalServerErrorException('No se pudo eliminar el producto.');
        }
    }
};
exports.InventarioService = InventarioService;
exports.InventarioService = InventarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventario_entity_1.Inventario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InventarioService);
