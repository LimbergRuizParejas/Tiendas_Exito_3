"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Public = exports.IS_PUBLIC_KEY = void 0;
const common_1 = require("@nestjs/common");
// Clave que usará el guard para saber si una ruta es pública
exports.IS_PUBLIC_KEY = 'isPublic';
/**
 * Decorador para marcar rutas públicas (sin necesidad de JWT).
 * Ejemplo:
 *   @Public()
 *   @Post('login')
 */
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;
