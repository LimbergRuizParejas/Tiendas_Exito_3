import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Public } from './public.decorator';

@ApiTags('Auth') // 👉 Agrupa endpoints en Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 🟢 Registro de usuarios
   * Público (no requiere token)
   */
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiBody({ type: RegisterAuthDto })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async register(@Body() dto: RegisterAuthDto) {
    return this.authService.register(dto);
  }

  /**
   * 🟢 Login
   * Público (no requiere token)
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginAuthDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, devuelve token y datos del usuario',
  })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  async login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  /**
   * 🟢 Perfil del usuario autenticado
   * Requiere token válido
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve datos del usuario autenticado',
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  async getProfile(@Request() req: any) {
    return {
      message: 'Accediste a tu perfil protegido 🔐',
      user: req.user, // 👉 Passport agrega user al request
    };
  }

  /**
   * 🟢 Solo administradores
   * JWT + RolesGuard
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ruta exclusiva para administradores' })
  @ApiResponse({ status: 200, description: 'Acceso permitido para admin' })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado, requiere rol administrador',
  })
  async adminOnly() {
    return { message: 'Bienvenido administrador 👑' };
  }
}
