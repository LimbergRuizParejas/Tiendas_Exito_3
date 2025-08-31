import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard para validar roles usando metadata de @Roles()
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1) Obtiene los roles requeridos desde el decorador @Roles()
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      // Si no se especificaron roles, la ruta es pública a cualquier usuario autenticado
      return true;
    }

    // 2) Obtiene el usuario del request (inyectado por JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // 3) Verifica si el rol del usuario está dentro de los permitidos
    const hasRole = requiredRoles.includes(user.rol);

    if (!hasRole) {
      throw new ForbiddenException(
        `Acceso denegado. Requiere rol: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
