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
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuarios_entity_1 = require("./usuarios.entity");
const rol_usuario_enum_1 = require("./rol-usuario.enum"); // 👈 asegúrate de tener este enum
let UsuariosService = class UsuariosService {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    /**
     * 🟢 Listar todos los usuarios
     */
    async findAll() {
        return this.usuarioRepository.find();
    }
    /**
     * 🟢 Buscar un usuario por ID
     */
    async findOne(id) {
        const user = await this.usuarioRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return user;
    }
    /**
     * 🟢 Crear un usuario nuevo
     */
    async create(dto) {
        try {
            // verificar si el email ya existe
            const exists = await this.usuarioRepository.findOne({
                where: { email: dto.email },
            });
            if (exists) {
                throw new common_1.ConflictException('El email ya está registrado');
            }
            // ✅ Mapear rol correctamente al enum
            let rol = rol_usuario_enum_1.RolUsuario.USUARIO;
            if (dto.rol && Object.values(rol_usuario_enum_1.RolUsuario).includes(dto.rol)) {
                rol = dto.rol;
            }
            const user = this.usuarioRepository.create({
                nombre: dto.nombre,
                email: dto.email,
                password: dto.password, // aquí deberías aplicar hash si lo usas
                rol,
            });
            return await this.usuarioRepository.save(user);
        }
        catch (error) {
            console.error('❌ Error al crear usuario:', error);
            if (error instanceof common_1.ConflictException)
                throw error;
            throw new common_1.InternalServerErrorException('No se pudo crear el usuario');
        }
    }
    /**
     * 🟢 Actualizar un usuario existente
     */
    async update(id, dto) {
        const user = await this.findOne(id);
        // ✅ Validar si mandaron un rol válido
        if (dto.rol && Object.values(rol_usuario_enum_1.RolUsuario).includes(dto.rol)) {
            user.rol = dto.rol;
        }
        Object.assign(user, dto);
        return await this.usuarioRepository.save(user);
    }
    /**
     * 🟢 Eliminar un usuario
     */
    async remove(id) {
        const user = await this.findOne(id);
        await this.usuarioRepository.remove(user);
        return { message: `Usuario con ID ${id} eliminado correctamente` };
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuarios_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsuariosService);
