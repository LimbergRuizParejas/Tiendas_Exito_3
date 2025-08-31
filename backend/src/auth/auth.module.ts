// 📌 src/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    /**
     * ✅ Passport con estrategia JWT por defecto
     */
    PassportModule.register({ defaultStrategy: 'jwt' }),

    /**
     * ✅ Configuración JWT
     * Los valores se leen de variables de entorno si existen
     */
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret_default',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '2h',
      },
    }),

    /**
     * ✅ Importamos UsuariosModule
     * Envolvemos en forwardRef() para evitar error de dependencia circular
     */
    forwardRef(() => UsuariosModule),
  ],
  controllers: [
    /**
     * ✅ Endpoints de login, registro y rutas protegidas
     */
    AuthController,
  ],
  providers: [
    /**
     * ✅ Servicio de autenticación con login/registro
     */
    AuthService,

    /**
     * ✅ Estrategia JWT para validar tokens
     */
    JwtStrategy,

    /**
     * ✅ Guards de seguridad
     */
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [
    /**
     * ✅ Exportamos para que otros módulos puedan reutilizar
     */
    AuthService,
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}
