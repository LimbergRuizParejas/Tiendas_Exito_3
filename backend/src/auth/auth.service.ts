// 📌 src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from '../usuarios/usuarios.entity';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 🟢 Registro de nuevo usuario
   */
  async register(dto: RegisterAuthDto): Promise<{
    message: string;
    user: { id: number; nombre: string; email: string; rol: RolUsuario };
    accessToken: string;
  }> {
    try {
      const emailNormalized = dto.email.toLowerCase().trim();

      // Verificar si el email ya existe
      const exists = await this.userRepository.findOne({
        where: { email: emailNormalized },
      });
      if (exists) {
        throw new ConflictException('El email ya está registrado.');
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(dto.password, this.saltRounds);

      // Crear usuario con rol por defecto
      const newUser = this.userRepository.create({
        nombre: dto.nombre.trim(),
        email: emailNormalized,
        password: hashedPassword,
        rol: dto.rol ? (dto.rol as RolUsuario) : RolUsuario.USUARIO,
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
    } catch (error) {
      console.error('❌ Error en el registro:', error);
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('No se pudo registrar el usuario.');
    }
  }

  /**
   * 🟢 Login de usuario
   */
  async login(dto: LoginAuthDto): Promise<{
    message: string;
    user: { id: number; nombre: string; email: string; rol: RolUsuario };
    accessToken: string;
  }> {
    try {
      const emailNormalized = dto.email.toLowerCase().trim();

      // Buscar usuario por email con contraseña incluida
      const user = await this.userRepository.findOne({
        where: { email: emailNormalized },
        select: ['id', 'nombre', 'email', 'password', 'rol'],
      });

      if (!user) {
        throw new UnauthorizedException('Credenciales incorrectas');
      }

      // Comparar contraseñas
      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Credenciales incorrectas');
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
    } catch (error) {
      console.error('❌ Error en login:', error);
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Error al intentar iniciar sesión.');
    }
  }

  /**
   * 🟢 Verificar token
   */
  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  /**
   * 🟢 Obtener usuario desde token
   */
  async getProfile(token: string): Promise<{
    id: number;
    nombre: string;
    email: string;
    rol: RolUsuario;
  }> {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      return {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      };
    } catch (error) {
      console.error('❌ Error en getProfile:', error);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
