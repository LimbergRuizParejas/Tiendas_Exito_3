import { SetMetadata } from '@nestjs/common';

/**
 * Decorador para asignar roles a rutas protegidas
 * 
 * Ejemplo:
 *   @Roles('admin')
 *   @Roles('admin', 'superuser')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
