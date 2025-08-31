"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// 📌 src/auth/auth.service.ts
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuarios_entity_1 = require("../usuarios/usuarios.entity");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.saltRounds = 10;
    }
    /**
     * 🟢 Registro de nuevo usuario
     */
    async register(dto) {
        try {
            const emailNormalized = dto.email.toLowerCase().trim();
            // Verificar si el email ya existe
            const exists = await this.userRepository.findOne({
                where: { email: emailNormalized },
            });
            if (exists) {
                throw new common_1.ConflictException('El email ya está registrado.');
            }
            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(dto.password, this.saltRounds);
            // Crear usuario con rol por defecto
            const newUser = this.userRepository.create({
                nombre: dto.nombre.trim(),
                email: emailNormalized,
                password: hashedPassword,
                rol: dto.rol ? dto.rol : usuarios_entity_1.RolUsuario.USUARIO,
            });
            await this.userRepository.save(newUser);
            // Generar token
            const payload = { sub: newUser.id, email: newUser.email, rol: newUser.rol };
            const token = this.jwtService.sign(payload);
            return {
                message: 'Usuario registrado correctamente',
                user: {
                    id: newUser.id,
                    nombre: newUser.nombre,
                    email: newUser.email,
                    rol: newUser.rol,
                },
                accessToken: token,
            };
        }
        catch (error) {
            console.error('❌ Error en el registro:', error);
            if (error instanceof common_1.ConflictException)
                throw error;
            throw new common_1.InternalServerErrorException('No se pudo registrar el usuario.');
        }
    }
    /**
     * 🟢 Login de usuario
     */
    async login(dto) {
        try {
            const emailNormalized = dto.email.toLowerCase().trim();
            // Buscar usuario por email con contraseña incluida
            const user = await this.userRepository.findOne({
                where: { email: emailNormalized },
                select: ['id', 'nombre', 'email', 'password', 'rol'],
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Credenciales incorrectas');
            }
            // Comparar contraseñas
            const isMatch = await bcrypt.compare(dto.password, user.password);
            if (!isMatch) {
                throw new common_1.UnauthorizedException('Credenciales incorrectas');
            }
            // Generar token
            const payload = { sub: user.id, email: user.email, rol: user.rol };
            const token = this.jwtService.sign(payload);
            return {
                message: 'Login exitoso',
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol,
                },
                accessToken: token,
            };
        }
        catch (error) {
            console.error('❌ Error en login:', error);
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.InternalServerErrorException('Error al intentar iniciar sesión.');
        }
    }
    /**
     * 🟢 Verificar token
     */
    async verifyToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch {
            throw new common_1.UnauthorizedException('Token inválido o expirado');
        }
    }
    /**
     * 🟢 Obtener usuario desde token
     */
    async getProfile(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userRepository.findOne({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Usuario no encontrado');
            }
            return {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
            };
        }
        catch (error) {
            console.error('❌ Error en getProfile:', error);
            throw new common_1.UnauthorizedException('Token inválido o expirado');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuarios_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
