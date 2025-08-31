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
exports.RegisterAuthDto = void 0;
// 📌 src/auth/dto/register-auth.dto.ts
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const usuarios_entity_1 = require("../../usuarios/usuarios.entity");
class RegisterAuthDto {
    constructor() {
        this.rol = usuarios_entity_1.RolUsuario.USUARIO;
    }
}
exports.RegisterAuthDto = RegisterAuthDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Juan Pérez',
        description: 'Nombre completo del usuario',
    }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser un texto válido' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'El nombre no debe superar los 50 caracteres' }),
    __metadata("design:type", String)
], RegisterAuthDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'juan@example.com',
        description: 'Correo electrónico único del usuario',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Debe ser un correo electrónico válido' }),
    __metadata("design:type", String)
], RegisterAuthDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1234seguro',
        description: 'Contraseña del usuario (mínimo 6 caracteres)',
    }),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser un texto válido' }),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'La contraseña no debe superar los 100 caracteres' }),
    __metadata("design:type", String)
], RegisterAuthDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: usuarios_entity_1.RolUsuario.USUARIO,
        description: 'Rol asignado al usuario (usuario o admin). Por defecto "usuario".',
        required: false,
        enum: usuarios_entity_1.RolUsuario,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(usuarios_entity_1.RolUsuario, { message: 'El rol debe ser "usuario" o "admin"' }),
    __metadata("design:type", String)
], RegisterAuthDto.prototype, "rol", void 0);
