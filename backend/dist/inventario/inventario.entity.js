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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventario = void 0;
// 📌 backend/src/inventario/inventario.entity.ts
const typeorm_1 = require("typeorm");
const categorias_entity_1 = require("../categorias/categorias.entity");
const marcas_entity_1 = require("../marcas/marcas.entity");
// Convierte DECIMAL (BD) ⇄ number (JS)
const decimalToNumber = {
    to: (value) => value,
    from: (value) => Number(value),
};
let Inventario = class Inventario {
};
exports.Inventario = Inventario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Inventario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], Inventario.prototype, "nombreProducto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, nullable: true, unique: true }),
    __metadata("design:type", Object)
], Inventario.prototype, "codigoBarras", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Inventario.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, transformer: decimalToNumber }),
    __metadata("design:type", Number)
], Inventario.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Inventario.prototype, "fechaCaducidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Inventario.prototype, "imagenPath", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categorias_entity_1.Categoria, { nullable: false, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'categoriaId' }),
    __metadata("design:type", categorias_entity_1.Categoria)
], Inventario.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Inventario.prototype, "categoriaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => marcas_entity_1.Marca, { nullable: false, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'marcaId' }),
    __metadata("design:type", marcas_entity_1.Marca)
], Inventario.prototype, "marca", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Inventario.prototype, "marcaId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Inventario.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Inventario.prototype, "updatedAt", void 0);
exports.Inventario = Inventario = __decorate([
    (0, typeorm_1.Index)('idx_inventario_nombre', ['nombreProducto']),
    (0, typeorm_1.Index)('idx_inventario_categoria', ['categoriaId']),
    (0, typeorm_1.Index)('idx_inventario_marca', ['marcaId']),
    (0, typeorm_1.Unique)('UQ_inventario_codigoBarras', ['codigoBarras']),
    (0, typeorm_1.Check)('CHK_inventario_cantidad_nonneg', '"cantidad" >= 0'),
    (0, typeorm_1.Check)('CHK_inventario_precio_nonneg', '"precio" >= 0'),
    (0, typeorm_1.Entity)('inventario')
], Inventario);
