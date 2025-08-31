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
exports.MarcasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const marcas_entity_1 = require("./marcas.entity");
let MarcasService = class MarcasService {
    constructor(marcasRepository) {
        this.marcasRepository = marcasRepository;
    }
    findAll() {
        return this.marcasRepository.find();
    }
    async findOne(id) {
        const marca = await this.marcasRepository.findOne({ where: { id } });
        if (!marca)
            throw new common_1.NotFoundException(`Marca con ID ${id} no encontrada`);
        return marca;
    }
    create(dto) {
        const entity = this.marcasRepository.create({
            nombre: dto.nombre.trim(),
            imagen: dto.imagen?.trim() ?? null,
        });
        return this.marcasRepository.save(entity);
    }
    async update(id, dto) {
        const marca = await this.findOne(id);
        if (dto.nombre !== undefined)
            marca.nombre = dto.nombre.trim();
        if (dto.imagen !== undefined)
            marca.imagen = dto.imagen?.trim() ?? null;
        return this.marcasRepository.save(marca);
    }
    async remove(id) {
        const result = await this.marcasRepository.delete(id);
        if (!result.affected) {
            throw new common_1.NotFoundException(`Marca con ID ${id} no encontrada para eliminar`);
        }
    }
};
exports.MarcasService = MarcasService;
exports.MarcasService = MarcasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(marcas_entity_1.Marca)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], MarcasService);
