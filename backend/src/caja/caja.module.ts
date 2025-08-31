// 📌 src/caja/caja.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ✅ Entidad
import { Caja } from './caja.entity';

// ✅ Servicio y Controlador
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';

@Module({
  imports: [
    // 👉 Se registra la entidad "Caja" en el repositorio de TypeORM
    TypeOrmModule.forFeature([Caja]),
  ],
  controllers: [
    // 👉 Controlador que expone las rutas /caja
    CajaController,
  ],
  providers: [
    // 👉 Lógica de negocio
    CajaService,
  ],
  exports: [
    // 👉 Exportamos el servicio y repositorio para poder reutilizar en otros módulos
    CajaService,
    TypeOrmModule,
  ],
})
export class CajaModule {}
