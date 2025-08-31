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
exports.UpdateInventoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const ToNumber = () => (0, class_transformer_1.Transform)(({ value }) => {
    if (value === '' || value === null || value === undefined)
        return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : value;
});
const TrimToUndefined = () => (0, class_transformer_1.Transform)(({ value }) => {
    if (value === null || value === undefined)
        return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
});
class UpdateInventoryDto {
}
exports.UpdateInventoryDto = UpdateInventoryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    TrimToUndefined(),
    (0, class_validator_1.IsString)({ message: 'El nombre del producto debe ser texto.' }),
    __metadata("design:type", String)
], UpdateInventoryDto.prototype, "nombreProducto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    (0, class_validator_1.IsOptional)(),
    ToNumber(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'La cantidad debe ser un entero.' }),
    (0, class_validator_1.Min)(0, { message: 'La cantidad no puede ser negativa.' }),
    __metadata("design:type", Number)
], UpdateInventoryDto.prototype, "cantidad", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    (0, class_validator_1.IsOptional)(),
    ToNumber(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ allowNaN: false, maxDecimalPlaces: 2 }, { message: 'El precio debe ser numérico (hasta 2 decimales).' }),
    (0, class_validator_1.Min)(0, { message: 'El precio no puede ser negativo.' }),
    __metadata("design:type", Number)
], UpdateInventoryDto.prototype, "precio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    (0, class_validator_1.IsOptional)(),
    ToNumber(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'categoriaId debe ser entero.' }),
    (0, class_validator_1.Min)(1, { message: 'categoriaId debe ser >= 1.' }),
    __metadata("design:type", Number)
], UpdateInventoryDto.prototype, "categoriaId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    (0, class_validator_1.IsOptional)(),
    ToNumber(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'marcaId debe ser entero.' }),
    (0, class_validator_1.Min)(1, { message: 'marcaId debe ser >= 1.' }),
    __metadata("design:type", Number)
], UpdateInventoryDto.prototype, "marcaId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Código de barras (solo dígitos, 3–64).',
        example: '7501031311309',
    }),
    (0, class_validator_1.IsOptional)(),
    TrimToUndefined(),
    (0, class_validator_1.IsString)({ message: 'El código de barras debe ser texto.' }),
    (0, class_validator_1.Matches)(/^\d{3,64}$/, {
        message: 'El código de barras debe ser numérico (3 a 64 dígitos).',
    }),
    __metadata("design:type", String)
], UpdateInventoryDto.prototype, "codigoBarras", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    TrimToUndefined(),
    (0, class_validator_1.IsDateString)({}, { message: 'fechaCaducidad inválida (YYYY-MM-DD).' }),
    __metadata("design:type", String)
], UpdateInventoryDto.prototype, "fechaCaducidad", void 0);
