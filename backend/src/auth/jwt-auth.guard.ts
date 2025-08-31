import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * 🔹 Maneja errores personalizados de autenticación
   */
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      // info puede contener mensajes como "jwt expired" o "invalid token"
      const mensaje =
        info?.message === 'No auth token'
          ? 'Falta el token de autenticación'
          : info?.message === 'jwt expired'
          ? 'El token ha expirado'
          : info?.message === 'invalid token'
          ? 'Token inválido'
          : 'No autorizado';

      throw err || new UnauthorizedException(mensaje);
    }
    return user;
  }
}
