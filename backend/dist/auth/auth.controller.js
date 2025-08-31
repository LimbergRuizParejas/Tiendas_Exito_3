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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const login_auth_dto_1 = require("./dto/login-auth.dto");
const register_auth_dto_1 = require("./dto/register-auth.dto");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const roles_guard_1 = require("./roles.guard");
const roles_decorator_1 = require("./roles.decorator");
const public_decorator_1 = require("./public.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    /**
     * 🟢 Registro de usuarios
     * Público (no requiere token)
     */
    async register(dto) {
        return this.authService.register(dto);
    }
    /**
     * 🟢 Login
     * Público (no requiere token)
     */
    async login(dto) {
        return this.authService.login(dto);
    }
    /**
     * 🟢 Perfil del usuario autenticado
     * Requiere token válido
     */
    async getProfile(req) {
        return {
            message: 'Accediste a tu perfil protegido 🔐',
            user: req.user, // 👉 Passport agrega user al request
        };
    }
    /**
     * 🟢 Solo administradores
     * JWT + RolesGuard
     */
    async adminOnly() {
        return { message: 'Bienvenido administrador 👑' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar nuevo usuario' }),
    (0, swagger_1.ApiBody)({ type: register_auth_dto_1.RegisterAuthDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario registrado correctamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_auth_dto_1.RegisterAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar sesión' }),
    (0, swagger_1.ApiBody)({ type: login_auth_dto_1.LoginAuthDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login exitoso, devuelve token y datos del usuario',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Credenciales incorrectas' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_auth_dto_1.LoginAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener perfil del usuario autenticado' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Devuelve datos del usuario autenticado',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token inválido o expirado' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)('admin-only'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ruta exclusiva para administradores' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Acceso permitido para admin' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Acceso denegado, requiere rol administrador',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminOnly", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth') // 👉 Agrupa endpoints en Swagger
    ,
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
