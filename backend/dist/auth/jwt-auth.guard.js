"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    /**
     * 🔹 Maneja errores personalizados de autenticación
     */
    handleRequest(err, user, info, context) {
        if (err || !user) {
            // info puede contener mensajes como "jwt expired" o "invalid token"
            const mensaje = info?.message === 'No auth token'
                ? 'Falta el token de autenticación'
                : info?.message === 'jwt expired'
                    ? 'El token ha expirado'
                    : info?.message === 'invalid token'
                        ? 'Token inválido'
                        : 'No autorizado';
            throw err || new common_1.UnauthorizedException(mensaje);
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
