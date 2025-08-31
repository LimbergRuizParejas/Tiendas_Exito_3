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
exports.Marca = void 0;
// src/marcas/marca.entity.ts
const typeorm_1 = require("typeorm");
const productos_entity_1 = require("../productos/productos.entity");
let Marca = class Marca {
    // ---------- Hooks: limpieza básica ----------
    normalize() {
        if (typeof this.nombre === 'string') {
            this.nombre = this.nombre.trim().replace(/\s+/g, ' ');
        }
        if (this.imagen != null) {
            const v = String(this.imagen).trim();
            this.imagen = v.length ? v : null;
        }
    }
};
exports.Marca = Marca;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Marca.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, comment: 'Nombre visible de la marca' }),
    __metadata("design:type", String)
], Marca.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 2048, nullable: true, comment: 'URL/Path de la imagen' }),
    __metadata("design:type", Object)
], Marca.prototype, "imagen", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => productos_entity_1.Producto, (producto) => producto.marca, {
        cascade: false, // evita crear/borrrar productos al tocar la marca
    }),
    __metadata("design:type", Object)
], Marca.prototype, "productos", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Marca.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Marca.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Object)
], Marca.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Marca.prototype, "normalize", null);
exports.Marca = Marca = __decorate([
    (0, typeorm_1.Entity)('marcas'),
    (0, typeorm_1.Index)('UQ_marcas_nombre', ['nombre'], { unique: true }) // nombre único
    ,
    (0, typeorm_1.Check)(`"nombre" <> ''`) // evita strings vacíos
], Marca);
