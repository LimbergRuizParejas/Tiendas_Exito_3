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
exports.CreateUserDto = void 0;
// 📂 backend/src/usuarios/dto/create-user.dto.ts
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/* =========================
   Helpers de transformación
   ========================= */
const Trim = () => (0, class_transformer_1.Transform)(({ value }) => value === null || value === undefined ? value : String(value).trim());
const LowercaseTrim = () => (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value);
const ToRole = () => (0, class_transformer_1.Transform)(({ value }) => value === null || value === undefined
    ? value
    : String(value).trim().toLowerCase());
class CreateUserDto {
    constructor() {
        this.rol = 'usuario'; // ✅ default
    }
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Juan Pérez',
        description: 'Nombre completo del usuario',
    }),
    Trim(),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser un texto válido.' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
    (0, class_validator_1.MaxLength)(50, { message: 'El nombre no debe superar los 50 caracteres.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'juan@example.com',
        description: 'Correo electrónico único del usuario',
    }),
    LowercaseTrim(),
    (0, class_validator_1.IsEmail)({}, { message: 'Debe ser un correo electrónico válido.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1234seguro',
        description: 'Contraseña del usuario (mín. 6 caracteres; se recomienda incluir letras y números).',
    }),
    Trim(),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser un texto.' }),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
    (0, class_validator_1.MaxLength)(100, {
        message: 'La contraseña no debe superar los 100 caracteres.',
    })
    // ✅ Si quieres reforzar complejidad, deja la línea siguiente; si no, quítala.
    ,
    (0, class_validator_1.Matches)(/^(?=.*[A-Za-z])(?=.*\d).{6,100}$/, {
        message: 'La contraseña debe incluir al menos una letra y un número.',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'usuario',
        description: 'Rol asignado al usuario (usuario o admin).',
    }),
    (0, class_validator_1.IsOptional)(),
    ToRole(),
    (0, class_validator_1.IsIn)(['usuario', 'admin'], { message: 'El rol debe ser usuario o admin.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "rol", void 0);
