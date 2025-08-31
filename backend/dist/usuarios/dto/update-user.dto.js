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
exports.UpdateUserDto = void 0;
// 📂 backend/src/usuarios/dto/update-user.dto.ts
const mapped_types_1 = require("@nestjs/mapped-types");
const create_user_dto_1 = require("./create-user.dto");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
/* =========================
   Helpers de transformación
   ========================= */
const TrimToUndefined = () => (0, class_transformer_1.Transform)(({ value }) => {
    if (value === null || value === undefined)
        return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
});
const LowercaseTrimToUndefined = () => (0, class_transformer_1.Transform)(({ value }) => {
    if (value === null || value === undefined)
        return undefined;
    const s = String(value).trim().toLowerCase();
    return s === '' ? undefined : s;
});
const ToRole = () => (0, class_transformer_1.Transform)(({ value }) => {
    if (value === null || value === undefined)
        return undefined;
    const s = String(value).trim().toLowerCase();
    return s === '' ? undefined : s;
});
class UpdateUserDto extends (0, mapped_types_1.PartialType)(create_user_dto_1.CreateUserDto) {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Carlos Gómez',
        description: 'Nombre completo del usuario (opcional).',
    }),
    (0, class_validator_1.IsOptional)(),
    TrimToUndefined(),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser un texto válido.' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
    (0, class_validator_1.MaxLength)(50, { message: 'El nombre no debe superar los 50 caracteres.' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'carlos@example.com',
        description: 'Correo electrónico único (opcional).',
    }),
    (0, class_validator_1.IsOptional)(),
    LowercaseTrimToUndefined(),
    (0, class_validator_1.IsEmail)({}, { message: 'Debe ser un correo electrónico válido.' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'NuevaClave123',
        description: 'Nueva contraseña del usuario (mínimo 6 caracteres; se recomienda incluir letras y números).',
    }),
    (0, class_validator_1.IsOptional)(),
    TrimToUndefined(),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser un texto.' }),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
    (0, class_validator_1.MaxLength)(100, { message: 'La contraseña no debe superar los 100 caracteres.' }),
    (0, class_validator_1.Matches)(/^(?=.*[A-Za-z])(?=.*\d).{6,100}$/, {
        message: 'La contraseña debe incluir al menos una letra y un número.',
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'admin',
        description: 'Rol del usuario (usuario o admin, opcional).',
    }),
    (0, class_validator_1.IsOptional)(),
    ToRole(),
    (0, class_validator_1.IsIn)(['usuario', 'admin'], { message: 'El rol debe ser usuario o admin.' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "rol", void 0);
