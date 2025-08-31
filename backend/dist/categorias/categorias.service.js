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
exports.CategoriasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const categorias_entity_1 = require("./categorias.entity");
let CategoriasService = class CategoriasService {
    constructor(categoriasRepository) {
        this.categoriasRepository = categoriasRepository;
    }
    findAll() {
        return this.categoriasRepository.find();
    }
    async findOne(id) {
        const categoria = await this.categoriasRepository.findOne({ where: { id } });
        if (!categoria) {
            throw new common_1.NotFoundException(`Categoria con ID ${id} no encontrada`);
        }
        return categoria;
    }
    async create(dto) {
        const categoria = this.categoriasRepository.create({ nombre: dto.nombre });
        return this.categoriasRepository.save(categoria);
    }
    async update(id, dto) {
        const categoria = await this.findOne(id);
        if (dto.nombre !== undefined) {
            categoria.nombre = dto.nombre;
        }
        await this.categoriasRepository.save(categoria);
        return categoria;
    }
    async remove(id) {
        const result = await this.categoriasRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Categoria con ID ${id} no encontrada para eliminar`);
        }
    }
};
exports.CategoriasService = CategoriasService;
exports.CategoriasService = CategoriasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(categorias_entity_1.Categoria)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], CategoriasService);
