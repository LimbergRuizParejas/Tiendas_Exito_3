import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuarios.entity';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    /**
     * ✅ Registramos la entidad Usuario en TypeORM.
     * Esto nos permite inyectar el repositorio de Usuario en el servicio.
     */
    TypeOrmModule.forFeature([Usuario]),

    /**
     * ✅ forwardRef() se usa para resolver posibles dependencias circulares
     * entre UsuariosModule y AuthModule.
     */
    forwardRef(() => AuthModule),
  ],

  controllers: [
    /**
     * ✅ Controlador que expone las rutas HTTP relacionadas con usuarios.
     */
    UsuariosController,
  ],

  providers: [
    /**
     * ✅ Servicio que contiene toda la lógica de negocio de usuarios.
     */
    UsuariosService,
  ],

  exports: [
    /**
     * ✅ Exportamos tanto el servicio como TypeOrmModule
     * para que puedan ser utilizados en otros módulos (ej: AuthModule).
     */
    UsuariosService,
    TypeOrmModule,
  ],
})
export class UsuariosModule {}
