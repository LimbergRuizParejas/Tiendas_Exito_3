import { SetMetadata } from '@nestjs/common';

// Clave que usará el guard para saber si una ruta es pública
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorador para marcar rutas públicas (sin necesidad de JWT).
 * Ejemplo:
 *   @Public()
 *   @Post('login')
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
