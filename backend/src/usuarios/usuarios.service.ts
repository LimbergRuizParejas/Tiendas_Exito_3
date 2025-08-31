import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuarios.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolUsuario } from './rol-usuario.enum'; // 👈 asegúrate de tener este enum

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  /**
   * 🟢 Listar todos los usuarios
   */
  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  /**
   * 🟢 Buscar un usuario por ID
   */
  async findOne(id: number): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  /**
   * 🟢 Crear un usuario nuevo
   */
  async create(dto: CreateUserDto): Promise<Usuario> {
    try {
      // verificar si el email ya existe
      const exists = await this.usuarioRepository.findOne({
        where: { email: dto.email },
      });
      if (exists) {
        throw new ConflictException('El email ya está registrado');
      }

      // ✅ Mapear rol correctamente al enum
      let rol: RolUsuario = RolUsuario.USUARIO;
      if (dto.rol && Object.values(RolUsuario).includes(dto.rol as RolUsuario)) {
        rol = dto.rol as RolUsuario;
      }

      const user = this.usuarioRepository.create({
        nombre: dto.nombre,
        email: dto.email,
        password: dto.password, // aquí deberías aplicar hash si lo usas
        rol,
      });

      return await this.usuarioRepository.save(user);
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('No se pudo crear el usuario');
    }
  }

  /**
   * 🟢 Actualizar un usuario existente
   */
  async update(id: number, dto: UpdateUserDto): Promise<Usuario> {
    const user = await this.findOne(id);

    // ✅ Validar si mandaron un rol válido
    if (dto.rol && Object.values(RolUsuario).includes(dto.rol as RolUsuario)) {
      user.rol = dto.rol as RolUsuario;
    }

    Object.assign(user, dto);

    return await this.usuarioRepository.save(user);
  }

  /**
   * 🟢 Eliminar un usuario
   */
  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.usuarioRepository.remove(user);
    return { message: `Usuario con ID ${id} eliminado correctamente` };
  }
}
