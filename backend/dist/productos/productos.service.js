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
exports.ProductosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const productos_entity_1 = require("./productos.entity");
const categorias_entity_1 = require("../categorias/categorias.entity");
const marcas_entity_1 = require("../marcas/marcas.entity");
let ProductosService = class ProductosService {
    constructor(productosRepository, categoriasRepository, marcasRepository) {
        this.productosRepository = productosRepository;
        this.categoriasRepository = categoriasRepository;
        this.marcasRepository = marcasRepository;
    }
    // Obtener todos los productos con sus relaciones, ordenados por categoría y marca
    async findAll() {
        return this.productosRepository.find({
            relations: ['categoria', 'marca'],
            order: {
                categoria: { nombre: 'ASC' }, // Ordenar por nombre de categoría
                marca: { nombre: 'ASC' }, // Luego por nombre de marca
            },
        });
    }
    // Obtener un producto específico por ID
    async findOne(id) {
        const producto = await this.productosRepository.findOne({
            where: { id },
            relations: ['categoria', 'marca'],
        });
        if (!producto) {
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado`);
        }
        return producto;
    }
    // Crear un nuevo producto con relaciones
    async create(data) {
        const producto = this.productosRepository.create(data);
        // Validar y asignar categoría
        if (data.categoria?.id) {
            const categoria = await this.categoriasRepository.findOne({ where: { id: data.categoria.id } });
            if (!categoria) {
                throw new common_1.NotFoundException(`Categoría con ID ${data.categoria.id} no encontrada`);
            }
            producto.categoria = categoria;
        }
        // Validar y asignar marca
        if (data.marca?.id) {
            const marca = await this.marcasRepository.findOne({ where: { id: data.marca.id } });
            if (!marca) {
                throw new common_1.NotFoundException(`Marca con ID ${data.marca.id} no encontrada`);
            }
            producto.marca = marca;
        }
        return this.productosRepository.save(producto);
    }
    // Actualizar un producto existente
    async update(id, data) {
        const producto = await this.findOne(id);
        // Validar y asignar categoría si se envía
        if (data.categoria?.id) {
            const categoria = await this.categoriasRepository.findOne({ where: { id: data.categoria.id } });
            if (!categoria) {
                throw new common_1.NotFoundException(`Categoría con ID ${data.categoria.id} no encontrada`);
            }
            producto.categoria = categoria;
        }
        // Validar y asignar marca si se envía
        if (data.marca?.id) {
            const marca = await this.marcasRepository.findOne({ where: { id: data.marca.id } });
            if (!marca) {
                throw new common_1.NotFoundException(`Marca con ID ${data.marca.id} no encontrada`);
            }
            producto.marca = marca;
        }
        // Actualizar otros campos
        Object.assign(producto, data);
        return this.productosRepository.save(producto);
    }
    // Eliminar un producto
    async remove(id) {
        const result = await this.productosRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado`);
        }
    }
};
exports.ProductosService = ProductosService;
exports.ProductosService = ProductosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(productos_entity_1.Producto)),
    __param(1, (0, typeorm_2.InjectRepository)(categorias_entity_1.Categoria)),
    __param(2, (0, typeorm_2.InjectRepository)(marcas_entity_1.Marca)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], ProductosService);
