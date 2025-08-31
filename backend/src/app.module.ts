import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

/**
 * ✅ Importar módulos funcionales / de dominio
 */
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { MarcasModule } from './marcas/marcas.module';
import { InventarioModule } from './inventario/inventario.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { CajaModule } from './caja/caja.module';

@Module({
  imports: [
    /**
     * 🌍 Configuración global
     * Permite acceder a variables de entorno desde cualquier módulo.
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // ✅ lee las variables de entorno desde .env
    }),

    /**
     * 🗄️ Configuración TypeORM (PostgreSQL)
     * `autoLoadEntities: true` asegura que las entidades de todos los módulos se registren automáticamente.
     * `synchronize: true` solo debe usarse en desarrollo (⚠️ en producción se recomienda migraciones).
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get<number>('DB_PORT', 5432)),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'tienda_exito'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),

    /**
     * 📦 Módulos de negocio
     */
    ProductosModule,
    CategoriasModule,
    MarcasModule,
    InventarioModule,
    ChatbotModule,
    UsuariosModule,
    AuthModule,
    CajaModule,

    /**
     * 🔐 JWT global
     * Configuración centralizada de JWT para que pueda ser reutilizado en cualquier módulo.
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'secret_default'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '2h'),
        },
      }),
    }),
  ],
})
export class AppModule {}
