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
exports.UpdateStockDto = void 0;
// 📌 backend/src/inventario/update-stock.dto.ts
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/* =============================
   Helper: convierte string→number
============================= */
const ToNumber = () => (0, class_transformer_1.Transform)(({ value }) => {
    if (value === '' || value === null || value === undefined)
        return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : value; // si no es número, lo deja para que falle la validación
});
class UpdateStockDto {
}
exports.UpdateStockDto = UpdateStockDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5,
        type: Number,
        description: 'Nueva cantidad de stock para el producto (entero >= 0).',
    }),
    ToNumber(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'La cantidad debe ser un número entero.' }),
    (0, class_validator_1.Min)(0, { message: 'La cantidad no puede ser negativa.' }),
    __metadata("design:type", Number)
], UpdateStockDto.prototype, "cantidad", void 0);
